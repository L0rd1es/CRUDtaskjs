// product.controller.js

const productRepository = require("../repositories/product.repository");

class ProductService {
  async createProduct(name, price) {
    return await productRepository.createProduct(name, price);
  }

  async getAllProducts() {
    return await productRepository.getAllProducts();
  }

  async getProductById(productId) {
    return await productRepository.getProductById(productId);
  }

  async updateProduct(productId, name, price) {
    const product = await productRepository.getProductById(productId);
    if (!product) throw new Error("Not found");
    return await productRepository.updateProduct(productId, name, price);
  }

  async deleteProduct(productId) {
    const product = await productRepository.getProductById(productId);
    if (!product) throw new Error("Not found");
    return await productRepository.deleteProduct(productId);
  }
}

module.exports = new ProductService();
