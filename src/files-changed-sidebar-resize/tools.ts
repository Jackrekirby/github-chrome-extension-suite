const LOG_PREFIX = "@ghcc"; // "GITHUB COMPARE COMMITS EXTENSION";

export function log(...args: any) {
  args = [LOG_PREFIX, ...args];
  console.log.apply(console, args);
}

export function error(...args: any) {
  args = [LOG_PREFIX, ...args];
  console.error.apply(console, args);
}
