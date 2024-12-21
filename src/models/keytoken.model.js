"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "KeyTokens";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      required: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
