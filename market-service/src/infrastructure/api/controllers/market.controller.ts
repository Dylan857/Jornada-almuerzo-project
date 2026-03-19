import { MarketService } from "../../../application/market.service";
import { CustomException } from "../../../shared/http/custom-exception";
import { readBody } from "../../../shared/http/read-body";
import { withResponse } from "../../../shared/http/with-response";
import { IngredientDto } from "../dto/ingedient.dto";

export class MarketController {
  private marketService = new MarketService();

  buy = withResponse(async (req: any) => {
    const body = await readBody<IngredientDto>(req);

    if (!body.name?.trim()) {
      throw new CustomException("name is required", 400);
    }
    return this.marketService.buyIngredient(body.name);
  }, 201);

  getHistory = withResponse(async () => {
    return this.marketService.getHistory();
  });
}
