import { describe, it, expect } from "vitest";
import { leafPower } from "./formulas";

describe("formulas", () => {
  describe("leafPower", () => {
    it("should be 2 percent per leaf", () => {
      expect(leafPower(2)).toBe(1.02);
    });
  });
});
