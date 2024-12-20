const connectDb = require("./DBconfiguration/database");
const express = require("express");
const app = express();
app.use(express.json());
const sendDataToDbRouter = require("./routes/sendDataToDb");
const nearestWarehouseRouter = require("./routes/nearestWarehouse");
const shippingChargeRouter = require("./routes/shippingCharge");

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
