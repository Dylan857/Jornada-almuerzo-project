import { MarketController } from './infrastructure/api/controllers/market.controller';
import { HttpMethod } from './shared/http/types';

const controller = new MarketController();

export const routes = [
  {
    method: HttpMethod.POST,
    path: '/market/buy',
    handler: controller.buy.bind(controller),
  },

  {
    method: HttpMethod.GET,
    path: '/market/history',
    handler: controller.getHistory.bind(controller),
  },
];
