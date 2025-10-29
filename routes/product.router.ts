import { Router } from "express";
import ProductController from "../controllers/product.controller";
import { validateRequest } from "../middleware/requestValidation";
import {
  productSchema,
  productIdSchema,
} from "../validationSchemas/productSchema";

const router = Router();

router.post(
  "/",
  validateRequest(productSchema),
  ProductController.createProduct
);
router.get("/", ProductController.getAllProducts);
router.get(
  "/:productId",
  validateRequest(productIdSchema, "params"),
  ProductController.getProductById
);
router.put(
  "/:productId",
  validateRequest(productSchema),
  validateRequest(productIdSchema, "params"),
  ProductController.updateProduct
);
router.delete(
  "/:productId",
  validateRequest(productIdSchema, "params"),
  ProductController.deleteProduct
);

export default router;
