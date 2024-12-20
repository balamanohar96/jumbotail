// to get nearest warehouse API
const express = require("express");
const SellerModel = require("../schemaModels/SellerShema");
const WarehouseModel = require("../schemaModels/WarehouseSchema");
const { calculateDistance } = require("../utils/calculate");
const nearestWarehouseRouter = express.Router();

nearestWarehouseRouter.get("/api/v1/warehouse/nearest", async (req, res) => {
  try {
    const { sellerId } = req.query;
    if (!sellerId) {
      throw new Error("SellerId is not provided");
    }
    if (sellerId.length !== 24) {
      throw new Error("SellerId is invalid");
    }
    const sellerDetails = await SellerModel.findById(sellerId);
    if (!sellerDetails) {
      throw new Error("SellerId is incorrect");
    }
    const sellerLocation = sellerDetails.location;
    const sellLat = sellerLocation.lat;
    const sellLon = sellerLocation.lon;
    const allWarehouseDetails = await WarehouseModel.find({}).select(
      "_id name location"
    );
    const distances = [];
    for (let i = 0; i < allWarehouseDetails.length; i++) {
      const warehouse = allWarehouseDetails[i];
      const { lat, lon } = warehouse.location;

      const distance = calculateDistance(lat, lon, sellLat, sellLon);
      distances.push(Number(distance.toFixed()));
    }
    const min = Math.min(...distances);
    const index = distances.findIndex((each) => each === min);
    const warehouse = allWarehouseDetails[index];

    res.json({
      warehouseId: warehouse._id,
      warehouse: warehouse.name,
      warehouseLocation: warehouse.location,
      distance: min + " km",
    });
  } catch (err) {
    res.status(400).send("Err. " + err.message);
  }
});

module.exports = nearestWarehouseRouter;
