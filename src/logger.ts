import {LoggerFunction} from "./types.js";

// eslint-disable-next-line no-console
let loggerFunction: LoggerFunction = console.error;

/**
 * Change the function used to log errors
 * @param logFunc Callback that will receive errors
 */
export const setLoggerFunction = (
  logFunc?: LoggerFunction,
): void => {
  if (logFunc) {
    loggerFunction = logFunc;
  } else {
    // eslint-disable-next-line no-console
    loggerFunction = console.error;
  }
};

export const logError = (error: Error): void => loggerFunction(error);
