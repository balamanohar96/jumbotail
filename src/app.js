const connectDb = require("./config/database");
const CustomerModel = require("./models/Customer");
const WarehouseModel = require("./models/Warehouse");
const SellerModel = require("./models/Seller");
const express = require("express");
const app = express();
app.use(express.json());
const {
  calculateDistance,
  calculateFare,
} = require("./utils/calculateDistance");
const postApiRouter = require("./routes/postApi");

app.use("/", postApiRouter);

app.get("/api/v1/warehouse/nearest", async (req, res) => {
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

app.get("/api/v1/shipping-charge", async (req, res) => {
  try {
    let { deliverySpeed, warehouseId, customerId } = req.query;
    if (!deliverySpeed) {
      deliverySpeed = "standard";
    }
    if (!warehouseId || !customerId) {
      throw new Error("WarehosueId or customerId is not provided");
    }
    if (warehouseId.length !== 24) {
      throw new Error("WarehouseId is invalid");
    }
    if (customerId.length !== 24) {
      throw new Error("CustomerId is invalid");
    }
    const allowedDeliverySpeeds = ["standard", "express"];
    if (!allowedDeliverySpeeds.includes(deliverySpeed)) {
      throw new Error(`Delivery speed is invalid.  ${deliverySpeed}.`);
    }

    const warehouseDetails = await WarehouseModel.findById(warehouseId);
    if (!warehouseDetails) {
      throw new Error("WarehouseId is incorrect");
    }
    const customerDetails = await CustomerModel.findById(customerId);
    if (!customerDetails) {
      throw new Error("CustomerId is incorrect");
    }
    const distance = calculateDistance(
      warehouseDetails.location.lat,
      warehouseDetails.location.lon,
      customerDetails.location.lat,
      customerDetails.location.lon
    ).toFixed();

    const fare = calculateFare(Number(distance), deliverySpeed);

    res.json({ distance: distance + " km", shippingCharge: Math.round(fare) });
  } catch (err) {
    res.status(400).send("Err. " + err.message);
  }
});

app.post("/api/v1/shipping-charge/calculate", async (req, res) => {
  try {
    let { deliverySpeed, sellerId, customerId } = req.body;
    console.log(req.params);
    if (!deliverySpeed) {
      deliverySpeed = "standard";
    }
    if (!sellerId || !customerId) {
      throw new Error("SellerId or customerId is not provided");
    }
    if (sellerId.length !== 24) {
      throw new Error("SellerId is invalid");
    }
    if (customerId.length !== 24) {
      throw new Error("CustomerId is invalid");
    }
    const allowedDeliverySpeeds = ["standard", "express"];
    if (!allowedDeliverySpeeds.includes(deliverySpeed)) {
      throw new Error(`Delivery speed is invalid.  ${deliverySpeed}.`);
    }

    const sellerDetails = await SellerModel.findById(sellerId);
    if (!sellerDetails) {
      throw new Error("SellerId is incorrect");
    }
    const customerDetails = await CustomerModel.findById(customerId);
    if (!customerDetails) {
      throw new Error("CustomerId is incorrect");
    }

    const customerLat = customerDetails.location.lat;
    const customerLon = customerDetails.location.lon;
    const allWarehouseDetails = await WarehouseModel.find({}).select(
      "_id name location"
    );
    const distances = [];
    for (let i = 0; i < allWarehouseDetails.length; i++) {
      const warehouse = allWarehouseDetails[i];
      const { lat, lon } = warehouse.location;

      const distance = calculateDistance(lat, lon, customerLat, customerLon);
      distances.push(Number(distance.toFixed()));
    }
    const minDistance = Math.min(...distances);
    const index = distances.findIndex((each) => each === minDistance);
    const nearestWarehouse = allWarehouseDetails[index];

    const fare = calculateFare(minDistance, deliverySpeed);

    res.json({
      distance: minDistance + " km",
      shippingCharge: Math.round(fare),
      nearestWarehouse,
    });
  } catch (err) {
    res.status(400).send("Err. " + err.message);
  }
});

app.use("/", (req, res) => {
  res.status(400).send("Invalid API. Check API address.");
});

connectDb().then(() => {
  app.listen(3001, () => {
    console.log("server started");
  });
});
