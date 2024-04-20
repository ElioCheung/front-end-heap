class HeapSort {
  #heap = null;
  #compare = null;

  constructor(arr, compare) {
    if (typeof compare !== 'function' || !Array.isArray(arr)) {
      throw Error('The compare must be a function and the arr must be an array');
    }
    this.#compare = compare;
    this.#buildHeap(arr);
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

  #buildHeap(arr) {
    /**
     * 1.将列表所有元素原封不动地添加到堆中，此时堆的性质尚未得到满足。
     * 2.倒序遍历堆（层序遍历的倒序），依次对每个非叶节点执行“从顶至底堆化”。
     */
    this.#heap = arr;
    for (let i = this.#parent(arr.length - 1); i >= 0; i--) {
      this.#siftDown(i, arr.length);
    }
  }

  #siftDown(i, size) {
    const l = this.#leftChild(i);
    const r = this.#rightChild(i);
    let t = i;

    if (l < size && this.#compare(this.#heap[l], this.#heap[t]) < 0) {
      t = l;
    }

    if (r < size && this.#compare(this.#heap[r], this.#heap[t]) < 0) {
      t = r;
    }

    if (t !== i) {
      [this.#heap[i], this.#heap[t]] = [this.#heap[t], this.#heap[i]];
      this.#siftDown(t, size);
    }
  }

  sort() {
    /**
     * 1.输入数组并建立堆，此时最小(大)元素位于堆顶。
     * 2.不断执行出堆操作，依次记录出堆元素，即可得到排序的序列。
     */
    for (let i = this.#heap.length - 1; i > 0; i--) {
      [this.#heap[0], this.#heap[i]] = [this.#heap[i], this.#heap[0]];
      this.#siftDown(0, i);
    }
    return this.#heap;
  }
}

export default HeapSort;
