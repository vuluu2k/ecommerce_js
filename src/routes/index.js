"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();
// check api key
router.use(apiKey);

// check permission
router.use(permission("0000"));

const prefix = "/v1/api";

router.use(`${prefix}`, require("./access"));
router.use(`${prefix}/product`, require("./product"));

module.exports = router;
