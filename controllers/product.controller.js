const productService = require("../services/product.service");
const isAlphabetic = require("../utils/validation.isAlphabetic");

class ProductController {
  async createProduct(req, res, next) {
    const errors = [];
    const { name, price } = req.body || {};
    try {
      if (name == null) errors.push("Product name is required");
      if (price == null) errors.push("Price is required");
      if (!isAlphabetic(name))
        errors.push("Product name can contain English letters only");
      if (isNaN(price)) errors.push("Price must be a number");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      const product = await productService.createProduct(name, price);
      res.status(201).json(product);
    } catch (err) {
      return next(err);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts();

      res.status(200).json(products);
    } catch (err) {
      return next(err);
    }
  }

  async getProductById(req, res, next) {
    const productId = req.params.id;
    try {
      if (productId == null || isNaN(productId)) {
        return res.status(400).json({
          message: "Validation failed",
          errors: ["Incorrect product id"],
        });
      }
      const product = await productService.getProductById(productId);
      if (product == null) {
        return res.status(404).json({
          message: "Not found",
          errors: [`Product with id:${productId} not found`],
        });
      }
      res.status(200).json(product);
    } catch (err) {
      return next(err);
    }
  }

  async updateProduct(req, res, next) {
    const errors = [];
    const { productId, name, price } = req.body;
    try {
      if (name == null) errors.push("Product name is required");
      if (price == null) errors.push("Price is required");
      if (productId == null) errors.push("Product ID is required");
      if (isNaN(productId)) errors.push("Product ID must be a number");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      const product = await productService.updateProduct(
        productId,
        name,
        price
      );
      res.status(200).json(product);
    } catch (err) {
      if (err.message === "Not found") {
        return res.status(404).json({
          message: err.message,
          errors: [`Product with id:${productId} not found`],
        });
      }
      return next(err);
    }
  }

  async deleteProduct(req, res, next) {
    const errors = [];
    const productId = req.params.id;
    try {
      if (productId == null) errors.push("Product ID is required");
      if (isNaN(productId)) errors.push("Product ID must be a number");

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: errors });
      }

      await productService.deleteProduct(productId);
      res.status(200).send();
    } catch (err) {
      if (err.message === "Not found") {
        return res.status(404).json({
          message: err.message,
          errors: [`Product with id:${productId} not found`],
        });
      }
      return next(err);
    }
  }
}

module.exports = new ProductController();
