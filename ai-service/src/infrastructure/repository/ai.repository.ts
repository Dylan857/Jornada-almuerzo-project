import { readSession } from '../../shared/database/postgres';

export class AIRepository {
  async getIngredientStock() {
    const result = await readSession(`
      SELECT name, stock FROM ingredients ORDER BY stock ASC
    `);
    return result.rows;
  }

  async getTopRecipes(limit = 5) {
    const result = await readSession(`
      SELECT r.name, COUNT(oi.id) AS times_ordered
      FROM recipes r
      JOIN order_items oi ON oi.recipe_id = r.id
      GROUP BY r.id, r.name
      ORDER BY times_ordered DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  async getLowStockIngredients(threshold = 3) {
    const result = await readSession(`
      SELECT name, stock FROM ingredients
      WHERE stock <= $1
      ORDER BY stock ASC
    `, [threshold]);
    return result.rows;
  }

  async getOrderHistory(limit = 20) {
    const result = await readSession(`
      SELECT id, quantity_requested, quantity_completed, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  async getPurchaseHistory(limit = 20) {
    const result = await readSession(`
      SELECT i.name, mp.quantity, mp.created_at
      FROM market_purchases mp
      JOIN ingredients i ON i.id = mp.ingredient_id
      ORDER BY mp.created_at DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  async getScarcityPrediction() {
    const result = await readSession(`
      SELECT 
        i.name,
        i.stock,
        COALESCE(SUM(ri.quantity), 0) AS avg_usage_per_order,
        CASE 
          WHEN COALESCE(SUM(ri.quantity), 0) = 0 THEN NULL
          ELSE ROUND(i.stock::numeric / SUM(ri.quantity), 1)
        END AS estimated_orders_remaining
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON ri.ingredient_id = i.id
      GROUP BY i.id, i.name, i.stock
      ORDER BY estimated_orders_remaining ASC NULLS LAST
    `);
    return result.rows;
  }
}