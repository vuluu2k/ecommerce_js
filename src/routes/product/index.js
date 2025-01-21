const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/checkAuth");
const { asyncHandler } = require("../../middlewares/error.handle");
const productController = require("../../controllers/product.controller");

router.get(
  "/search/:term",
  asyncHandler(productController.getListSearchProduct)
);
router.get("/all", asyncHandler(productController.findAllProduct));
router.get("/:product_id", asyncHandler(productController.findProduct));

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

router.patch(
  "/update/:product_id",
  asyncHandler(productController.updateProductById)
);

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedForShop)
);

module.exports = router;
