const db = require("../db");

class ProductRepository {
  async createProduct(name, price) {
    const newProduct = await db.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
      [name, price]
    );
    return newProduct.rows[0];
  }

  async getAllProducts() {
    const products = await db.query("SELECT * FROM products");
    return products.rows;
  }

  async getProductById(productId) {
    const product = await db.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);
    return product.rows[0];
  }

  async updateProduct(productId, name, price) {
    const product = await db.query(
      "UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *",
      [name, price, productId]
    );
    return product.rows[0];
  }

  async deleteProduct(productId) {
    await db.query("DELETE FROM products WHERE id = $1", [productId]);
  }
}

module.exports = new ProductRepository();
