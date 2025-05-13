export class MinHeap<T> {
  heap: T[];

  constructor() {
    this.heap = [];
  }

  insert(value: T): void {
    this.heap.push(value);
    let i = this.heap.length - 1;
    let parentI = Math.floor((i - 1) / 2);
    while (parentI >= 0 && this.heap[i] < this.heap[parentI]) {
      const tmp = this.heap[parentI];
      this.heap[parentI] = this.heap[i];
      this.heap[i] = tmp;
      i = parentI;
      parentI = Math.floor((i - 1) / 2);
    }
  }

  removeMin(): T {
    if (this.heap.length === 0) throw new Error("Heap is empty");
    const minValue = this.heap[0];
    if (this.heap.length === 1) {
      this.heap.length = 0;
      return minValue;
    }
    this.heap[0] = this.heap.pop()!;
    let currentIndex = 0;
    let left = 2 * currentIndex + 1;
    let right = 2 * currentIndex + 2;
    while (left < this.heap.length) {
      const isRightInBounds = right < this.heap.length;
      const isRightSmaller = this.heap[right] < this.heap[left];

      const smaller = isRightInBounds && isRightSmaller ? right : left;

      if (this.heap[currentIndex] < this.heap[smaller]) break;

      const tmp = this.heap[smaller];
      this.heap[smaller] = this.heap[currentIndex];
      this.heap[currentIndex] = tmp;

      currentIndex = smaller;
      left = 2 * currentIndex + 1;
      right = 2 * currentIndex + 2;
    }

    return minValue;
  }

  size(): number {
    return this.heap.length;
  }
}

((): void => {
  const priorityQueue = new MinHeap();

  const inserts = [10, 5, 20, 3, 1, 18, 17, 11, 10, 10, 10, 2, 7, 5];
  for (const v of inserts) {
    priorityQueue.insert(v);
  }

  while (priorityQueue.size() > 0) {
    console.log("Removed min value:", priorityQueue.removeMin());
  }
})();

((): void => {
  const iterations = 100;
  let total = 0;
  for (let i = 0; i < iterations; i++) {
    const before = Date.now();
    for (let j = 0; j < 100000; j++) {
      const priorityQueue = new MinHeap();

      const inserts = [10, 5, 20, 3, 1, 18, 17, 11, 10, 10, 10, 2, 7, 5];
      for (const v of inserts) {
        priorityQueue.insert(v);
      }

      while (priorityQueue.size() > 0) {
        priorityQueue.removeMin();
      }
    }
    const after = Date.now();

    total += after - before;
  }
  console.log(total / iterations);
})();
