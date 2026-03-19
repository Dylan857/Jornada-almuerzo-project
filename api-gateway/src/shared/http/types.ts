import { IncomingMessage, ServerResponse } from "http";

export interface Route {
  method: string;
  path: string;
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;
}

export enum HttpMethod {
  GET = "GET",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
