import { OrderController } from './infrastructure/api/controllers/order.controller';
import { HttpMethod } from './shared/http/types';

const controller = new OrderController();

export const routes = [
  {
    method: HttpMethod.POST,
    path: '/orders',
    handler: controller.createOrder.bind(controller),
  },

  {
    method: HttpMethod.GET,
    path: '/orders/:id',
    handler: controller.getOrder.bind(controller),
  },

  {
    method: HttpMethod.GET,
    path: '/orders',
    handler: controller.getOrders.bind(controller),
  },
];
