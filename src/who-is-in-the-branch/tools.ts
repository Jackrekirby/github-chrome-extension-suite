const LOG_PREFIX = "@gwib"; // "GITHUB WHO IS IN BRANCH";

// INCOMING ACTIONS
export const UPDATE_PR_DETAILS_BACKGROUND_ACTION =
  "UPDATE_PR_DETAILS_BACKGROUND_ACTION";

// OUTGOING ACTIONS
export const UPDATE_PR_DETAILS_CONTENT_ACTION =
  "UPDATE_PR_DETAILS_CONTENT_ACTION";

export function log(...args: any) {
  args = [LOG_PREFIX, ...args];
  console.log.apply(console, args);
}

export function error(...args: any) {
  args = [LOG_PREFIX, ...args];
  console.error.apply(console, args);
}

const buildExecuteWithCooldown = () => {
  const lastRun: {
    [key: string]: number;
  } = {};

  const timeouts: {
    [key: string]: number | null;
  } = {};

  const executeWithCooldown = async (
    key: string,
    fnc: any,
    cooldown: number
  ): Promise<void> => {
    const now = new Date().getTime();
    const lastRunTime = lastRun[key];
    const timeout = timeouts[key];

    const runFnc = async () => {
      log("execute with cooldown", key);
      lastRun[key] = now + 60_000_000; // large delay (1k mins) to prevent multiple executions
      await fnc();
      lastRun[key] = now;
    };

    if (now - lastRunTime < cooldown) {
      // if we are still on cooldown and a timeout hasn't been set yet
      // set a timeout to run the function after the cooldown
      if (!timeout) {
        const remainingCooldown = cooldown - (now - lastRunTime);
        timeouts[key] = setTimeout(async () => {
          timeouts[key] = null;
          runFnc();
        }, remainingCooldown);
      }
      return;
    }

    runFnc();
  };

  return executeWithCooldown;
};

export const executeWithCooldown = buildExecuteWithCooldown();

export const countOccurrences = (
  strings: string[]
): { [key: string]: number } => {
  const count: { [key: string]: number } = {};

  for (let i = 0; i < strings.length; i++) {
    const str = strings[i];
    if (count[str]) {
      count[str]++;
    } else {
      count[str] = 1;
    }
  }

  return count;
};

export function capitaliseFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
