"use strict";

const { OK } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    new OK({
      message: "Create product successfully",
      metadata: await ProductFactory.createProduct(
        req.body.product_type,
        req.body
      ),
    });
  };
}

module.exports = new ProductController();
