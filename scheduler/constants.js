// declare priority level
export const ImmediatePriority = 1; // 立即执行
export const UserBlockingPriority = 2; // 用户交互
export const NormalPriority = 3; // 正常
export const LowPriority = 4; // 低优先级
export const IdlePriority = 5; // 闲置优先级

// declare priority with timeout
export const maxSigned31BitInt = 1073741823;
export const IMMEDIATE_PRIORITY_TIMEOUT = -1;
export const USER_BLOCKING_PRIORITY_TIMEOUT = 250;
export const NORMAL_PRIORITY_TIMEOUT = 5000;
export const LOW_PRIORITY_TIMEOUT = 10000;
export const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt; // Never times out

// declare yield time per frame
export const frameYieldMs = 5;
export const continuousYieldMs = 50;
export const maxYieldMs = 300;