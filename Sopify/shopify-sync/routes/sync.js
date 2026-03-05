const express = require("express");
const router = express.Router();

const pool = require("../db");
const updateShopifyPrice = require("../services/shopify");
const syncPriceBySku = require("../services/syncPrice");

router.post("/update-price", async (req,res)=>{

  try {

    const { sku, precio, variant_id } = req.body;

    console.log("BODY:", req.body);

    if(!sku || !precio)
      return res.status(400).send("sku y precio requeridos");

    await pool.query(
      "UPDATE precio SET precio=$1, variant_id=$2 WHERE sku=$3",
      [precio, variant_id, sku]
    );

    await updateShopifyPrice(variant_id, precio);

    res.send("Precio actualizado");

  } catch(err){

    console.error(err);
    res.status(500).send("error");

  }

});

router.post("/sync-price", async (req,res)=>{

  try{

    const { sku } = req.body;

    await syncPriceBySku(sku);

    res.send("Precio sincronizado");

  }catch(err){

    console.error(err);
    res.status(500).send("error");

  }

});

module.exports = router;
