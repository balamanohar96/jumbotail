const mongoose = require("mongoose");

const WarehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    location: {
      type: {},
    },
  },
  { timestamps: true }
);

const WarehouseModel = new mongoose.model("warehouse", WarehouseSchema);

module.exports = WarehouseModel;
