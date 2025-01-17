const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/checkAuth");
const { asyncHandler } = require("../../middlewares/error.handle");
const productController = require("../../controllers/product.controller");

router.use(authentication);
router.post("", asyncHandler(productController.createProduct));

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));

module.exports = router;
