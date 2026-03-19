import { KitchenController } from './infrastructure/api/controllers/kitchen.controller';
import { HttpMethod } from './shared/http/types';

const controller = new KitchenController();

export const routes = [
  {
    method: HttpMethod.PATCH,
    path: '/kitchen/orders',
    handler: controller.completeOrder.bind(controller),
  },
];