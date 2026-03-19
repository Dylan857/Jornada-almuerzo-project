import { AIController } from './infrastructure/api/controllers/ai.controller';
import { HttpMethod } from './shared/http/types';

const controller = new AIController();

export const routes = [
  {
    method: HttpMethod.POST,
    path: '/ai/query',
    handler: controller.query.bind(controller),
  },
];