import {
  TaskFunction,
  TaskOptions,
  Overrun,
  CompleteTaskOptions,
} from "./types";
import ScheduledTask from "./scheduledtask";

const scheduledTasks: Array<ScheduledTask> = [];

/**
 * Set default values for task options
 */
const getDefaultTaskOptions = (
  taskOptions?: TaskOptions,
): CompleteTaskOptions => {
  const result = taskOptions ?? {};
  return {
    overrun: Overrun.SKIP,
    ...result,
  };
};

/**
 * Schedule a task for execution
 *
 * @param cronDefinition CRON timing for the task
 * @param task The task function to run at the scheduled time
 * @param taskOptions The behavior of the task
 */
export const schedule = (
  cronDefinition: string,
  task: TaskFunction,
  taskOptions?: TaskOptions,
): ScheduledTask => {
  const newTask = new ScheduledTask(
    cronDefinition,
    task,
    getDefaultTaskOptions(taskOptions),
  );
  scheduledTasks.push(newTask);
  return newTask;
};

export const stop = (): void => {
  scheduledTasks.forEach((task) => task.cancel());
  scheduledTasks.length = 0;
};
