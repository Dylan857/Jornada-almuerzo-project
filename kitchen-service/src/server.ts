import { createServer } from "./shared/http/create-server";
import { createRouter } from "./shared/http/router";
import { routes } from "./kitchen.routes";

const PORT = 3002;

const router = createRouter(routes);
const server = createServer(router);

server.listen(PORT, () => {
  console.log(`Kitchen Service running on port ${PORT}`);
});
