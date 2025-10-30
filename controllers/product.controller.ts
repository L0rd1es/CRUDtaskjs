import { Request, Response, NextFunction } from "express";
import ProductService from "../services/product.service";
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
    res.status(200).json(product);
  };

  updateProduct = async (
    req: Request<{ productId: string }, {}, productDTO>,
    res: Response
  ) => {
    const product = await ProductService.updateProduct(
      Number(req.params.productId),
      req.body
    );
    res.status(200).json(product);
  };

  deleteProduct = async (
    req: Request<{ productId: string }>,
    res: Response
  ) => {
    await ProductService.deleteProduct(Number(req.params.productId));
    res.status(204).send();
  };
}

export default new ProductController();
