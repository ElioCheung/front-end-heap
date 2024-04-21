import topK from '../TopK';

const arr = [4, 7, 1, 3, 5, 6, 2, 9, 8, 1];

describe('TopK', () => {
  test('获取数组中前 K 个元素', () => {
    expect(topK(arr, 3)).toEqual([7, 9, 8]);
  });
});