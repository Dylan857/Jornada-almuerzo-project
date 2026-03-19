import { readSession, writeSession } from '../../shared/database/postgres';

export class KitchenRepository {
  async findOrder(orderId: string) {
    const result = await readSession(
      `SELECT id, status FROM orders WHERE id = $1`,
      [orderId]
    );

    return result.rows[0] || null;
  }

  async updateOrderStatus(orderId: string, status: string) {
    await writeSession(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, orderId]
    );
  }
}