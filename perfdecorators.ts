import { performance } from 'node:perf_hooks';


export function timing(label?: string, threshold?: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      const result = await originalMethod.apply(this, args);
      const end = performance.now();
      const timeTaken = end - start;

      // Only log if the time taken exceeds the threshold (if provided)
      if (!threshold || timeTaken > threshold) {
        console.log(`${label || propertyKey} took ${timeTaken} ms to execute.`);
      }

      // Store the timing in __timings if available
      const self = this as {
        __timings: { [key: string]: number[] };
        addTiming: (key: string, timing: number) => void;
      };
      if (self.__timings && typeof self.addTiming === 'function') {
        self.addTiming(propertyKey, timeTaken);
      }

      return result;
    };
  };
}

export function logTimings<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    __timings: { [key: string]: number[] } = {
      key: [10, 20, 30],
    };

    constructor(...args: any[]) {
      super(...args);
    }

    addTiming(key: string, timing: number) {
      if (!this.__timings[key]) {
        this.__timings[key] = [];
      }
      this.__timings[key].push(timing);
    }

    getTimings(key: string): number[] | undefined {
      return this.__timings[key];
    }

    getAverageTiming(key: string): number | undefined {
      const timings = this.getTimings(key);

      if (!timings || timings.length === 0) {
        return undefined;
      }
      const sum = timings.reduce((acc, val) => acc + val, 0);
      return sum / timings.length;
    }

    logAllTimings() {
      console.log(this.__timings);
    }
  };
}
