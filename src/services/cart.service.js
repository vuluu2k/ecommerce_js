"use strict";

const { cart } = require("../models/cart.model");

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" };

    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };

    const options = {
      upsert: true,
      new: true,
    };

    return cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;

    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };

    const updateSet = {
      $set: {
        "cart_products.$.quantity": quantity,
      },
    };

    const options = {
      upsert: true,
      new: true,
    };

    const cartUpdated = await cart.findOneAndUpdate(query, updateSet, options);
    if (!cartUpdated) {
      return await CartService.createUserCart({ userId, product });
    } else {
      return cartUpdated;
    }
  }

  static async addToCart({ userId, product = {} }) {
    const useCart = await cart.findOne({
      cart_userId: userId,
    });

    if (!useCart) {
      //create new cart
      return await CartService.createUserCart({ userId, product });
    }

    if (!useCart.cart_products.length) {
      useCart.cart_products = [product];
      return await useCart.save();
    }

    return await CartService.updateUserCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, product }) {}
}

module.exports = CartService;
