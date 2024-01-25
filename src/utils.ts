/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = <T extends (...args: any[]) => ReturnType<T>>(
  fn: T,
  timeout: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | null = null;

  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId as number);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, timeout) as unknown as number;

    return timeoutId;
  };
};

export const throttle = <T extends (...args: any[]) => ReturnType<T>>(
  fn: T,
  timeout: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | null = null;
  let lastArgs: any[] | null = null;

  return function throttledFn(...args: any[]) {
    if (!timeoutId) {
      fn(...args);
      timeoutId = setTimeout(() => {
        timeoutId = null;

        if (lastArgs) {
          const argsToPass = lastArgs;

          lastArgs = null;
          throttledFn(...argsToPass);
        }
      }, timeout) as unknown as number;
    } else {
      lastArgs = args;
    }
  };
};