require("dotenv").config();

const express = require("express");

const webhook = require("./routes/webhook");
const sync = require("./routes/sync");

const startSyncJob = require("./jobs/syncPrices");

const app = express();

app.use(express.json());

app.use("/webhook", webhook);
app.use("/sync", sync);

startSyncJob();

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto " + process.env.PORT);
});