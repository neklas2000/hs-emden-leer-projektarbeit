export type RequestIds = {
  [id: string]: string | number;
};

export function parseRequestIds(routePattern?: string, ids?: string | number | RequestIds): string {
  if (!routePattern) return '';
  if (!ids) return routePattern;

  if (['string', 'number'].includes(typeof ids)) {
    if (!routePattern.includes(':id')) {
      throw new Error(`The route pattern '${routePattern}' has to include ':id' if the provided id isn't an object.`);
    }

    return routePattern.replace(':id', String(<string | number>ids));
  }

  let route = routePattern;

  for (const id in <RequestIds>ids) {
    if (!routePattern.includes(`:${id}`)) {
      throw new Error(`The route pattern '${routePattern}' has to include ':${id}'.`);
    }

    route = route.replace(`:${id}`, String((<RequestIds>ids)[id]));
  }

  return route;
}
