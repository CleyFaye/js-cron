Manage scheduled tasks in-process using cron definitions
========================================================

Schedule tasks from your long-running Node script using cron syntax.

Features
--------

This project is very similar to
[node-cron](https://github.com/node-cron/node-cron) and
[node-schedule](https://github.com/node-schedule/node-schedule) with a minor
difference: consecutive execution can't overlap.

If a task takes longer to run than the interval between two scheduled execution,
the next execution can either be skipped (the default), or cause an immediate
rescheduling once it completes.

Ideally, I should submit patches to the aforementionned projects if there is
interest into this feature.

Installation
------------

The library is provided on
[npmjs](https://www.npmjs.com/package/@cley_faye/js-node).
```bash
npm install @cley_faye/js-node
```

Usage
-----

### Schedule a task
```JavaScript
import {
  schedule,
  Overrun,
} from "@cley_faye/js-cron";

const task = schedule(
  "* * * * *",
  () => {
    // Task body
    // Can return a promise
  },
  {
    overrun: Overrun.SKIP,
  },
);
```

The task body can return a promise, in which case the task will be considered
running until the promise resolves.

Currently, the task returned supports only one method: `Task#cancel()`, to
cancel the task and remove it from the scheduler.

The syntax for the cron argument is parsed using
[cron-parser](https://github.com/harrisiirak/cron-parser).

### Options
The only option supported for now is `overrun`. It can take the following
values:
- `Overrun.SKIP`: if the previous occurrence is still running, skip the new one
  until we reach the next scheduled time (default)
- `Overrun.AFTER`: if the previous occurrence is still running, run the new step
  immediately when it finishes

### Control the scheduler
You can stop all scheduling at once by calling `stop()`:
```JavaScript
import {stop} from "@cley_faye/js-cron";

stop();
```

Tasks already running will complete asynchronously.
