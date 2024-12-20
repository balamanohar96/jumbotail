const express = require("express");
const CustomerModel = require("../schemaModels/CustomerSchema");
const WarehouseModel = require("../schemaModels/WarehouseSchema");
const SellerModel = require("../schemaModels/SellerShema");
const sendDataToDbRouter = express.Router();

sendDataToDbRouter.post("/newCustomer", async (req, res) => {
  const data = req.body;
  const newDoc = new CustomerModel(data);
  await newDoc.save();
  res.send("new customer added");
});

sendDataToDbRouter.post("/newWarehouse", async (req, res) => {
  const data = req.body;
  const newDoc = new WarehouseModel(data);
  await newDoc.save();
  res.send("new warehouse added");
});

sendDataToDbRouter.post("/newSeller", async (req, res) => {
  const data = req.body;
  const newDoc = new SellerModel(data);
  await newDoc.save();
  res.send("new seller added");
});

sendDataToDbRouter.patch("/updataSeller/:sellerId", async (req, res) => {
  const data = req.body;
  const { sellerId } = req.params;
  await SellerModel.findByIdAndUpdate(sellerId, data);
  res.send(" seller updated");
});

module.exports = sendDataToDbRouter;
