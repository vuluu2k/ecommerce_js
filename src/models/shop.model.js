"use strict";

const mongoose = require("mongoose");

// Define collection names for MongoDB
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";

// Define the shop schema with field validations and configurations
var shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,      // Remove whitespace from both ends
      maxLength: 150,  // Maximum length constraint
    },
    email: {
      type: String,
      unique: true,    // Ensure email uniqueness
      trim: true,      // Remove whitespace
    },
    password: {
      type: String,
      required: true,  // Password is mandatory
    },
    status: {
      type: String,
      enum: ["active", "inactive"],  // Only allow these values
      default: "active",             // Set default status
    },
    verify: {
      type: mongoose.Schema.Types.Boolean,
      default: false,  // Shop starts as unverified
    },
    roles: {
      type: Array,
      default: [],     // Default to empty roles array
    },
  },
  {
    timestamps: true,                // Add createdAt and updatedAt fields
    collection: COLLECTION_NAME,     // Specify collection name
  }
);

// Export the model with specified document and schema names
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);
