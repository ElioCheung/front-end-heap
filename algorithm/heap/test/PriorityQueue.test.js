import PriorityQueue from '../PriorityQueue';

const generateTask = () => {
  const queue = [];
  for (let i = 0; i < 10; i++) {
    queue.push({
      id: i,
      priority: Math.floor(Math.random() * 10),
    });
  }

  return queue;
}

const compare = (a, b) => {
  const dif = a.priority - b.priority;
  return dif !== 0 ? dif : a.id - b.id;
}

describe('PriorityQueue Class', () => {
  test('构造函数传入的不是数组，抛出错误', () => {
    expect(() => {
      new PriorityQueue('123');
    }).toThrowError();
  });

  let priorityQueue;

  beforeEach(() => {
    priorityQueue = new PriorityQueue(compare);
  });

  describe('入队', () => {
    test('id相同,优先级小的在前', () => {
      priorityQueue.push({
        id: 1,
        priority: 10,
      });
  
      priorityQueue.push({
        id: 1,
        priority: 8,
      }); 
  
      expect(priorityQueue.queue).toEqual([
        {
          id: 1,
          priority: 8, 
        },
        {
          id: 1,
          priority: 10,
        }
      ])
    });

    test('id不同,优先级小的在前', () => {
      priorityQueue.push({
        id: 1,
        priority: 10,
      });

      priorityQueue.push({
        id: 2,
        priority: 8,
      });

      expect(priorityQueue.queue).toEqual([
        {
          id: 2,
          priority: 8,
        },
        {
          id: 1,
          priority: 10,
        },
      ])
    });
  });

  describe('出队', () => {
    test('队列为空,抛出null', () => {
      expect(priorityQueue.pop()).toBeNull();
    });

    test('队列不为空，出队', () => {
      priorityQueue.push({
        id: 1,
        priority: 10,
      });
      priorityQueue.push({
        id: 2,
        priority: 8,
      });
      expect(priorityQueue.pop()).toEqual({
        id: 2,
        priority: 8,
      });
      expect(priorityQueue.pop()).toEqual({
        id: 1,
        priority: 10,
      });
      expect(priorityQueue.pop()).toBeNull();
    });
  });

  describe('获取最高优先级的任务', () => {
    test('队列为空,返回null', () => {
      expect(priorityQueue.peek()).toBeNull();
    });

    test('队列不为空，返回最高优先级的任务', () => {
      priorityQueue.push({
        id: 1,
        priority: 10,
      });
      priorityQueue.push({
        id: 2,
        priority: 8,
      });
      expect(priorityQueue.peek()).toEqual({
        id: 2,
        priority: 8,
      });
    });
  });
});