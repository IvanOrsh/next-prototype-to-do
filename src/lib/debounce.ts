type AnyFunction = (...args: any[]) => any;

export function debounce<T extends AnyFunction>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as T;
}
