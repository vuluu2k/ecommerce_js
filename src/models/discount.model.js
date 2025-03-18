"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      unique: true,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true,
      default: 1,
    },
    discount_uses_count: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_max_users_per_user: {
      type: Number,
      required: true,
      default: 1,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_max_order_value: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    discount_is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
};
