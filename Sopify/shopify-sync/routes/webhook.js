const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/product-update", async (req, res) => {

  console.log("Webhook recibido");

  try {

    const product = req.body;

    for (const variant of product.variants) {

      const sku = variant.sku;
      const price = variant.price;
      const variant_id = variant.id;

      if (!sku) continue;

      // actualizar precio
      await pool.query(
        "UPDATE precio SET precio=$1 WHERE sku=$2",
        [price, sku]
      );

      // guardar mapping SKU → variant
      await pool.query(
        `INSERT INTO precio (sku, variant_id)
         VALUES ($1,$2)
         ON CONFLICT (sku)
         DO UPDATE SET variant_id = EXCLUDED.variant_id`,
        [sku, variant_id]
      );

      console.log(`Actualizado SKU ${sku} -> ${price}`);

    }

    res.status(200).send("OK");

  } catch (err) {

    console.error(err);
    res.status(500).send("Error");

  }

});

module.exports = router;