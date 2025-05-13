import { InfMap } from "./InfMap";

export class MinHeap {
  heap: number[];
  fScore: InfMap;

  constructor(fScore: InfMap) {
    this.heap = [];
    this.fScore = fScore;
  }

  includes(value: number): boolean {
    for (let i = 0; i < this.heap.length; i++) {
      if (this.heap[i] === value) return true;
    }
    return false;
  }

  insert(value: number): void {
    this.heap.push(value);
    let i = this.heap.length - 1;
    let parentI = Math.floor((i - 1) / 2);
    while (
      parentI >= 0 &&
      this.fScore.get(this.heap[i]) < this.fScore.get(this.heap[parentI])
    ) {
      const tmp = this.heap[parentI];
      this.heap[parentI] = this.heap[i];
      this.heap[i] = tmp;
      i = parentI;
      parentI = Math.floor((i - 1) / 2);
    }
  }

  heapifyDown(): void {
    let currentIndex = 0;
    let left = 2 * currentIndex + 1;
    let right = 2 * currentIndex + 2;
    while (left < this.heap.length) {
      const isRightInBounds = right < this.heap.length;
      const isRightSmaller =
        this.fScore.get(this.heap[right]) < this.fScore.get(this.heap[left]);

      const smaller = isRightInBounds && isRightSmaller ? right : left;

      if (
        this.fScore.get(this.heap[currentIndex]) <
        this.fScore.get(this.heap[smaller])
      )
        break;

      const tmp = this.heap[smaller];
      this.heap[smaller] = this.heap[currentIndex];
      this.heap[currentIndex] = tmp;

      currentIndex = smaller;
      left = 2 * currentIndex + 1;
      right = 2 * currentIndex + 2;
    }
  }

  removeMin(): number {
    if (this.heap.length === 0) throw new Error("Heap is empty");
    const minValue = this.heap[0];
    if (this.heap.length === 1) {
      this.heap.length = 0;
      return minValue;
    }
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return minValue;
  }

  size(): number {
    return this.heap.length;
  }
}
