import http from "http";
import { proxyRequest } from "./shared/http/proxy";

type ServiceRoute = {
  host: string;
  port: number;
};

const routes: Record<string, ServiceRoute> = {
  "/orders": { host: "order-service", port: 3001 },
  "/kitchen": { host: "kitchen-service", port: 3002 },
  "/warehouse": { host: "warehouse-service", port: 3003 },
  "/market": { host: "market-service", port: 3004 },
  "/ai": { host: "ai-service", port: 3005 },
};

function setCorsHeaders(res: http.ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  // Preflight OPTIONS — responder inmediato sin hacer proxy
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (!req.url) {
    res.writeHead(400);
    return res.end("Bad request");
  }

  const route = Object.entries(routes).find(([path]) =>
    req.url!.startsWith(path),
  );

  if (!route) {
    res.writeHead(404);
    return res.end("Route not found");
  }

  const [, target] = route;
  return proxyRequest(req, res, target.host, target.port);
});

server.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});
