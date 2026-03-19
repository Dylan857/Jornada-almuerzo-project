import { Route } from './types';

function matchRoute(
  routePath: string,
  url: string,
): Record<string, string> | null {
  const urlWithoutQuery = url.split('?')[0];
  const routeParts = routePath.split('/');
  const urlParts = urlWithoutQuery.split('/');

  if (routeParts.length !== urlParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      params[routeParts[i].slice(1)] = urlParts[i];
    } else if (routeParts[i] !== urlParts[i]) {
      return null;
    }
  }

  return params;
}

export function createRouter(routes: Route[]) {
  return async function (req: any, res: any) {
    const sorted = [...routes].sort((a, b) => {
      const aHasParam = a.path.includes(':');
      const bHasParam = b.path.includes(':');
      if (aHasParam && !bHasParam) return 1;
      if (!aHasParam && bHasParam) return -1;
      return 0;
    });

    for (const route of sorted) {
      if (route.method !== req.method) continue;
      const params = matchRoute(route.path, req.url ?? '');
      if (params === null) continue;
      req.params = params;
      return route.handler(req, res);
    }

    res.writeHead(404);
    return res.end('Not found');
  };
}
