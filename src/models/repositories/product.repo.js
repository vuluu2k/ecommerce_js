"use strict";

const { getSelectData, unGetSelectData } = require("../../utils");
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

const searchProductByUser = ({ term }) => {
  const regexTerm = new RegExp(term);

  const results = product
    .find(
      {
        is_published: true,
        $text: { $search: regexTerm },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean()
    .exec();

  return results;
};

const findProduct = async ({ product_id, unselect }) => {
  return await product
    .findById(new Types.ObjectId(product_id))
    .select(unGetSelectData(unselect))
    .lean()
    .exec();
};

const updateProductById = async ({ product_id, model, isNew = true }) => {
  return await model
    .findByIdAndUpdate(product_id, payload, { new: isNew })
    .exec();
};

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };

  const products = await product
    .find(filter)
    .populate("product_shop", "name email -_id")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();

  return products;
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  queryProduct,
  findAllPublishedForShop,
  unPushProductByShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
  updateProductById,
};
