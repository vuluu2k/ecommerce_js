"use strict";

// Import required dependencies
const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

// Construct MongoDB connection string
const connectString = `mongodb://${host}:${port}/${name}`;

// Check if running in development environment
const isDev = process.env.NODE_ENV === "development";

/**
 * Database class implementing Singleton pattern
 * Ensures only one database connection is created throughout the application
 */
class Database {
  constructor() {
    this.connect();
  }

  // Method to establish MongoDB connection
  connect(type = "mongodb") {
    // Enable debugging in development mode
    if (isDev) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    // Attempt to connect to MongoDB
    mongoose
      .connect(connectString)
      .then(() => {
        countConnect(); // Track active connections
        console.log("MongoDB connected");
      })
      .catch((err) => console.log('"MongoDB connection error', err));
  }

  // Static method to get singleton instance
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

// Create and export singleton instance
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
