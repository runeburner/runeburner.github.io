import { describe, expect, it } from "vitest";
import { InfMap } from "./InfMap";

describe("infmap", () => {
  let m: InfMap;
  it("should not crash when creating", () => {
    m = new InfMap();
  });
  it("should return inf on empty values", () => {
    expect(m.get(0)).toBe(Infinity);
  });
  const key = 33;
  const value = 55;
  it("should let me insert", () => {
    expect(m.set(key, value)).toBeUndefined();
  });
  it("should correctly return previously set values", () => {
    expect(m.get(key)).toBe(value);
  });
});
