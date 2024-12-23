"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../middlewares/error.handle");

const router = express.Router();

// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));

module.exports = router;
