const express = require("express");
const CustomerModel = require("../models/Customer");
const WarehouseModel = require("../models/Warehouse");
const SellerModel = require("../models/Seller");
const router = express.Router();

router.post("/newCustomer", async (req, res) => {
  const data = req.body;
  const newDoc = new CustomerModel(data);
  await newDoc.save();
  res.send("new customer added");
});

router.post("/newWarehouse", async (req, res) => {
  const data = req.body;
  const newDoc = new WarehouseModel(data);
  await newDoc.save();
  res.send("new warehouse added");
});

router.post("/newSeller", async (req, res) => {
  const data = req.body;
  const newDoc = new SellerModel(data);
  await newDoc.save();
  res.send("new seller added");
});

router.patch("/updataSeller/:sellerId", async (req, res) => {
  const data = req.body;
  const { sellerId } = req.params;
  await SellerModel.findByIdAndUpdate(sellerId, data);
  res.send(" seller updated");
});

module.exports = router;
