"use strict";

const { Types } = require("mongoose");
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
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) });
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: id }, { new: true });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    // mongoose auto check refreshToken in refreshToken used same as refreshToken in array refreshTokenUsed
    return await keytokenModel
      .findOne({
        refreshTokensUsed: refreshToken,
      })
      .lean();
  };

  static deleteKeyById(userId) {
    return keytokenModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
    });
  }
}

module.exports = KeyTokenService;
