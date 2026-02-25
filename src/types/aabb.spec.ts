import { describe, expect, it } from "vitest";
import { BoundedAABB, IsInAABB, RadiusAABB } from "./aabb";

describe("aabb", () => {
  describe("RadiusAABB", () => {
    it("should be created successfully", () => {
      const aabb = RadiusAABB([0, 0], 5);
      expect(IsInAABB(aabb, [0, 0])).toBeTruthy();
      expect(IsInAABB(aabb, [5, 0])).toBeFalsy();
      expect(IsInAABB(aabb, [5, 5])).toBeFalsy();
      expect(IsInAABB(aabb, [-5, 0])).toBeTruthy();
      expect(IsInAABB(aabb, [-5, -5])).toBeTruthy();
      expect(IsInAABB(aabb, [-6, 0])).toBeFalsy();
    });
  });
  describe("BoundedAABB", () => {
    it("should bound correctly", () => {
      const aabb = BoundedAABB(RadiusAABB([0, 0], 10), [7, 7], 5);
      expect(IsInAABB(aabb, [-5, -5])).toBeFalsy();
      expect(IsInAABB(aabb, [10, 10])).toBeFalsy();
      expect(IsInAABB(aabb, [9, 9])).toBeTruthy();
      expect(IsInAABB(aabb, [2, 2])).toBeTruthy();
      expect(IsInAABB(aabb, [1, 1])).toBeFalsy();
    });
  });
});
