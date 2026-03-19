import { transaction } from '../shared/database/postgres';
import { WarehouseRepository } from '../infrastructure/repository/warehouse.repository';

export class WarehouseService {
  private warehouseRepository = new WarehouseRepository();

  private readonly BATCH_SIZE = 10;

  async processOrder(quantity: number) {
    const recipes = await this.warehouseRepository.getRecipes();
    if (!recipes.length) throw new Error('No recipes available');

    const approved: any[] = [];
    const MAX_GLOBAL_ATTEMPTS = quantity * 10;
    let globalAttempts = 0;

    while (approved.length < quantity && globalAttempts < MAX_GLOBAL_ATTEMPTS) {
      const remaining = quantity - approved.length;
      const batchSize = Math.min(this.BATCH_SIZE, remaining);

      const batchResults = await Promise.allSettled(
        Array.from({ length: batchSize }, () => {
          const recipe = recipes[Math.floor(Math.random() * recipes.length)];
          return this.tryProcessRecipeWithRetry(recipe, recipes);
        }),
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled' && result.value) {
          approved.push(result.value);
        }
      }

      globalAttempts++;
    }

    return {
      recipes: approved,
      quantityApproved: approved.length,
      completed: approved.length === quantity,
    };
  }

  private async tryProcessRecipeWithRetry(
    initialRecipe: any,
    allRecipes: any[],
  ): Promise<any | null> {
    const MAX_RETRIES = 5;
    let currentRecipe = initialRecipe;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const result = await this.tryProcessRecipe(currentRecipe);

      if (result.success) return currentRecipe;

      if (result.missing.length > 0) {
        const purchases = await Promise.all(
          result.missing.map((i) => this.buyAndRestock(i)),
        );

        const anyPurchased = purchases.some((p) => p === true);

        if (anyPurchased) {
          continue;
        }
      }

      const otherRecipes = allRecipes.filter((r) => r.id !== currentRecipe.id);

      if (otherRecipes.length === 0) return null;

      currentRecipe =
        otherRecipes[Math.floor(Math.random() * otherRecipes.length)];
    }

    return null;
  }
  private async buyAndRestock(ingredient: any): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.MARKET_URL}/market/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: ingredient.name }),
      });

      if (!response.ok) return false;

      const result = await response.json();

      if (result.data.quantitySold > 0) {
        await transaction(async (client) => {
          await this.warehouseRepository.increaseStock(
            client,
            ingredient.name,
            result.data.quantitySold,
          );
        });
        return true;
      }

      return false;
    } catch (err) {
      console.error(`Failed to restock ${ingredient.name}:`, err);
      return false;
    }
  }

  private async tryProcessRecipe(recipe: any): Promise<{
    success: boolean;
    missing: any[];
  }> {
    try {
      return await transaction(async (client) => {
        const ingredients =
          await this.warehouseRepository.getIngredientsForUpdate(
            client,
            recipe.id,
          );

        const missing = ingredients.filter((i) => i.stock < i.quantity);

        if (missing.length > 0) {
          return {
            success: false,
            missing,
          };
        }

        await this.warehouseRepository.consumeIngredients(client, ingredients);

        return {
          success: true,
          missing: [],
        };
      });
    } catch (error) {
      console.error('Error processing recipe:', error);
      return {
        success: false,
        missing: [],
      };
    }
  }

  async getInventory() {
    return this.warehouseRepository.getAllIngredients();
  }

  async getRecipes() {
    return this.warehouseRepository.getRecipesWithIngredients();
  }
}
