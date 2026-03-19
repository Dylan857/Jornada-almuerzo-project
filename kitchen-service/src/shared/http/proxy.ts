import http from 'http';

export function proxyRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  targetHost: string,
  targetPort: number,
) {
  const options = {
    hostname: targetHost,
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);

    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });
}
