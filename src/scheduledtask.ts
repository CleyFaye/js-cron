import cronParser from "cron-parser";
import {
  TaskFunction,
  Overrun,
  CompleteTaskOptions,
} from "./types";
import {logError} from "./logger";

/**
 * Maximum delay for a timeout.
 * Done because setTimeout() sometimes can only accept a 32bit integer
 */
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const maxTimeoutDelay = 2 ** 31;

/**
 * Manage a single scheduled task
 */
export default class ScheduledTask {
  private _cronDefinition: string;
  private _func: TaskFunction;
  private _opts: CompleteTaskOptions;
  /**
   * Indicate that the task missed a previous tick
   */
  private _restartImmediate = false;
  /**
   * If the task is canceled (prevent looping)
   */
  private _canceled = false;
  /**
   * Timeout handler
   */
  private _timeoutHandler: number | null;
  /**
   * Last run time (timestamp)
   */
  private _lastRun: number;

  public constructor(
    cronDefinition: string,
    func: TaskFunction,
    opts: CompleteTaskOptions,
  ) {
    this._cronDefinition = cronDefinition;
    this._func = func;
    this._opts = opts;
    this._lastRun = Date.now();
    this._timeoutHandler = setTimeout(
      () => this._run(),
      Math.max(0, this._getTimeoutDelay()),
    );
  }

  /**
   * Determine if the task should be running right now
   */
  public get runnable(): boolean {
    return this._getNextSchedule() <= Date.now();
  }

  /**
   * Cancel the task from the scheduling
   */
  public cancel(): void {
    if (this._timeoutHandler) {
      clearTimeout(this._timeoutHandler);
      this._timeoutHandler = null;
    }
    this._canceled = true;
  }

  /**
   * Run the task
   *
   * All special cases are handled there (task already running).
   * Updating the next value is also handled here.
   */
  private _run(): Promise<void> {
    this._timeoutHandler = null;
    let result = Promise.resolve();
    if (this.runnable) {
      this._lastRun = Date.now();
      result = result.then(() => this._func());
    }
    return result
      .catch(error => logError(error))
      .then(() => this._reschedule());
  }

  /**
   * Reschedule the task for the next occurrence
   */
  private _reschedule(): void {
    if (this._canceled) {
      return;
    }
    let nextDelay = this._getTimeoutDelay();
    if (nextDelay < 0) {
      // We overshot
      switch (this._opts.overrun) {
        case Overrun.AFTER:
          // Reschedule immediately
          nextDelay = 0;
          break;
        case Overrun.SKIP:
          // Reschedule for the next time slot
          this._lastRun = Date.now();
          nextDelay = this._getTimeoutDelay();
      }
    }
    this._timeoutHandler = setTimeout(
      () => this._run(),
      Math.max(0, nextDelay),
    );
  }

  /**
   * Return the timeout delay before the next task scheduling.
   *
   * This can return a lower value if the task is scheduled in the distant
   * future.
   */
  private _getTimeoutDelay(): number {
    const current = Date.now();
    const next = this._getNextSchedule();
    return Math.min(
      next - current,
      maxTimeoutDelay,
    );
  }

  /**
   * Return the next scheduled time starting from the given point in time
   */
  private _getNextSchedule(): number {
    const nextOccurrence = cronParser.parseExpression(
      this._cronDefinition,
      {currentDate: this._lastRun},
    ).next();
    return nextOccurrence.getTime();
  }
}
