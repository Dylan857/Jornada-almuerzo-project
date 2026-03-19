import { WarehouseService } from '../../../application/warehouse.service';
import { CustomException } from '../../../shared/http/custom-exception';
import { readBody } from '../../../shared/http/read-body';
import { withResponse } from '../../../shared/http/with-response';
import { ProcessOrderDto } from '../dto/process-order.dto';

export class WarehouseController {
  private warehouseService = new WarehouseService();

  check = withResponse(async (req: any) => {
    const body = await readBody<ProcessOrderDto>(req);

    if (!body.quantity || body.quantity <= 0) {
      throw new CustomException('quantity must be greater than 0', 400);
    }
    return this.warehouseService.processOrder(body.quantity);
  }, 201);

  getInventory = withResponse(async () => {
    return this.warehouseService.getInventory();
  });

  getRecipes = withResponse(async () => {
    return this.warehouseService.getRecipes();
  });
}
