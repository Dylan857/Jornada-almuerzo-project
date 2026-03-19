import { createServer } from './shared/http/create-server';
import { createRouter } from './shared/http/router';
import { routes } from './market.routes';

const PORT = 3004;

const router = createRouter(routes);

const server = createServer(router);

server.listen(PORT, () => {
  console.log(`Market Service running on port ${PORT}`);
});
