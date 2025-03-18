"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "365 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "700 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("[ERROR]::createTokenPair::", error);
    return error;
  }
};

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, verifyJWT };
