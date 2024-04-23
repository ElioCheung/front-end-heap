/**
 * 工具函数
 * @description 捕获本地API引用，防止被 Polyfill 覆盖
 * @module helper
 * @date 2024-04-21
 */

export const localSetTimeout = typeof setTimeout === 'function' ? setTimeout : null;
export const localClearTimeout = typeof clearTimeout === 'function' ? clearTimeout : null;

// IE and Node.js + jsdom
export const localSetImmediate = typeof setImmediate !== 'undefined' ? setImmediate : null;

export let getCurrentTime;
const hasPerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';
if (hasPerformanceNow) {
  getCurrentTime = () => performance.now();
} else {
  const localDate = Date;
  const initialTime = localDate.now();
  getCurrentTime = () => localDate.now() - initialTime;
}

// 检查用户是否正在与页面进行交互
// 详见：https://developer.mozilla.org/en-US/docs/Web/API/Scheduling/isInputPending
export const isInputPending =
  typeof navigator !== 'undefined' &&
  navigator.scheduling !== undefined &&
  navigator.scheduling.isInputPending !== undefined
    ? navigator.scheduling.isInputPending.bind(navigator.scheduling)
    : null;

export const continuousOptions = {includeContinuous: false};
