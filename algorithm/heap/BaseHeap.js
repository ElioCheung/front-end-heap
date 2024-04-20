class BaseHeap {
  #heap = [];
  #type = '';

  /**
   * @param {Array} arr  
   * @param {emnu} type MIN: 最小堆  MAX: 最大堆 
   */
  constructor(arr, type = 'MIN') {
    this.#type = type;
    if (Array.isArray(arr)) {
      for (const item of arr) {
        this.push(item)
      }
    } else {
      throw Error('The arr must be an array');
    }
  }

  #parent(i) {
    return Math.floor((i - 1) / 2);
  }

  #leftChild(i) {
    return 2 * i + 1;
  }

  #rightChild(i) {
    return 2 * i + 2;
  }

  #isEmpty() {
    return this.#heap.length === 0;
  }

  size() {
    return this.#heap.length;
  }

  peek() {
    if (this.#isEmpty()) {
      throw Error('The heap is empty');
    }

    return this.#heap[0];
  }

  pop() {
    if (this.#isEmpty()) {
      throw Error('The heap is empty');
    }
    // 1. 堆顶元素和最后一个元素交换
    [this.#heap[0], this.#heap[this.size() - 1]] = [this.#heap[this.size() - 1], this.#heap[0]];
    // 2. 删除堆底元素
    const val = this.#heap.pop();
    // 3. 调整堆，执行 siftDown
    this.#siftDown(0);

    return val;
  }

  push(val) {
    this.#heap.push(val);
    this.#siftUp(this.size() - 1);
  }

  #siftUp(i) {
    while (true) {
      const parent = this.#parent(i);

      if (
        parent < 0 ||
        (this.#type === 'MIN' && this.#heap[parent] <= this.#heap[i]) ||
        (this.#type === 'MAX' && this.#heap[parent] >= this.#heap[i])
      ) {
        break;
      }
      // 交换
      [this.#heap[i], this.#heap[parent]] = [this.#heap[parent], this.#heap[i]];
      // 更新索引为父节点索引
      i = parent;
    }
  }

  #siftDown(i) {
    while (true) {
      const left = this.#leftChild(i);
      const right = this.#rightChild(i);
      let temp = i;

      if (
        left < this.size() && 
        (this.#type === 'MIN' && this.#heap[left] < this.#heap[temp]) ||
        (this.#type === 'MAX' && this.#heap[left] > this.#heap[temp])
      ) {
        temp = left;
      }

      if (
        right < this.size() && 
        (this.#type === 'MIN' && this.#heap[right] < this.#heap[temp]) ||
        (this.#type === 'MAX' && this.#heap[right] > this.#heap[temp])
      ) {
        temp = right;
      }

      if (temp === i) break;

      [this.#heap[i], this.#heap[temp]] = [this.#heap[temp], this.#heap[i]];

      i = temp;
    }
  }

  get heap() {
    return [...this.#heap];
  }
}

export default BaseHeap;
