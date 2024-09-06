import { performance } from 'node:perf_hooks';

export function timing() {
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

      // Cast `this` to the class that contains `__timings` and `addTiming`
      const self = this as {
        __timings: { [key: string]: number[] };
        addTiming: (key: string, timing: number) => void;
      };

      if (self.__timings && typeof self.addTiming === 'function') {
        const timeTaken = end - start;
        self.addTiming(propertyKey, timeTaken);
      }

      console.log(`${propertyKey} took ${end - start} ms to execute.`);
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
