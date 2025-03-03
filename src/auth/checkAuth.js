"use strict";

const JWT = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { asyncHandler } = require("../middlewares/error.handle");
const { findById } = require("../services/apikey.service");
const KeyTokenService = require("../services/keytoken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "refreshtoken",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];

    if (!key) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }

    const objKey = await findById(key);

    console.log(objKey);

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    return next(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyStore) throw new NotFoundError("Not found key store");

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.split(" ")[1];

  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

    if (decodeUser.userId !== userId)
      throw new AuthFailureError("Invalid User");

    req.user = decodeUser;

    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyStore) throw new NotFoundError("Not found key store");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];

      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);

      if (decodeUser.userId !== userId)
        throw new AuthFailureError("Invalid User");

      req.user = decodeUser;

      req.keyStore = keyStore;

      req.refreshToken = refreshToken;

      return next();
    } catch (error) {
      next(error);
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.split(" ")[1];

  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

    if (decodeUser.userId !== userId)
      throw new AuthFailureError("Invalid User");

    req.user = decodeUser;

    req.keyStore = keyStore;

    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  apiKey,
  permission,
  authentication: authenticationV2,
};
