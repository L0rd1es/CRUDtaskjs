import { Router } from "express";
import ProductController from "../controllers/product.controller";

const router = Router();

router.post("/", (req, res, next) =>
  ProductController.createProduct(req, res, next)
);
router.get("/", (req, res, next) =>
  ProductController.getAllProducts(req, res, next)
);
router.get("/:id", (req, res, next) =>
  ProductController.getProductById(req, res, next)
);
router.put("/:id", (req, res, next) =>
  ProductController.updateProduct(req, res, next)
);
router.delete("/:id", (req, res, next) =>
  ProductController.deleteProduct(req, res, next)
);

export default router;
