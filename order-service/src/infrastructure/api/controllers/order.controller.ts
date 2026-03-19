import { OrderService } from '../../../application/order.service';
import { CustomException } from '../../../shared/http/custom-exception';
import { readBody } from '../../../shared/http/read-body';
import { withResponse } from '../../../shared/http/with-response';
import { CreateOrderDto } from '../dto/create-order.dto';

export class OrderController {
  private orderService = new OrderService();

  createOrder = withResponse(async (req, res) => {
    const body = await readBody<CreateOrderDto>(req);

    if (!body.quantity || body.quantity <= 0) {
      throw new CustomException('Quantity must be greater than 0', 400);
    }

    return this.orderService.createOrder(body);
  }, 201);

  getOrder = withResponse(async (req: any, res) => {
    const { id } = req.params;
    const order = await this.orderService.getOrder(id);

    if (!order) throw new CustomException('Order not found', 404);

    return order;
  });

  getOrders = withResponse(async () => {
    return this.orderService.getOrders();
  });
}
