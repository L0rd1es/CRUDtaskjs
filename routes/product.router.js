const Router = require("express");
const ProductController = require("../controllers/product.controller");

const router = new Router();

router.post("/", ProductController.createProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.put("/", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
