const mongoose = require("mongoose");
const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://balamanohar:tM0Sg3H35u4XHSp6@balacluster.7ljzw.mongodb.net/jumbotail"
  );
};

module.exports = connectDb;
