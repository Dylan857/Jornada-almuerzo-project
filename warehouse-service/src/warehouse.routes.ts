import { WarehouseController } from './infrastructure/api/controllers/warehouse.controller';
import { HttpMethod } from './shared/http/types';

const controller = new WarehouseController();

export const routes = [
  {
    method: HttpMethod.POST,
    path: '/warehouse/check',
    handler: controller.check.bind(controller),
  },

  {
    method: HttpMethod.GET,
    path: '/warehouse',
    handler: controller.getInventory.bind(controller),
  },
  {
    method: HttpMethod.GET,
    path: '/warehouse/recipes',
    handler: controller.getRecipes.bind(controller),
  },
];