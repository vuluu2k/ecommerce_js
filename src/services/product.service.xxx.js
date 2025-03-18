"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unPushProductByShop,
  queryProduct,
  searchProductByUser,
  findAllProduct,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { updateNestedObject } = require("../utils");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    this.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = this.productRegistry[type];

    if (!productClass) throw new BadRequestError("Invalid Product Type");

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, payload) {
    const productClass = this.productRegistry[type];

    if (!productClass) throw new BadRequestError("Invalid Product Type");

    return new productClass(payload).updateProduct(payload.product_id);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPushProductByShop({ product_shop, product_id }) {
    return await unPushProductByShop({ product_shop, product_id });
  }

  static async searchProductByUser({ term, limit, skip }) {
    return await searchProductByUser({ term });
  }

  static async findAllProduct({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { is_published: true },
  }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: ["_id", "product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unselect: ["__v"] });
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, is_draft: true };

    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, is_published: true };

    return await findAllPublishedForShop({ query, limit, skip });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });

    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: newProduct.product_shop,
        stock: newProduct.product_quantity,
      });
    }

    return newProduct;
  }

  async updateProduct(product_id, payload) {
    return await updateProductById({ product_id, model: product, payload });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) throw new BadRequestError("Create Clothing Failed");

    const newProduct = await super.createProduct(newClothing._id);

    if (!newProduct) throw new BadRequestError("Create Product Failed");

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        model: clothing,
        payload: updateNestedObject(objectParams.product_attributes),
      });
    }

    const updateProduct = await super.updateProduct(product_id, objectParams);

    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic) throw new BadRequestError("Create Electronic Failed");

    const newProduct = await super.createProduct(newElectronic._id);

    if (!newProduct) throw new BadRequestError("Create Product Failed");

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        model: electronic,
        payload: objectParams.product_attributes,
      });
    }

    const updateProduct = await super.updateProduct(product_id, objectParams);

    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) throw new BadRequestError("Create Clothing Failed");

    const newProduct = await super.createProduct(newFurniture._id);

    if (!newProduct) throw new BadRequestError("Create Product Failed");

    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        model: furniture,
        payload: objectParams.product_attributes,
      });
    }

    const updateProduct = await super.updateProduct(product_id, objectParams);

    return updateProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
