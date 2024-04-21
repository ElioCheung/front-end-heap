import BaseHeap from './BaseHeap';

/**
 * TopK:
 * 1.初始化一个小顶堆，其堆顶元素最小。
 * 2.先将数组的前K个元素依次入堆。
 * 3.从第 K+1 个元素开始，若当前元素大于堆顶元素，则将堆顶元素出堆，并将当前元素入堆。
 * 4.遍历完成后，堆中保存的就是最大的 K 个元素。
 */

function topK(arr, k) {
  const minHeap = new BaseHeap(arr.slice(0, k), 'MIN');
  for (let i = k; i < arr.length; i++) {
    if (arr[i] > minHeap.peek()) {
      minHeap.pop();
      minHeap.push(arr[i]);
    }
  }
  return minHeap.heap;
}

export default topK;
