import { KitchenRepository } from '../infrastructure/repository/kitchen.repository';

export class KitchenService {
  private kitchenRepository = new KitchenRepository();

  async completeOrder(orderId: string) {
    const order = await this.kitchenRepository.findOrder(orderId);

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (order.status === 'completed') {
      throw new Error(`Order ${orderId} is already completed`);
    }

    await this.kitchenRepository.updateOrderStatus(orderId, 'completed');

    return {
      orderId,
      status: 'completed',
      updatedAt: new Date(),
    };
  }
}