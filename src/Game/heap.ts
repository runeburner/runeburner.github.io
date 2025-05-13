export class MinHeap<T> {
  heap: T[];

  constructor() {
    this.heap = [];
  }

  getLeftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  getRightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  getParentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  hasParent(index: number): boolean {
    return this.getParentIndex(index) >= 0;
  }

  swap(i0: number, i1: number): void {
    const tmp = this.heap[i1];
    this.heap[i1] = this.heap[i0];
    this.heap[i0] = tmp;
  }

  insert(value: T): void {
    this.heap.push(value);
    this.heapifyUp();
  }

  heapifyUp(): void {
    let i = this.heap.length - 1;
    let parentI = Math.floor((i - 1) / 2);
    while (parentI >= 0 && this.heap[i] < this.heap[parentI]) {
      this.swap(i, parentI);
      i = parentI;
      parentI = Math.floor((i - 1) / 2);
    }
  }

  removeMin(): T {
    if (this.heap.length === 0) throw new Error("Heap is empty");
    const minValue = this.heap[0];
    if (this.heap.length === 1) {
      this.heap = [];
    } else {
      this.heap[0] = this.heap.pop()!;
      this.heapifyDown();
    }
    return minValue;
  }

  heapifyDown(): void {
    let currentIndex = 0;
    while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
      const left = this.getLeftChildIndex(currentIndex);
      const right = this.getRightChildIndex(currentIndex);
      const isRightInBounds = right < this.heap.length;
      const isRightSmaller = this.heap[right] < this.heap[left];

      const smaller = isRightInBounds && isRightSmaller ? right : left;

      if (this.heap[currentIndex] < this.heap[smaller]) break;

      this.swap(currentIndex, smaller);

      currentIndex = smaller;
    }
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
