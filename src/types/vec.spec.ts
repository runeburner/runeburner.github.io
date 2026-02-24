import { describe, expect, it } from "vitest";
import { dist, eq } from "./vec";

describe("vec", () => {
  describe("dist", () => {
    it("should calculate distance", () => {
      expect(dist([0, 0], [0, 0])).toBe(0);
      expect(dist([0, 0], [1, 0])).toBe(1);
      expect(dist([0, 0], [1, 1])).toBe(1);
      expect(dist([-1, -1], [1, 1])).toBe(2);
    });
  });

  describe("eq", () => {
    it("should check equality", () => {
      expect(eq([0, 0], [0, 0])).toBeTruthy();
      expect(eq([1, 0], [1, 0])).toBeTruthy();
      expect(eq([1, 1], [1, 0])).toBeFalsy();
    });
  });
});
