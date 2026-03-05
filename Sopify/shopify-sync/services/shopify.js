const axios = require("axios");

async function updateShopifyPrice(variant_id, price) {

  const url =
  `https://${process.env.SHOPIFY_STORE}/admin/api/${process.env.SHOPIFY_API_VERSION}/variants/${variant_id}.json`;

  await axios.put(
    url,
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

  console.log("Precio actualizado en Shopify");

}

module.exports = updateShopifyPrice;