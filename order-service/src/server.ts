import { createServer } from "./shared/http/create-server";
import { createRouter } from "./shared/http/router";
import { routes } from "./order.routes";

const PORT = 3001;

const router = createRouter(routes);

const server = createServer(router);

server.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});