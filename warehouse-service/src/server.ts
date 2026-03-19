import { createServer } from './shared/http/create-server';
import { createRouter } from './shared/http/router';
import { routes } from './warehouse.routes';

const PORT = 3003;

const router = createRouter(routes);

const server = createServer(router);

server.listen(PORT, () => {
  console.log(`Warehouse Service running on port ${PORT}`);
});
