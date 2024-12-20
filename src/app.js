const connectDb = require("./DBconfiguration/database");
const express = require("express");
const app = express();
app.use(express.json());
const sendDataToDbRouter = require("./routes/sendDataToDbAPI");
const nearestWarehouseRouter = require("./routes/nearestWarehouseAPI");
const shippingChargeRouter = require("./routes/shippingChargeAPI");

app.use("/", sendDataToDbRouter);
app.use("/", nearestWarehouseRouter);
app.use("/", shippingChargeRouter);

// if any api is not matched
app.use("/", (req, res) => {
  res.status(400).send("Invalid API. Check API address.");
});

//  server starting
connectDb().then(() => {
  app.listen(3001, () => {
    console.log("server started");
  });
});
