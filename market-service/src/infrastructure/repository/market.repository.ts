import { readSession, writeSession } from "../../shared/database/postgres";

export class MarketRepository {
  private apiMarketUrl =
    "https://recruitment.alegra.com/api/farmers-market/buy?ingredient=";

  async buyIngredient(name: string) {
    const response = await fetch(`${this.apiMarketUrl}${name}`);

    if (!response.ok) {
      throw new Error(`Failed to buy ${name}`);
    }

    const data = await response.json();

    if (data.quantitySold > 0) {
      await this.savePurchase(name, data.quantitySold);
    }

    return data;
  }

  private async savePurchase(name: string, quantity: number) {
    await writeSession(
      `INSERT INTO market_purchases (ingredient_id, quantity)
       SELECT id, $2 FROM ingredients WHERE name = $1`,
      [name, quantity],
    );
  }

  async getHistory() {
    const result = await readSession(
      `SELECT
        i.name,
        mp.quantity,
        mp.created_at
      FROM market_purchases mp
      JOIN ingredients i ON i.id = mp.ingredient_id
      ORDER BY mp.created_at DESC
      LIMIT 20`,
    );
    return result.rows;
  }
}
