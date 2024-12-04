const mongoose = require("mongoose");

SellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    location: {
      type: {},
    },
    productName: {
      type: String,
    },
    sellingPrice: {
      type: Number,
    },
    attributes: {
      type: {},
    },
  },
  {
    timestamps: true,
  }
);

const SellerModel = new mongoose.model("seller", SellerSchema);

module.exports = SellerModel;
