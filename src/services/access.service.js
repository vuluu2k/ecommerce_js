"use strict";
const bcrypt = require("bcrypt");
const shopModel = require("../models/shop.model");
const { RoleShop } = require("../helpers/enum");
const crypto = require("crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

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
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1", // Public key crypto standards 1
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1", // Private key crypto standards 1
        //     format: "pem",
        //   },
        // });

        const privateKey = crypto.getRandomValues(64).toString("hex");
        const publicKey = crypto.getRandomValues(64).toString("hex");

        // console.log({ privateKey, publicKey }); // save collection key store
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxxx",
            message: "Public key not created",
          };
        }

        // const publicKeyObject = crypto.createPublicKey(publicKeyString);

        // console.log("publicKeyObject", publicKeyObject);

        const tokens = await createTokenPair(
          { userId: newShop._id, email: newShop.email },
          publicKeyString,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return error;
    }
  };
}

module.exports = AccessService;
