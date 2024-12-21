"use strict";
const bcrypt = require("bcrypt");
const shopModel = require("../models/shop.model");
const { RoleShop } = require("../helpers/enum");
const crypto = require("crypto");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const shopExisted = await shopModel.exists({ email }).lean();

      if (shopExisted) {
        return {
          code: "xxxx",
          message: "Shop already registered",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // create private key, public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });

        console.log({ privateKey, publicKey }); // save collection key store
      }

      return {
        code: 201,
        message: "success",
        data: newShop,
      };
    } catch (error) {
      return error;
    }
  };
}

module.exports = AccessService;
