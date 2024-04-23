import { 
  ImmediatePriority, 
  UserBlockingPriority, 
  NormalPriority, 
  LowPriority, 
  IdlePriority, 
  IMMEDIATE_PRIORITY_TIMEOUT, 
  USER_BLOCKING_PRIORITY_TIMEOUT, 
  NORMAL_PRIORITY_TIMEOUT, 
  LOW_PRIORITY_TIMEOUT, 
  IDLE_PRIORITY_TIMEOUT, 
  frameYieldMs, 
  continuousYieldMs, 
  maxYieldMs,
} from './constants';
import { peek, push, pop } from './minHeap';
import { getCurrentTime, localClearTimeout, localSetImmediate, localSetTimeout } from './helper';

const taskQueue = []; // 任务队列
const timerQueue = []; // 延时任务队列

let taskIdCounter = 1; // 任务id计数器

let isHostCallbackScheduled = false;
let isHostTimeoutScheduled = false;
let isPerformingWork = false;

/**
 * 创建调度任务
 * @param {*} priorityLevel 优先级
 * @param {*} callback 回调函数
 * @param {*} options 杂项
 */
export function scheduleCallback(priorityLevel, callback, options) {
  console.log(`[scheduleCallback]: scheduleCallback start`);
  // 获取当前时间
  const currentTime = getCurrentTime();

  // 解析 options
  let startTime;
  if (typeof options === 'object' && options !== null) {
    const delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  // 根据任务优先级，计算超时时间
  let timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;
    case NormalPriority:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;
  }

  // 计算任务过期时间
  const expirationTime = startTime + timeout;

  // 创建任务
  const task = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };

  if (startTime > currentTime) {
    // 将任务放入延时队列
    task.sortIndex = startTime;
    push(timerQueue, task);
    if (peek(taskQueue) === null && task === peek(timerQueue)) {
      // 如果当前没有正在调度任务，且当前任务为延时任务
      if (isHostTimeoutScheduled) {
        // 取消当前的延时调度
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }

      // 启动延时调度
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    console.log(`[scheduleCallback]: push task into taskQueue - priorityLevel: ${priorityLevel} - id: ${task.id}`);
    // 将任务放入任务队列
    task.sortIndex = expirationTime;
    push(taskQueue, task);
    if (!isHostCallbackScheduled && !isPerformingWork) {
      // 如果当前没有正在调度任务，就立即调度
      isHostCallbackScheduled = true;
      console.log(`[scheduleCallback]: start requestHostCallback - id: ${task.id}`);
      requestHostCallback(flushWork);
    }
  }

  return task;
}

/**
 * 根据当前时间，将延时任务推入任务队列
 * @param {number} currentTime 当前执行时间
 */
function advanceTimers(currentTime) {
  let timer = peek(timerQueue);
  while (timer !== null) {
    if (timer.callback === null) {
      // 任务已被取消
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // 从延时队列中取出任务，转移至任务队列
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
    } else {
      return;
    }

    timer = peek(timerQueue);
  }
}

/**
 * 超时任务的处理函数
 * @param {number} currentTime 当前时间
 */
function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime); // 根据当前时间将符合要求的延时任务推入任务队列

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      // 如果任务队列中还有任务，则立即调度
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      // 任务队列中没有任务, 取出延时队列中的任务
      const firstTimer = peek(timerQueue);
      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

let scheduledHostCallback = null;
let isMessageLoopRunning = false;

function requestHostCallback(callback) {
  console.log('[requestHostCallback]: requestHostCallback');
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    console.log('[requestHostCallback]: schedulePerformWorkUntilDeadline start');
    schedulePerformWorkUntilDeadline();
  }
}

let currentTask = null;
let currentPriorityLevel = NormalPriority;

function flushWork(hasTimeRemaining, initialTime) {
  console.log('[flushWork]: flushWork');
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    // 取消当前的延时调度
    isHostTimeoutScheduled = true;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    console.log(`[flushWork]: start workLoop`);
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}


let taskTimeoutId = -1;
export function requestHostTimeout(fn, delay) {
  // 启动延时调度
  taskTimeoutId = localSetTimeout(() => {
    fn(getCurrentTime());
  }, delay);
}

export function cancelHostTimeout() {
  // 取消延时调度
  localClearTimeout(taskTimeoutId);
  taskTimeoutId = -1;
}

function workLoop(hasTimeRemaining, initialTime) {
  console.log('[workLoop]: workLoop');
  let currentTime = initialTime;
  advanceTimers(currentTime); // 根据当前时间，将延时任务推入任务队列
  currentTask = peek(taskQueue); // 获取当前任务

  while (currentTask !== null) {
    console.log('--------------------------------------');
    console.log(`[workLoop]: currentTask, priority: ${currentPriorityLevel}, id: ${currentTask.id}`);
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // 当前任务还未到期，且无可执行程序的剩余时间
      break;
    }

    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      console.log(`[workLoop]: call callback, priority: ${currentPriorityLevel}`);

      const startCallbackTime = getCurrentTime();
      console.log(`[workLoop]: callback start time: ${startCallbackTime}`);
      const continuationCallback = callback(didUserCallbackTimeout);
      console.log(`[workLoop]: callback end, priority: ${currentPriorityLevel}`);
      console.log(`[workLoop]: callback duration: ${getCurrentTime() - startCallbackTime}`);

      currentTime = getCurrentTime();
      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;
      } else {
        if (currentTask === peek(taskQueue)) {
          console.log(`[workLoop]: delete task from taskQueue - id: ${currentTask.id}`);
          pop(taskQueue);
        }
      }
      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
    console.log('--------------------------------------');
  }

  if (currentTask !== null) {
    return true;
  } else {
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}

let startTime = -1;
let frameInterval = frameYieldMs;
const continuousInputInterval = continuousYieldMs;
const maxInterval = maxYieldMs;

/**
 * 是否移交执行权至主线程
 * @returns {boolean} 
 */
export function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  console.log(`[shouldYieldToHost]: id: ${currentTask.id}, yieldToHost: ${timeElapsed >= frameInterval}`);
  while (timeElapsed < frameInterval) {
    return false;
  }

  return true;
}


function performWorkUntilDeadline() {
  console.log('[performWorkUntilDeadline]: performWorkUntilDeadline');
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();

    // Keep track of the start time so we can measure how long the main thread
    // has been blocked.
    startTime = currentTime;

    const hasTimeRemaining = true;

    let hasMoreWork = true;
    try {
      console.log('[performWorkUntilDeadline]: call scheduledHostCallback');
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        console.log('[performWorkUntilDeadline]: has more work, continue call schedulePerformWorkUntilDeadline');
        // If there's more work, schedule the next message event at the end
        // of the preceding one.
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
}

let schedulePerformWorkUntilDeadline;
if (typeof localSetImmediate === 'function') {
  // NodeJS + Older IE
  schedulePerformWorkUntilDeadline = () => {
    console.log('[schedulePerformWorkUntilDeadline]: schedulePerformWorkUntilDeadline start');
    // 异步宏任务，待执行
    localSetImmediate(() => {
      console.log('[schedulePerformWorkUntilDeadline]: call performWorkUntilDeadline');
      performWorkUntilDeadline();
    });
  };
} else if (typeof MessageChannel !== 'undefined') {
  // DOM and Worker environments.
  // We prefer MessageChannel because of the 4ms setTimeout clamping.
  const channel = new MessageChannel();
  const port = channel.port2;

  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
} else {
  schedulePerformWorkUntilDeadline = () => {
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}

export function getFirstCallbackNode() {
  return peek(taskQueue);
}

export function getCurrentProiorityLevel() {
  return currentPriorityLevel;
}

export function cancelCallback(task) {
  task.callback = null;
}