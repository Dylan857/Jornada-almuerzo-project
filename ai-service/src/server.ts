import { routes } from './ai.routes';
import { createServer } from './shared/http/create-server';
import { createRouter } from './shared/http/router';

const PORT = 3005;

const router = createRouter(routes);
const server = createServer(router);

server.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});
