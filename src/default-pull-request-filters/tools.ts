const LOG_PREFIX = "@gprf"; // "GITHUB DEFAULT PULL REQUEST FILTERS";

export function log(...args: any) {
  args = [LOG_PREFIX, ...args];
  console.log.apply(console, args);
}

export function error(...args: any) {
  args = [LOG_PREFIX, ...args];
  console.error.apply(console, args);
}
