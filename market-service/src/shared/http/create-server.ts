import http from 'http';

export function createServer(handler: any) {
  return http.createServer(async (req, res) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  });
}
