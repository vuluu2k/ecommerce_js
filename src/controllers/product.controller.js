"use strict";

const { OK } = require("../core/success.response");
const ProductFactory = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res, next) => {
    new OK({
      message: "Create product successfully",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: "Get all drafts successfully",
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new OK({
      message: "Publish product successfully",
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.product_id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new OK({
      message: "Unpublish product successfully",
      metadata: await ProductFactory.unPushProductByShop({
        product_id: req.params.product_id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all published for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllPublishedForShop = async (req, res, next) => {
    new OK({
      message: "Get all published successfully",
      metadata: await ProductFactory.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new OK({
      message: "Get list search successfully",
      metadata: await ProductFactory.searchProductByUser(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();
