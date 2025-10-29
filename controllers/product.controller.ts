import { Request, Response, NextFunction } from "express";
import ProductService from "../services/product.service";
import { AppError, AppErrorType } from "../errors/appError";
import { productDTO } from "../DTO/product.dto";

class ProductController {
  createProduct = async (req: Request<{}, {}, productDTO>, res: Response) => {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  };

  getAllProducts = async (req: Request, res: Response) => {
    const products = await ProductService.getAllProducts();
    res.status(200).json(products);
  };

  getProductById = async (
    req: Request<{ productId: string }>,
    res: Response
  ) => {
    const product = await ProductService.getProductById(
      Number(req.params.productId)
    );

    if (!product) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `Product with Id:${req.params.productId} not found`,
        404
      );
    }

    res.status(200).json(product);
  };

  updateProduct = async (
    req: Request<{ productId: string }, {}, productDTO>,
    res: Response
  ) => {
    const productId = Number(req.params.productId);

    if (!(await ProductService.getProductById(productId))) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `Product with Id:${req.params.productId} not found`,
        404
      );
    }

    const product = await ProductService.updateProduct(productId, req.body);
    res.status(200).json(product);
  };

  deleteProduct = async (
    req: Request<{ productId: string }>,
    res: Response
  ) => {
    const productId = Number(req.params.productId);

    if (!(await ProductService.getProductById(productId))) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `Product with Id:${req.params.productId} not found`,
        404
      );
    }

    await ProductService.deleteProduct(productId);

    res.status(204).send();
  };
}

export default new ProductController();
