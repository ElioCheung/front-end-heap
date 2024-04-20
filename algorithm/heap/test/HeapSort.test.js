import HeapSort from '../HeapSort';

const arr = [7, 5, 3, 1, 2, 4];

const compareMin2Max = (a, b) => {
  return b - a;
}

const compareMax2Min = (a, b) => {
  return a - b;
}

describe('HeapSort', () => {
  test('初始化，参数类型错误，抛出错误', () => {
    expect(() => {
      new HeapSort('123', compare);
    }).toThrowError();

    expect(() => {
      new HeapSort(arr, '123');
    }).toThrowError();
  });

  test('排序', () => {
    const hs1 = new HeapSort(arr, compareMin2Max);
    expect(hs1.sort()).toEqual([1, 2, 3, 4, 5, 7]);

    const hs2 = new HeapSort(arr, compareMax2Min);
    expect(hs2.sort()).toEqual([7, 5, 4, 3, 2, 1]);
  });
});