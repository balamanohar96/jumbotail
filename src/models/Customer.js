const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    location: {
      type: {},
    },
  },
  {
    timestamps: true,
  }
);

const CustomerModel = new mongoose.model("customer", customerSchema);

module.exports = CustomerModel;
