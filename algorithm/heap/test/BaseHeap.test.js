import BaseHeap from '../BaseHeap';

const arr = [3, 2, 7, 1, 5];

describe('BaseHeap Class', () => {
  test('构造函数传入的不是数组，抛出错误', () => {
    expect(() => {
      new BaseHeap('123', 'MIN');
    }).toThrowError();
  });

  test('堆为空时，获取堆顶元素，抛出错误', () => {
    const minHeap = new BaseHeap([], 'MIN');
    expect(() => {
      minHeap.peek();
    }).toThrowError();
  });

  test('可以获取堆数组，但是不能修改', () => {
    const minHeap = new BaseHeap(arr, 'MIN');
    const h = minHeap.heap;
    expect(h).toEqual([1, 2, 7, 3, 5]);
    h[0] = 10;
    expect(h[0]).not.toBe(minHeap.heap[0]);
  });

  describe('Min Heap', () => {
    let minHeap;

    beforeEach(() => {
      minHeap = new BaseHeap(arr, 'MIN');
    });

    test('堆初始化', () => {
      expect(minHeap.heap).toEqual([1, 2, 7, 3, 5]);
    });

    test('堆大小', () => {
      expect(minHeap.size()).toBe(arr.length);
    });

    test('入堆', () => {
      minHeap.push(4);
      expect(minHeap.heap).toEqual([1, 2, 4, 3, 5, 7]);
    });

    test('出堆', () => {
      minHeap.pop();
      expect(minHeap.heap).toEqual([2, 3, 7, 5]);
    });

    test('获取堆顶元素', () => {
      expect(minHeap.peek()).toBe(1);
    });
  });

  describe('Max Heap', () => {
    let maxHeap;

    beforeEach(() => {
      maxHeap = new BaseHeap(arr, 'MAX');
    });

    test('堆初始化', () => {
      expect(maxHeap.heap).toEqual([7, 5, 3, 1, 2]);
    });

    test('堆大小', () => {
      expect(maxHeap.size()).toBe(arr.length);
    });

    test('入堆', () => {
      maxHeap.push(8);
      expect(maxHeap.heap).toEqual([8, 5, 7, 1, 2, 3]);
    });
    
    test('出堆', () => {
      maxHeap.pop();
      expect(maxHeap.heap).toEqual([5, 2, 3, 1]);
    });

    test('获取堆顶元素', () => {
      expect(maxHeap.peek()).toBe(7);
    });
  });
});