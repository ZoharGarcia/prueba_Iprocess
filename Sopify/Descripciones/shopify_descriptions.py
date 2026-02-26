import os
from typing import Optional, List, Dict, Any
import pandas as pd
import requests
from fastapi import FastAPI, HTTPException, Header

app = FastAPI(title="SKU Price Sync")

SHOPIFY_SHOP = os.getenv("SHOPIFY_SHOP")  # ej: "tu-tienda.myshopify.com"
SHOPIFY_TOKEN = os.getenv("SHOPIFY_ADMIN_TOKEN")  # Admin API access token
SHOPIFY_API_VERSION = os.getenv("SHOPIFY_API_VERSION", "2026-01")  # o "2025-10"
INTERNAL_KEY = os.getenv("INTERNAL_KEY")  # clave para proteger el endpoint
EXCEL_PATH = os.getenv("EXCEL_PATH", "./prices.xlsx")

if not SHOPIFY_SHOP or not SHOPIFY_TOKEN:
    # no revientes import; solo avisa cuando llamen endpoints
    pass


def shopify_graphql(query: str, variables: Optional[dict] = None) -> Dict[str, Any]:
    if not SHOPIFY_SHOP or not SHOPIFY_TOKEN:
        raise HTTPException(500, "Faltan SHOPIFY_SHOP o SHOPIFY_ADMIN_TOKEN en variables de entorno.")

    url = f"https://{SHOPIFY_SHOP}/admin/api/{SHOPIFY_API_VERSION}/graphql.json"
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_TOKEN,
    }
    resp = requests.post(url, json={"query": query, "variables": variables or {}}, headers=headers, timeout=60)
    if resp.status_code != 200:
        raise HTTPException(resp.status_code, f"Shopify GraphQL HTTP error: {resp.text}")

    data = resp.json()
    if "errors" in data and data["errors"]:
        raise HTTPException(400, f"Shopify GraphQL errors: {data['errors']}")
    return data["data"]


FIND_VARIANT_BY_SKU = """
query FindVariantBySku($q: String!) {
  productVariants(first: 5, query: $q) {
    edges {
      node {
        id
        sku
        price
        product { id title }
      }
    }
  }
}
"""

# Nota: Shopify permite actualizar precio a nivel de variante; según tu caso podrías preferir bulk.
UPDATE_VARIANT_PRICE = """
mutation UpdateVariant($input: ProductVariantInput!) {
  productVariantUpdate(input: $input) {
    productVariant {
      id
      price
      sku
    }
    userErrors {
      field
      message
    }
  }
}
"""


def read_excel_prices(path: str) -> pd.DataFrame:
    df = pd.read_excel(path, dtype={"sku": str})
    # Normaliza nombres comunes
    df.columns = [c.strip().lower() for c in df.columns]

    if "sku" not in df.columns or "price" not in df.columns:
        raise HTTPException(400, "El Excel debe tener columnas: sku, price (y opcional compare_at_price).")

    df["sku"] = df["sku"].astype(str).str.strip()
    df = df[df["sku"] != ""].copy()

    # Asegura formato numérico
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["price"])

    if "compare_at_price" in df.columns:
        df["compare_at_price"] = pd.to_numeric(df["compare_at_price"], errors="coerce")

    return df


def pick_exact_variant(edges: List[dict], sku: str) -> Optional[dict]:
    # Shopify search puede devolver “near matches” en algunos casos; filtramos exacto por sku.
    sku_norm = sku.strip()
    for e in edges:
        node = e["node"]
        if (node.get("sku") or "").strip() == sku_norm:
            return node
    return None


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/sync-prices")
def sync_prices(
    dry_run: bool = True,
    x_internal_key: Optional[str] = Header(default=None),
):
    if INTERNAL_KEY and x_internal_key != INTERNAL_KEY:
        raise HTTPException(401, "No autorizado.")

    df = read_excel_prices(EXCEL_PATH)

    results = {
        "total_rows": int(len(df)),
        "updated": 0,
        "skipped": 0,
        "errors": [],
        "dry_run": dry_run,
    }

    for _, row in df.iterrows():
        sku = str(row["sku"]).strip()
        new_price = float(row["price"])

        # 1) Buscar variante por SKU
        q = f"sku:{sku}"
        data = shopify_graphql(FIND_VARIANT_BY_SKU, {"q": q})
        edges = data["productVariants"]["edges"]
        variant = pick_exact_variant(edges, sku)

        if not variant:
            results["skipped"] += 1
            results["errors"].append({"sku": sku, "error": "SKU no encontrado (match exacto)."})
            continue

        variant_id = variant["id"]

        if dry_run:
            results["updated"] += 1
            continue

        # 2) Actualizar precio
        input_obj = {
            "id": variant_id,
            "price": f"{new_price:.2f}",
        }

        # opcional compare_at_price si existe y es válido
        if "compare_at_price" in df.columns and pd.notna(row.get("compare_at_price")):
            cap = float(row["compare_at_price"])
            input_obj["compareAtPrice"] = f"{cap:.2f}"

        upd = shopify_graphql(UPDATE_VARIANT_PRICE, {"input": input_obj})
        user_errors = upd["productVariantUpdate"]["userErrors"]
        if user_errors:
            results["skipped"] += 1
            results["errors"].append({"sku": sku, "error": user_errors})
        else:
            results["updated"] += 1

    return results