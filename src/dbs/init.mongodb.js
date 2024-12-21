"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${host}:${port}/${name}`;

const isDev = process.env.NODE_ENV === "development";

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (isDev) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString)
      .then(() => {
        countConnect();
        console.log("MongoDB connected");
      })
      .catch((err) => console.log('"MongoDB connection error', err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
