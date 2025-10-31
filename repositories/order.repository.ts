import db from "../db";
import { orderDTO } from "../DTO/order.dto";
import { AppError, AppErrorType } from "../errors/appError";

class OrderRepository {
  async createOrder(dto: orderDTO) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const order = await client.query(
        "INSERT INTO orders (user_id) VALUES($1) RETURNING id",
        [dto.userId]
      );

      const orderId = order.rows[0].id;
      const productIds = dto.products.map((product) => product.productId);

      const productPrices = await client.query(
        `
        SELECT price FROM products WHERE id = ANY($1)
        `,
        [productIds]
      );

      const products = dto.products.map(
        (product, index) =>
          `(${orderId}, ${product.productId}, ${product.quantity}, ${productPrices.rows[index].price})`
      );

      const orderItems = await client.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES ${products}
        RETURNING product_id, quantity, unit_price
        `
      );

      await client.query("COMMIT");

      return {
        orderId: orderId,
        products: orderItems.rows,
      };
    } catch (err: any) {
      await client.query("ROLLBACK");
      throw new Error(err);
    } finally {
      client.release();
    }
  }

  async getAllOrders() {
    const orders = await db.query(
      `
      SELECT 
        orders.id, 
        orders.user_id, 
        orders.created_at,  
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'product_id', order_items.product_id,
            'quantity', order_items.quantity,
            'unit_price', order_items.unit_price
          )
        ) AS products
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      GROUP BY orders.id, orders.user_id, orders.created_at
      `
    );
    return orders.rows;
  }

  async getOrderById(orderId: number) {
    const order = await db.query(
      `
      SELECT
        orders.id,
        orders.user_id,
        orders.created_at,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'productId', order_items.product_id,
            'quantity', order_items.quantity,
            'unitPrice', order_items.unit_price
          )
        ) AS products
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      WHERE orders.id = $1
      GROUP BY orders.id, orders.user_id, orders.created_at
      `,
      [orderId]
    );

    if (order.rowCount === 0) {
      throw new AppError(
        AppErrorType.NOT_FOUND,
        `Order with id:${orderId} not found`,
        404
      );
    }

    return order.rows[0];
  }

  async deleteOrder(orderId: number) {
    await db.query("DELETE FROM orders WHERE id = $1", [orderId]);
  }
}

export default new OrderRepository();
