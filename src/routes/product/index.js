const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/checkAuth");
const { asyncHandler } = require("../../middlewares/error.handle");
const productController = require("../../controllers/product.controller");

router.use(authentication);
router.post("", asyncHandler(productController.createProduct));
router.post(
  "/publish/:product_id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:product_id",
  asyncHandler(productController.unPublishProductByShop)
);

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
