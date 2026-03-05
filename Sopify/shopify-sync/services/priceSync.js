const axios = require("axios");
const pool = require("../db");

async function updateShopifyPrice(sku, price, variant_id) {

  await axios.put(
    `https://${process.env.SHOPIFY_STORE}/admin/api/${process.env.SHOPIFY_API_VERSION}/variants/${variant_id}.json`,
    {
      variant: {
        id: variant_id,
        price: price
      }
    },
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json"
      }
    }
  );

}

module.exports = updateShopifyPrice;