/**
 * 调度优先级 - 最小堆
 * @date 2024-04-21
 * @module minHeap
 */


function compare(a, b) {
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

export function pop(heap) {
  if (heap.length === 0) {
    return null;
  }

  
  const first = heap[0];
  const last = heap.pop();  // 删除堆尾
  if (last !== first) { 
    // 交换堆顶和堆尾
    heap[0] = last;
    // 调整堆
    siftDown(heap, last, 0);
  }

  return first;
}

export function push(heap, node) {
  heap.push(node);
  siftUp(heap, node, heap.length - 1);
}

export function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}

function siftDown(heap, node, i) {
  const length = heap.length;

  while (true) {
    const leftIndex = i * 2 + 1;
    const rightIndex = leftIndex + 1;

    if (leftIndex < length && compare(heap[leftIndex], node) < 0) {
      // 若左子节点小于父节点
      if (rightIndex < length && compare(heap[rightIndex], heap[leftIndex]) < 0) {
        // 若右子节点小于左子节点，右子节点最小
        // 交换
        [heap[i], heap[rightIndex]] = [heap[rightIndex], heap[i]];
        // 更新索引
        i = rightIndex;
      } else {
        // 左子节点最小
        [heap[i], heap[leftIndex]] = [heap[leftIndex], heap[i]];
        // 更新索引
        i = leftIndex;
      }
    } else if (rightIndex < length && compare(heap[rightIndex], node) < 0) {
      // 若右子节点小于父节点
      // 交换
      [heap[i], heap[rightIndex]] = [heap[rightIndex], heap[i]];
      // 更新索引
      i = rightIndex;
    } else {
      break;
    }
  }
}

function siftUp(heap, node, i) {
  while (true) {
    const parentIndex = Math.floor((i - 1) / 2);

    // 若父节点小于子节点，或者父节点不存在，退出
    if (parentIndex < 0 || compare(heap[parentIndex], node) < 0) break;

    // 交换
    [heap[parentIndex], heap[i]] = [heap[i], heap[parentIndex]];
    // 更新索引
    i = parentIndex;
  }
}