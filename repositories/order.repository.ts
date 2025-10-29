import db from "../db";
import { orderDTO } from "../DTO/order.dto";

class OrderRepository {
  async createOrder(dto: orderDTO) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const order = await client.query(
        "INSERT INTO orders (user_id) VALUES($1) RETURNING *",
        [dto.userId]
      );
      const orderId = order.rows[0].id;

      const orderItems = await client.query(
        `
        WITH input_data AS (
          SELECT
            $1::bigint AS order_id,
            $2::jsonb AS products_json
        )
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        SELECT
          input_data.order_id,
          product_row."productId",
          product_row.quantity,
          products.price AS unit_price
        FROM input_data
        CROSS JOIN LATERAL jsonb_to_recordset(input_data.products_json) AS product_row(
          "productId" bigint,
          quantity int
        )
        JOIN products ON products.id = product_row."productId"
        RETURNING product_id AS "productId", quantity, unit_price AS "unitPrice"
        `,
        [orderId, JSON.stringify(dto.products)]
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
        orders.id AS "orderId",
        orders.user_id AS "userId",
        orders.created_at AS "createdAt",
        json_agg(
          json_build_object(
            'productId', order_items.product_id,
            'quantity', order_items.quantity,
            'unitPrice', order_items.unit_price
          )
          ORDER BY order_items.id
        ) AS products
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      GROUP BY orders.id, orders.user_id, orders.created_at
      ORDER BY orders.created_at DESC;
      `
    );

    return orders.rows;
  }

  async getOrderById(orderId: number) {
    const order = await db.query(
      `
      SELECT
        orders.id AS "orderId",
        orders.user_id AS "userId",
        orders.created_at AS "createdAt",
        json_agg(
          json_build_object(
            'productId', order_items.product_id,
            'quantity', order_items.quantity,
            'unitPrice', order_items.unit_price
          )
          ORDER BY order_items.id
        ) AS products
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      WHERE orders.id = $1
      GROUP BY orders.id, orders.user_id, orders.created_at
      `,
      [orderId]
    );
    return order.rows[0];
  }

  async updateOrder(orderId: number, dto: orderDTO) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      await client.query(`DELETE FROM order_items WHERE order_id = $1`, [
        orderId,
      ]);

      const orderItems = await client.query(
        `
        WITH input_data AS (
          SELECT
            $1::bigint AS order_id,
            $2::jsonb AS products_json
        )
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        SELECT
          input_data.order_id,
          product_row."productId",
          product_row.quantity,
          products.price AS unit_price
        FROM input_data
        CROSS JOIN LATERAL jsonb_to_recordset(input_data.products_json) AS product_row(
          "productId" bigint,
          quantity int
        )
        JOIN products ON products.id = product_row."productId"
        RETURNING product_id AS "productId", quantity, unit_price AS "unitPrice"
        `,
        [orderId, JSON.stringify(dto.products)]
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

  async deleteOrder(orderId: number) {
    await db.query("DELETE FROM orders WHERE id = $1", [orderId]);
  }
}

export default new OrderRepository();
