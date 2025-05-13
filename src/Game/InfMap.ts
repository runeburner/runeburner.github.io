export class InfMap {
  m = new Map<number, number>();
  get(key: number): number {
    return this.m.get(key) ?? Infinity;
  }
  set(key: number, n: number): void {
    this.m.set(key, n);
  }
}
