import { productDTO } from "../DTO/product.dto";
import ProductRepository from "../repositories/product.repository";

class ProductService {
  async createProduct(dto: productDTO) {
    return await ProductRepository.createProduct(dto);
  }

  async getAllProducts() {
    return await ProductRepository.getAllProducts();
  }

  async getProductById(productId: number) {
    return await ProductRepository.getProductById(productId);
  }

  async updateProduct(productId: number, dto: productDTO) {
    return await ProductRepository.updateProduct(productId, dto);
  }

  async deleteProduct(productId: number) {
    return await ProductRepository.deleteProduct(productId);
  }
}

export default new ProductService();
