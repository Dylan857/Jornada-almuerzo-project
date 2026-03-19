import { CreateOrderDto } from '../infrastructure/api/dto/create-order.dto';
import { OrderRepository } from '../infrastructure/repository/order.repository';

export class OrderService {
  private repository = new OrderRepository();

  async createOrder(dto: CreateOrderDto) {
    if (!dto.quantity || dto.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const orderId = await this.repository.createOrder(dto.quantity);

    this.processOrderAsync(orderId, dto.quantity).catch((err) =>
      console.error(`Order ${orderId} failed:`, err),
    );

    return { orderId, status: 'pending' };
  }

  private async processOrderAsync(orderId: string, quantity: number) {
    try {
      await this.repository.updateOrderStatus(orderId, 'preparing');

      const result = await fetch(
        `${process.env.WAREHOUSE_URL}/warehouse/check`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity, orderId }),
        },
      );

      const data = await result.json();

      await this.repository.updateOrderStatus(
        orderId,
        'in_kitchen',
        data.data.quantityApproved,
        data.data,
      );
    } catch (err) {
      console.log(`Error processing order ${orderId}:`, err);
      await this.repository.updateOrderStatus(orderId, 'failed');
    }
  }

  async getOrder(orderId: string) {
    return await this.repository.getOrder(orderId);
  }

  async getOrders() {
    return await this.repository.getOrders();
  }
}
