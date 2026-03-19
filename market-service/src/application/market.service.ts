import { MarketRepository } from "../infrastructure/repository/market.repository";

export class MarketService {
  private marketRepository = new MarketRepository();

  async buyIngredient(ingredient: string) {
    return this.marketRepository.buyIngredient(ingredient);
  }

  async getHistory() {
    return this.marketRepository.getHistory();
  }
}
