/**
 * Function to execute a single task
 *
 * If it returns a promise, the task is considerred running as long as the
 * promise didn't complete
 */
export type TaskFunction = () => Promise<void> | void;

export type LoggerFunction = (error: Error) => void;

/**
 * Behavior when a task is scheduled to start while it's already running
 */
export enum Overrun {
  /**
   * Skip this start
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SKIP = "skip",
  /**
   * Immediately restart the task once it finish
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AFTER = "after",
}

/**
 * Options when scheduling a task
 */
export interface TaskOptions {
  /**
   * Behavior when the task is scheduled to restart before it have completed.
   *
   * Default to IGNORE when scheduling a task.
   */
  overrun?: Overrun;
}

/**
 * Same as TaskOptions, but all members are required
 */
export interface CompleteTaskOptions {
  overrun: Overrun;
}
