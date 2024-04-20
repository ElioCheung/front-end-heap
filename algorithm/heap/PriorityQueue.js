class PriorityQueue {
  #queue = null;
  #compare = null;

  /**
   * @param {Function: (a, b) => number} compare  比较函数
   */
  constructor(compare) {
    if (typeof compare !== 'function') {
      throw Error('The compare must be a function')
    }
    this.#queue = [];
    this.#compare = compare;
  }

  peek() {
    return this.#queue.length === 0 ? null : this.#queue[0];
  }

  pop() {
    if (this.#queue.length === 0) {
      return null;
    }
    [this.#queue[0], this.#queue[this.#queue.length - 1]] = [this.#queue[this.#queue.length - 1], this.#queue[0]];
    const val = this.#queue.pop();
    this.#siftDown(0);
    return val;
  }

  push(val) {
    this.#queue.push(val);
    this.#siftUp(this.#queue.length - 1);
  }

  get queue() {
    return [...this.#queue];
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

  #siftUp(i) {
    while (true) {
      const parent = this.#parent(i);
      if (parent < 0 || this.#compare(this.#queue[parent], this.#queue[i]) <= 0) break;

      [this.#queue[parent], this.#queue[i]] = [this.#queue[i], this.#queue[parent]];
      i = parent; 
    }
  }

  #siftDown(i) {
    while (true) {
      const l = this.#leftChild(i);
      const r = this.#rightChild(i);
      const t = i;

      if (l < this.#queue.length && this.#compare(this.#queue[l], this.#queue[t]) < 0) {
        t = l;
      }

      if (r < this.#queue.length && this.#compare(this.#queue[r], this.#queue[t]) < 0) {
        t = r;
      }

      if (t === i) {
        break;
      }

      [this.#queue[i], this.#queue[t]] = [this.#queue[t], this.#queue[i]];
      i = t;
    }
  }
}

export default PriorityQueue;
