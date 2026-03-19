import { IncomingMessage, ServerResponse } from "http";
import { successResponse, errorResponse } from "./api-response";

type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<any>;

export function withResponse(handler: Handler, statusCode = 200) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const result = await handler(req, res);

      if (res.writableEnded) return;

      const response = successResponse(result, statusCode);
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error: any) {
      if (res.writableEnded) return;

      const status = error.statusCode ?? 500;
      const response = errorResponse(
        error.message ?? "Internal server error",
        status,
      );
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    }
  };
}
