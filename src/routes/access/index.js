"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../middlewares/error.handle");
const { authentication } = require("../../auth/checkAuth");

const router = express.Router();
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/signin", asyncHandler(accessController.login));

// authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
