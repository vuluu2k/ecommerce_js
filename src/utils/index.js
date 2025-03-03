"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

const removeUndefinedObject = (object = {}) => {
  Object.keys(object).forEach((key) => {
    if (!object[key]) delete object[key];

    if (Array.isArray(object[key])) removeUndefinedObject(object[key]);
  });

  return object;
};

const updateNestedObject = (object = {}) => {
  const final = {};

  Object.keys(object).forEach((key) => {
    if (typeof object[key] === "object" && !Array.isArray(object[key])) {
      const response = updateNestedObject(object[key]);
      Object.keys(response).forEach((okey) => {
        final[`${key}.${okey}`] = response[okey];
      });
    } else {
      final[key] = object[key];
    }
  });

  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObject,
};
