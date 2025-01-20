"use strict";

const { set } = require("lodash");
const { Schema, model } = require("mongoose");
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_slug: {
      type: String,
      unique: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      enum: ["Electronics", "Clothing", "Furniture"],
      required: true,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    is_draft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    is_published: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// create index for search
productSchema.index({ product_name: "text", product_description: "text" });

// Document middleware runs before .save and .create
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Clothes",
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Furnitures",
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronics", electronicSchema),
  furniture: model("Furniture", furnitureSchema),
};
