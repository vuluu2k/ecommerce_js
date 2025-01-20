"use strict";

const {
  product,
  electronic,
  furniture,
  clothing,
} = require("../product.model");

const { Types } = require("mongoose");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });

  if (!foundProduct) return null;

  foundProduct.is_draft = false;
  foundProduct.is_published = true;

  return await foundProduct.save();
};

const unPushProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });

  if (!foundProduct) return null;

  foundProduct.is_draft = true;
  foundProduct.is_published = false;

  return await foundProduct.save();
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  queryProduct,
  findAllPublishedForShop,
  unPushProductByShop,
};
