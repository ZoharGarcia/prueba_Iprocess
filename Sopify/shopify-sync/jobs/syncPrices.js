const cron = require("node-cron");
const pool = require("../db");
const updateShopifyPrice = require("../services/shopify");

function startSyncJob(){

  cron.schedule("*/5 * * * *", async () => {

    console.log("Sync precios iniciado");

    try{

      const result = await pool.query(
        "SELECT sku, variant_id, precio FROM precio WHERE variant_id IS NOT NULL"
      );

      for(const row of result.rows){

        try{

          await updateShopifyPrice(row.variant_id, row.precio);

          console.log("Sync:", row.sku);

        }catch(err){

          console.error("Error SKU", row.sku);

        }

      }

    }catch(err){

      console.error("Error job", err);

    }

  });

}

module.exports = startSyncJob;