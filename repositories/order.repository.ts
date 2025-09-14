import db from "../db";

class OrderRepository {
  async createOrder(
    userId: number,
    products: {
      product_id: number;
      quantity: number;
    }[]
  ) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const order = await client.query(
        "INSERT INTO orders (user_id) VALUES($1) RETURNING *",
        [userId]
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
          product_row.product_id,
          product_row.quantity,
          products.price AS unit_price
        FROM input_data
        CROSS JOIN LATERAL jsonb_to_recordset(input_data.products_json) AS product_row(
          product_id bigint,
          quantity int
        )
        JOIN products
          ON products.id = product_row.product_id
        RETURNING product_id, quantity, unit_price
        `,
        [orderId, JSON.stringify(products)]
      );

      await client.query("COMMIT");

      return {
        orderId: orderId,
        products: orderItems.rows,
      };
    } catch (err) {
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
        json_agg(
          json_build_object(
          'product_id', order_items.product_id, 
          'quantity', order_items.quantity,
          'unit_price', order_items.unit_price
          )
          ORDER BY order_items.id
        ) AS items
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      GROUP BY
        orders.id,
        orders.user_id,
        orders.created_at
      ORDER BY orders.created_at DESC;
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
        json_agg(
          json_build_object(
          'product_id', order_items.product_id, 
          'quantity', order_items.quantity,
          'unit_price', order_items.unit_price
          )
          ORDER BY order_items.id
        ) AS items
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      WHERE orders.id = $1
      GROUP BY
        orders.id,
        orders.user_id,
        orders.created_at
      ORDER BY orders.created_at DESC;
      `,
      [orderId]
    );
    return order.rows[0];
  }

  async updateOrder(
    orderId: number,
    products: {
      product_id: number;
      quantity: number;
    }[]
  ) {
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
          product_row.product_id,
          product_row.quantity,
          products.price AS unit_price
        FROM input_data
        CROSS JOIN LATERAL jsonb_to_recordset(input_data.products_json) AS product_row(
          product_id bigint,
          quantity int
        )
        JOIN products
          ON products.id = product_row.product_id
        RETURNING product_id, quantity, unit_price
        `,
        [orderId, JSON.stringify(products)]
      );

      await client.query("COMMIT");

      return {
        orderId: orderId,
        products: orderItems.rows,
      };
    } catch (err) {
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
