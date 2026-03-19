import { readSession, transaction } from '../../shared/database/postgres';

export class OrderRepository {
  async createOrder(quantity: number) {
    return await transaction(async (client) => {
      const orderResult = await client.query(
        `INSERT INTO orders (quantity_requested) VALUES ($1) RETURNING id`,
        [quantity],
      );

      const orderId = orderResult.rows[0].id;
      return orderId;
    });
  }

  async getOrder(orderId: string) {
    const result = await readSession(
      `SELECT 
      o.id,
      o.status,
      o.quantity_requested,
      o.quantity_completed,
      o.created_at,
      COALESCE(
        json_agg(
          json_build_object('id', r.id, 'name', r.name)
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'
      ) AS recipes
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN recipes r ON r.id = oi.recipe_id
    WHERE o.id = $1
    GROUP BY o.id`,
      [orderId],
    );

    return result.rows[0] || null;
  }

  async getOrders() {
    const result = await readSession(
      `SELECT
        o.id,
        o.status,
        o.quantity_requested,
        o.quantity_completed,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 20`,
    );
    return result.rows;
  }

  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'preparing' | 'completed' | 'failed' | 'in_kitchen',
    quantityApproved?: number,
    data?: any,
  ) {
    await transaction(async (client) => {
      await client.query(
        `UPDATE orders SET status = $1, quantity_completed = $2 WHERE id = $3`,
        [
          status,
          quantityApproved !== undefined ? quantityApproved : null,
          orderId,
        ],
      );

      if (data) {
        for (const recipe of data.recipes) {
          console.log(
            `Inserting order item for order ${orderId} and recipe ${recipe.id}`,
          );
          await client.query(
            `INSERT INTO order_items (order_id, recipe_id) VALUES ($1, $2)`,
            [orderId, recipe.id],
          );
        }
      }
    });
  }
}
