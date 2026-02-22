// ====== Shopify template header (copiado de tu product_template.csv) ======
const SHOPIFY_HEADER = [
  "Title","URL handle","Description","Vendor","Product category","Type","Tags",
  "Published on online store","Status","SKU","Barcode","Option1 name","Option1 value",
  "Option1 Linked To","Option2 name","Option2 value","Option2 Linked To","Option3 name",
  "Option3 value","Option3 Linked To","Price","Compare-at price","Cost per item",
  "Charge tax","Tax code","Unit price total measure","Unit price total measure unit",
  "Unit price base measure","Unit price base measure unit","Inventory tracker",
  "Inventory quantity","Continue selling when out of stock","Weight value (grams)",
  "Weight unit for display","Requires shipping","Fulfillment service","Product image URL",
  "Image position","Image alt text","Variant image URL","Gift card","SEO title",
  "SEO description","Color (product.metafields.shopify.color-pattern)",
  "Google Shopping / Google product category","Google Shopping / Gender",
  "Google Shopping / Age group","Google Shopping / Manufacturer part number (MPN)",
  "Google Shopping / Ad group name","Google Shopping / Ads labels",
  "Google Shopping / Condition","Google Shopping / Custom product",
  "Google Shopping / Custom label 0","Google Shopping / Custom label 1",
  "Google Shopping / Custom label 2","Google Shopping / Custom label 3",
  "Google Shopping / Custom label 4"
];

// ====== UI refs ======
const fileInput = document.getElementById("fileInput");
const pickFile = document.getElementById("pickFile");
const dropzone = document.getElementById("dropzone");

const btnConvert = document.getElementById("btnConvert");
const btnDownload = document.getElementById("btnDownload");

const fileNameEl = document.getElementById("fileName");
const rowCountEl = document.getElementById("rowCount");
const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");

const previewTable = document.getElementById("previewTable");
const thead = previewTable.querySelector("thead");
const tbody = previewTable.querySelector("tbody");

// ====== State ======
let excelRows = [];        // rows normalizados (objects)
let outputCsvText = "";    // CSV final

// ====== Helpers ======
function logLine(msg, type="info"){
  const prefix = type === "ok" ? "✅ " : type === "warn" ? "⚠️ " : type === "err" ? "❌ " : "• ";
  logEl.textContent += `${prefix}${msg}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

function setStatus(text, kind="info"){
  statusEl.textContent = text;
  statusEl.style.color =
    kind === "ok" ? "var(--good)" :
    kind === "err" ? "var(--bad)" :
    "var(--text)";
}

function slugify(s){
  return String(s ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function toNumberOrZero(v){
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

// CSV escape: si tiene coma, salto o comillas => "..." y comillas dobles
function csvEscape(value){
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function makeCsv(headerArr, rowArr){
  const lines = [];
  lines.push(headerArr.map(csvEscape).join(","));
  for (const row of rowArr){
    lines.push(headerArr.map(h => csvEscape(row[h] ?? "")).join(","));
  }
  return lines.join("\n");
}

// Detecta nombres con variantes comunes (tildes, mayúsculas, etc.)
function normalizeKey(k){
  return String(k ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// ====== Excel reading ======
function handleFile(file) {
  logEl.textContent = "";
  outputCsvText = "";
  excelRows = [];

  try {
    if (!file) {
      setStatus("Esperando archivo");
      btnConvert.disabled = true;
      btnDownload.disabled = true;
      return;
    }

    if (typeof XLSX === "undefined") {
      setStatus("Error: XLSX no cargó", "err");
      logLine("XLSX no está disponible. Revisa el <script> del CDN o usa versión local.", "err");
      btnConvert.disabled = true;
      btnDownload.disabled = true;
      return;
    }

    fileNameEl.textContent = file.name;
    rowCountEl.textContent = "—";
    setStatus("Leyendo Excel...");

    logLine(`Archivo recibido: ${file.name}`, "ok");
    logLine(`Tamaño: ${(file.size / (1024 * 1024)).toFixed(2)} MB`, "info");

    // Lectura robusta
    const reader = new FileReader();

    reader.onerror = () => {
      setStatus("Error leyendo archivo", "err");
      logLine("FileReader falló al leer el archivo.", "err");
      btnConvert.disabled = true;
      btnDownload.disabled = true;
    };

    reader.onload = () => {
      try {
        setStatus("Procesando hoja...");
        logLine("Leyendo workbook con XLSX...", "info");

        const data = reader.result;

        // Opciones rápidas/compatibles
        const workbook = XLSX.read(data, {
          type: "array",
          dense: true,
          cellText: false,
          cellNF: false,
          cellHTML: false,
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        logLine(`Hoja detectada: ${sheetName}`, "ok");

        setStatus("Convirtiendo a filas...");
        const raw = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

        if (!raw.length) {
          setStatus("Excel vacío", "err");
          logLine("No se encontraron filas en la primera hoja.", "err");
          btnConvert.disabled = true;
          btnDownload.disabled = true;
          return;
        }

        const sampleKeys = Object.keys(raw[0] ?? {});
        logLine(`Columnas detectadas: ${sampleKeys.join(" | ")}`, "info");

        // === detección flexible de columnas ===
        const keyMap = {};
        for (const k of sampleKeys) keyMap[normalizeKey(k)] = k;

        const getCol = (wanted) => {
          const w = normalizeKey(wanted);
          if (keyMap[w]) return keyMap[w];
          const candidates = Object.keys(keyMap);
          const found = candidates.find(x => x.includes(w));
          return found ? keyMap[found] : null;
        };

        const colArticulo =
          getCol("articulo") || getCol("artículo") || getCol("sku");
        const colDescripcion =
          getCol("descripcion") || getCol("descripción") || getCol("description");
        const colExistencia =
          getCol("existencia") || getCol("existencias") || getCol("inventario") || getCol("stock");
        const colProveedor =
          getCol("proveedor") || getCol("vendor");

        const colLinea = getCol("linea") || getCol("línea");
        const colBodega = getCol("bodega");
        const colBU = getCol("bu");

        const missing = [];
        if (!colArticulo) missing.push("Articulo");
        if (!colDescripcion) missing.push("Descripcion");
        if (!colExistencia) missing.push("Existencia");
        if (!colProveedor) missing.push("Proveedor");

        if (missing.length) {
          setStatus("Faltan columnas", "err");
          logLine(`Faltan columnas requeridas: ${missing.join(", ")}`, "err");
          logLine(`Renombra en Excel EXACTO: Articulo, Descripcion, Existencia, Proveedor`, "warn");
          btnConvert.disabled = true;
          btnDownload.disabled = true;
          return;
        }

        // Normalizar filas
        excelRows = raw.map((r, idx) => {
          const sku = String(r[colArticulo] ?? "").trim();
          const desc = String(r[colDescripcion] ?? "").trim();
          const vendor = String(r[colProveedor] ?? "").trim();
          const qty = toNumberOrZero(r[colExistencia]);

          const linea = colLinea ? String(r[colLinea] ?? "").trim() : "";
          const bodega = colBodega ? String(r[colBodega] ?? "").trim() : "";
          const bu = colBU ? String(r[colBU] ?? "").trim() : "";

          return {
            __row: idx + 2,
            Articulo: sku,
            Descripcion: desc,
            Proveedor: vendor,
            Existencia: qty,
            Linea: linea,
            Bodega: bodega,
            BU: bu,
          };
        }).filter(r => r.Articulo || r.Descripcion);

        rowCountEl.textContent = String(excelRows.length);
        setStatus("Excel cargado", "ok");
        logLine(`Filas útiles: ${excelRows.length}`, "ok");

        renderPreview(excelRows);

        btnConvert.disabled = excelRows.length === 0;
        btnDownload.disabled = true;

      } catch (err) {
        setStatus("Error procesando Excel", "err");
        logLine(String(err?.message || err), "err");
        btnConvert.disabled = true;
        btnDownload.disabled = true;
      }
    };

    reader.readAsArrayBuffer(file);

  } catch (err) {
    setStatus("Error inesperado", "err");
    logLine(String(err?.message || err), "err");
    btnConvert.disabled = true;
    btnDownload.disabled = true;
  }
}

// ====== Preview table ======
function renderPreview(rows){
  const cols = ["Articulo","Descripcion","Existencia","Linea","Proveedor","Bodega","BU"];

  thead.innerHTML = `<tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr>`;
  const slice = rows.slice(0, 12);
  tbody.innerHTML = slice.map(r => `
    <tr>
      ${cols.map(c => `<td>${escapeHtml(String(r[c] ?? ""))}</td>`).join("")}
    </tr>
  `).join("");

  if (rows.length > slice.length){
    tbody.innerHTML += `
      <tr>
        <td colspan="${cols.length}" class="muted" style="padding:10px;">
          ... mostrando ${slice.length} de ${rows.length}
        </td>
      </tr>
    `;
  }
}

function escapeHtml(s){
  return s
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// ====== Convert to Shopify CSV rows ======
function buildShopifyRows(rows){
  const out = [];

  for (const r of rows){
    const sku = r.Articulo;
    const title = r.Descripcion || sku;
    const handleBase = slugify(title) || slugify(sku);
    // handle único (Shopify): slug + sku
    const handle = `${handleBase}-${String(sku).toLowerCase()}`.slice(0, 150);

    // Tags: Linea + Proveedor + Bodega + BU (separados por coma)
    const tags = [r.Linea, r.Proveedor, r.Bodega, r.BU]
      .map(x => String(x || "").trim())
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(", ");

    const row = {};
    // Inicializa todas las columnas vacías
    for (const h of SHOPIFY_HEADER) row[h] = "";

    // Campos que llenamos
    row["Title"] = title;
    row["URL handle"] = handle;
    row["Description"] = title; // si quieres, aquí podrías meter una descripción más larga
    row["Vendor"] = r.Proveedor || "";
    row["Tags"] = tags;

    row["Published on online store"] = "TRUE";
    row["Status"] = "Active";

    row["SKU"] = sku;
    row["Inventory tracker"] = "shopify";
    row["Inventory quantity"] = String(Math.max(0, Math.trunc(r.Existencia)));

    row["Continue selling when out of stock"] = "DENY";
    row["Requires shipping"] = "TRUE";
    row["Fulfillment service"] = "manual";
    row["Charge tax"] = "TRUE";

    out.push(row);
  }

  return out;
}

// ====== Actions ======
btnConvert.addEventListener("click", () => {
  if (!excelRows.length){
    logLine("No hay datos cargados.", "err");
    return;
  }

  setStatus("Convirtiendo...");
  logLine("Generando CSV Shopify con header de la plantilla...", "info");

  // Validación básica
  const bad = excelRows.filter(r => !r.Articulo || !r.Proveedor);
  if (bad.length){
    logLine(`Hay ${bad.length} filas con Articulo o Proveedor vacío. Se exportan igual, pero te conviene corregir.`, "warn");
  }

  const shopifyRows = buildShopifyRows(excelRows);
  outputCsvText = makeCsv(SHOPIFY_HEADER, shopifyRows);

  setStatus("CSV listo", "ok");
  logLine(`Listo. Filas exportadas: ${shopifyRows.length}`, "ok");

  btnDownload.disabled = false;
});

btnDownload.addEventListener("click", () => {
  if (!outputCsvText){
    logLine("Primero presiona Convertir.", "warn");
    return;
  }
  const blob = new Blob([outputCsvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "shopify_products.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
  logLine("Descarga iniciada: shopify_products.csv", "ok");
});

// ====== File pick & drag-drop ======
pickFile.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  handleFile(file);
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  const file = e.dataTransfer.files?.[0];
  if (file) handleFile(file);
});

// init
setStatus("Esperando archivo");
logLine("Sube tu Excel para comenzar.");