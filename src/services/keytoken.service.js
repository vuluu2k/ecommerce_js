"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // const tokens = await keytokenModel.create({
    //   user: userId,
    //   publicKey,
    //   privateKey,
    // });

    // return tokens ?? null;
    const filter = { user: userId };
    const update = {
      publicKey,
      privateKey,
      refreshToken,
      refreshTokensUsed: [],
    };
    const options = { upsert: true, new: true };

    const tokens = await keytokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: id }, { new: true });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    // mongoose auto check refreshToken in refreshToken used same as refreshToken in array refreshTokenUsed
    return await keytokenModel.findOne({
      refreshTokensUsed: refreshToken,
    });
  };

  static deleteById(id) {
    return keytokenModel.deleteOne({ _id: id });
  }
}

module.exports = KeyTokenService;
