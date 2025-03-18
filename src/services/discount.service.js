const discountModel = require("../models/discount.model");
const { convertToObjectIdMongo } = require("../utils");
const { findAllProduct } = require("../models/repositories/product.repo");
const {
  findDiscountsCodeUnselect,
  checkAccountExists,
} = require("../models/repositories/discount.repo");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      apples_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      use_count,
      max_uses_per_user,
    } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code is not active");
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("Discount code date time error");
    }

    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shop: convertToObjectIdMongo(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await discountModel.create({
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_is_active: is_active,
      discount_shop: convertToObjectIdMongo(shopId),
      discount_min_order_value: min_order_value,
      discount_product_ids: product_ids,
      discount_apples_to: apples_to,
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_max_uses: max_uses,
      discount_use_count: use_count,
      discount_max_uses_per_user: max_uses_per_user,
    });

    return newDiscount;
  }

  static async updateDiscountCode(payload) {
    // ...
  }

  static async getAllDiscountCodesWithProduct(payload) {
    const { code, shopId, userId, limit, page } = payload;

    const foundDiscount = await discountModel
      .find({
        discount_code: code,
        discount_shop: convertToObjectIdMongo(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new BadRequestError("Discount code not found or not active");

    const { discount_apples_to, discount_product_ids } = foundDiscount;

    let products;

    if (discount_apples_to === "all") {
      // get all product
      products = await findAllProduct({
        filter: {
          product_shop: convertToObjectIdMongo(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: ["ctime"],
        select: ["product_name"],
      });
    }

    if (discount_apples_to === "specific") {
      // get specific product
      products = await findAllProduct({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: ["ctime"],
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getDiscountCodesByShop(payload) {
    const { limit, page, shopId } = payload;
    const discounts = await findDiscountsCodeUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongo(shopId),
        discount_is_active: true,
      },
      model: discountModel,
      unSelect: ["__v", "discount_shopId"],
    });

    return discounts;
  }

  static async getDiscountAmount(payload) {
    const { code, products, userId, shopId } = payload;

    const foundDiscount = await checkAccountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shop: convertToObjectIdMongo(shopId),
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new BadRequestError("Discount code not found or not active");

    if (!foundDiscount.discount_max_uses)
      throw new BadRequestError("Discount code are out!");

    if (
      foundDiscount.start_date > new Date() ||
      foundDiscount.end_date < new Date()
    )
      throw new BadRequestError("Discount code expired!");
    let totalOrder = 0;
    if (foundDiscount.discount_min_order_value > 0) {
      totalOrder = products.reduce((total, product) => {
        return total + product.quantity * product.price;
      }, 0);

      if (totalOrder < foundDiscount.discount_min_order_value) {
        throw new BadRequestError("Order value require minimum order value!");
      }

      if (totalOrder > foundDiscount.discount_max_value) {
        throw new BadRequestError("Order value require maximum order value!");
      }
    }

    if (foundDiscount.discount_max_uses_per_user > 0) {
      const userDiscount = foundDiscount.discount_users_used.find((user) => {
        return user.userId === userId;
      });

      if (userDiscount) {
        // ...
      }
    }

    const amount =
      foundDiscount.discount_type == "fixed"
        ? foundDiscount.discount_value
        : (totalOrder * foundDiscount.discount_value) / 100;

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static deleteDiscountCode(payload) {
    // ...
  }

  static cancelDiscountCode(payload) {
    // ...
  }
}

module.exports = DiscountService;
