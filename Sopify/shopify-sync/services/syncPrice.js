const pool = require("../db");
const updateShopifyPrice = require("./shopify");

async function syncPriceBySku(sku){

  const result = await pool.query(
    "SELECT variant_id, precio FROM precio WHERE sku=$1",
    [sku]
  );

  if (!result.rows.length)
    throw new Error("SKU no existe");

  const { variant_id, precio } = result.rows[0];

  await updateShopifyPrice(variant_id, precio);

  return true;

}

module.exports = syncPriceBySku;