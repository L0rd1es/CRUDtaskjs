import ProductRepository from "../repositories/product.repository";

class ProductService {
  async createProduct(name: string, price: number) {
    return await ProductRepository.createProduct(name, price);
  }

  async getAllProducts() {
    return await ProductRepository.getAllProducts();
  }

  async getProductById(productId: number) {
    return await ProductRepository.getProductById(productId);
  }

  async updateProduct(productId: number, name: string, price: number) {
    const product = await ProductRepository.getProductById(productId);
    if (!product) throw new Error("Not found");

    return await ProductRepository.updateProduct(productId, name, price);
  }

  async deleteProduct(productId: number) {
    return await ProductRepository.deleteProduct(productId);
  }
}

export default new ProductService();
