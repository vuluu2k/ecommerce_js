"use strict";
const bcrypt = require("bcrypt");
const shopModel = require("../models/shop.model");
const { RoleShop } = require("../helpers/enum");
const crypto = require("node:crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

class AccessService {
  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError(
        "Something went wrong happen, Please Login again!!"
      );
    }

    if (keyStore.refreshToken != refreshToken) {
      throw new AuthFailureError("Shop not registered!");
    }

    const foundShop = await findByEmail({ email });

    if (!foundShop) throw new AuthFailureError("Shop not registered!");

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyStore({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };

    // version 1 error protected
    // const foundToken = await KeyTokenService.findByRefreshTokenUsed(
    //   refreshToken
    // );

    // if (foundToken) {
    //   const { userId, email } = await verifyJWT(
    //     refreshToken,
    //     foundToken.privateKey
    //   );

    //   console.log("foundToken", { userId, email });
    //   // phát hiện token tái sử dụng, nghi vấn hack kích toàn bộ tài khoản đăng nhập lại
    //   await KeyTokenService.deleteKeyById(userId);
    //   throw new ForbiddenError("Something went wrong!!");
    // }

    // const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    // if (!holderToken) throw new AuthFailureError("Shop not registered!");

    // const { userId, email } = await verifyJWT(
    //   refreshToken,
    //   holderToken.privateKey
    // );

    // const foundShop = await findByEmail({ email });

    // if (!foundShop) throw new AuthFailureError("Shop not registered!");

    // const tokens = await createTokenPair(
    //   { userId, email },
    //   holderToken.publicKey,
    //   holderToken.privateKey
    // );

    // await holderToken.updateOne({
    //   $set: {
    //     refreshToken: tokens.refreshToken,
    //   },
    //   $addToSet: {
    //     refreshTokensUsed: refreshToken,
    //   },
    // });

    // return {
    //   user: { userId, email },
    //   tokens,
    // };
  };

  static logout = async (keyStore) => {
    const delKey = KeyTokenService.removeKeyById(keyStore._id);

    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });

    if (!foundShop) {
      throw new BadRequestError("Shop not registered!");
    }

    const passwordMatch = await bcrypt.compare(password, foundShop.password);
    if (!passwordMatch) {
      throw new AuthFailureError("Authentication failed!");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;

    const tokens = await createTokenPair(
      { userId: userId, email: foundShop.email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const shopExisted = await shopModel.exists({ email }).lean();

    if (shopExisted) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: Public key not created!");
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email: newShop.email },
        publicKey,
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
  };
}

module.exports = AccessService;
