import { Request, Response, NextFunction } from "express";
import ProductService from "../services/product.service";
import { isAlphabetic } from "../utils/validation.isAlphabetic";
import { AppError } from "../errors/appError";

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
      throw new AppError("VALIDATION", `Validation failed: ${errors}`, 400);
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
      throw new AppError(
        "VALIDATION",
        `Product ID must be a positive integer`,
        400
      );
    }

    const product = await ProductService.getProductById(productId);

    if (product == null) {
      throw new AppError(
        "NOT_FOUND",
        `Product ${req.params.id} not found`,
        404
      );
    }

    res.status(200).json(product);
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];

    const productId = Number(req.body.productId);
    const price = Number(req.body.price);
    const name = req.body.name;

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
      throw new AppError("VALIDATION", `Validation failed: ${errors}`, 400);
    }

    const product = await ProductService.updateProduct(productId, name, price);
    res.status(200).json(product);
  }

  async deleteProduct(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const errors: string[] = [];
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      errors.push("Product ID must be a positive integer");
    }

    if (errors.length > 0) {
      throw new AppError("VALIDATION", `Validation failed: ${errors}`, 400);
    }

    await ProductService.deleteProduct(productId);

    res.status(204).send();
  }
}

export default new ProductController();
