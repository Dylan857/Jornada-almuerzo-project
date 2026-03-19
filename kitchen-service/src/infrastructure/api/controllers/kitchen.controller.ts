import { KitchenService } from "../../../application/kitchen.service";
import { CustomException } from "../../../shared/http/custom-exception";
import { readBody } from "../../../shared/http/read-body";
import { withResponse } from "../../../shared/http/with-response";
import { CompleteOrderDto } from "../dto/complete-order.dto";

export class KitchenController {
  private kitchenService = new KitchenService();

  completeOrder = withResponse(async (req: any) => {
    const body = await readBody<CompleteOrderDto>(req);

    if (!body.orderId) {
      throw new CustomException("orderId is required", 400);
    }

    return this.kitchenService.completeOrder(body.orderId);
  });
}
