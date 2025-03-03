"use strict";

const crypto = require("crypto");
const apikeyModel = require("../models/apikey.model");

const findById = async (key) => {
  // return await apikeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ["0000"],
  // });

  console.log(await apikeyModel.find());
  const objKey = await apikeyModel.findOne({ key, status: true }).lean();

  return objKey;
};

module.exports = {
  findById,
};
