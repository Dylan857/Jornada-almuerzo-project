import { PoolClient } from 'pg';
import { readSession } from '../../shared/database/postgres';
import { Recipe } from '../../domain/entities/recipe.entity';

export class WarehouseRepository {
  async getRecipes(): Promise<Recipe[]> {
    try {
      const query = `
        SELECT r.id, r.name, array_agg(i.name) AS ingredients
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        LEFT JOIN ingredients i ON ri.ingredient_id = i.id
        GROUP BY r.id, r.name
      `;
      const result = await readSession(query);

      return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        ingredients: row.ingredients || [],
      })) as Recipe[];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Failed to fetch recipes from database');
    }
  }

  async getIngredientsForUpdate(client: PoolClient, recipeId: string) {
    const result = await client.query(
      `
    SELECT i.id, i.name, i.stock, ri.quantity
    FROM ingredients i
    JOIN recipe_ingredients ri ON ri.ingredient_id = i.id
    WHERE ri.recipe_id = $1
    FOR UPDATE
    `,
      [recipeId],
    );

    return result.rows;
  }

  async consumeIngredients(client: PoolClient, ingredients: any[]) {
    for (const ing of ingredients) {
      await client.query(
        `UPDATE ingredients SET stock = stock - $1 WHERE id = $2`,
        [ing.quantity, ing.id],
      );
    }
  }

  async increaseStock(
    client: PoolClient,
    ingredientId: string,
    amount: number,
  ) {
    await client.query(
      `
    UPDATE ingredients
    SET stock = stock + $1
    WHERE name = $2
    `,
      [amount, ingredientId],
    );
  }

  async getAllIngredients() {
    const result = await readSession(
      `SELECT name, stock
     FROM ingredients
     ORDER BY name ASC`,
    );
    return result.rows;
  }

  async getRecipesWithIngredients() {
    const result = await readSession(
      `SELECT
      r.id,
      r.name,
      COALESCE(
        json_agg(
          json_build_object('name', i.name, 'quantity', ri.quantity)
          ORDER BY i.name
        ) FILTER (WHERE i.id IS NOT NULL),
        '[]'
      ) AS ingredients
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
    LEFT JOIN ingredients i ON i.id = ri.ingredient_id
    GROUP BY r.id, r.name
    ORDER BY r.name ASC`,
    );
    return result.rows;
  }
}
