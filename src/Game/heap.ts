export class MinHeap<T> {
  heap: T[];
  constructor() {
    this.heap = [];
  }

  getLeftChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2);
  }

  hasParent(index: number): boolean {
    return this.getParentIndex(index) >= 0;
  }

  swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }

  insert(value: T): void {
    this.heap.push(value);
    this.heapifyUp();
  }

  heapifyUp(): void {
    let currentIndex = this.heap.length - 1;
    while (
      this.hasParent(currentIndex) &&
      this.heap[currentIndex] < this.heap[this.getParentIndex(currentIndex)]
    ) {
      this.swap(currentIndex, this.getParentIndex(currentIndex));
      currentIndex = this.getParentIndex(currentIndex);
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
      let smallerChildIndex = this.getLeftChildIndex(currentIndex);
      if (
        this.getRightChildIndex(currentIndex) < this.heap.length &&
        this.heap[this.getRightChildIndex(currentIndex)] <
          this.heap[smallerChildIndex]
      ) {
        smallerChildIndex = this.getRightChildIndex(currentIndex);
      }

      if (this.heap[currentIndex] < this.heap[smallerChildIndex]) {
        break;
      } else {
        this.swap(currentIndex, smallerChildIndex);
      }

      currentIndex = smallerChildIndex;
    }
  }

  size(): number {
    return this.heap.length;
  }
}

((): void => {
  const priorityQueue = new MinHeap();

  const inserts = [10, 5, 20, 3];
  for (const v of inserts) {
    priorityQueue.insert(v);
    console.log("Inserted:", JSON.stringify(priorityQueue.heap));
  }

  while (priorityQueue.size() > 0) {
    console.log(JSON.stringify(priorityQueue.heap));
    console.log("Removed min value:", priorityQueue.removeMin());
  }
})();
