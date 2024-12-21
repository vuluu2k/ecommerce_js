"use strict";

const mongoose = require("mongoose");

const connectString =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ecommerce";

mongoose
  .connect(connectString)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log('"MongoDB connection error', err));

// development
if (1 == 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
