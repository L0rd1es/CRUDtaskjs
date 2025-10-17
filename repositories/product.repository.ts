import db from "../db";

class ProductRepository {
  async createProduct(name: string, price: number) {
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

  async getProductById(productId: number) {
    const product = await db.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);
    return product.rows[0];
  }

  async updateProduct(productId: number, name: string, price: number) {
    const product = await db.query(
      "UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *",
      [name, price, productId]
    );
    return product.rows[0];
  }

  async deleteProduct(productId: number) {
    await db.query("DELETE FROM products WHERE id = $1", [productId]);
  }
}

export default new ProductRepository();
