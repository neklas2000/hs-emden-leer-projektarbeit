export function resolveException<T_Exception, T>(
  promise$: Promise<T>,
): Promise<T | T_Exception> {
  return new Promise((resolve) => {
    promise$.then((result) => resolve(result)).catch((err) => resolve(err));
  });
}
