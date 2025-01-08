"use strict";

const { OK } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log(req.body);
    new OK({
      message: "Create product successfully",
      metadata: await ProductFactory.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
