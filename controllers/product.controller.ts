import { Request, Response, NextFunction } from "express";
import ProductService from "../services/product.service";
import { isAlphabetic } from "../utils/validation.isAlphabetic";

class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { name, price } = (req.body ?? {}) as {
      name: string;
      price: number;
    };

    if (name == null || name === "") {
      errors.push("Name is required");
    } else if (!isAlphabetic(name))
      errors.push("Name can contain English letters only");

    if (!Number.isInteger(price * 100) || price <= 0) {
      errors.push("Price must be a positive number");
    }

    if (errors.length > 0) {
      return next({
        type: "VALIDATION",
        message: "Validation failed",
        details: errors,
      });
    }

    const product = await ProductService.createProduct(name, price);
    res.status(201).json(product);
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    const products = await ProductService.getAllProducts();
    res.status(200).json(products);
  }

  async getProductById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return next({
        type: "VALIDATION",
        message: "Validation failed",
        details: ["Product ID must be a positive integer"],
      });
    }

    const product = await ProductService.getProductById(productId);

    if (product == null) {
      return next({
        type: "NOT_FOUND",
        message: `Product with id=${productId} not found`,
        details: [],
      });
    }

    res.status(200).json(product);
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];

    const productId = Number(req.body.productId);
    const price = Number(req.body.price);
    const name = req.body.name;

    try {
      if (name == null || name === "") {
        errors.push("Product name is required");
      }
      if (!Number.isInteger(price * 100) || price <= 0) {
        errors.push("Price must be a positive number");
      }
      if (!Number.isInteger(productId) || productId <= 0) {
        errors.push("Product ID must be a positive integer");
      }

      if (errors.length > 0) {
        return next({
          type: "VALIDATION",
          message: "Validation failed",
          details: errors,
        });
      }

      const product = await ProductService.updateProduct(
        productId,
        name,
        price
      );
      res.status(200).json(product);
    } catch (err: any) {
      if (err.message === "Not found") {
        return next({
          type: "NOT_FOUND",
          message: `Product with id=${productId} not found`,
          details: [],
        });
      }
      return next(err);
    }
  }

  async deleteProduct(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const errors: string[] = [];
    const productId = Number(req.params.id);

    try {
      if (!Number.isInteger(productId) || productId <= 0) {
        errors.push("Product ID must be a positive integer");
      }

      if (errors.length > 0) {
        return next({
          type: "VALIDATION",
          message: "Validation failed",
          details: errors,
        });
      }

      await ProductService.deleteProduct(productId);

      res.status(204).send();
    } catch (err: any) {
      if (err.message === "Not found") {
        return next({
          type: "NOT_FOUND",
          message: `Product with id=${productId} not found`,
          details: [],
        });
      }
      return next(err);
    }
  }
}

export default new ProductController();
