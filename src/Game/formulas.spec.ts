import * as assert from "assert";
import { leafPower } from "./formulas";

describe("formulas", function () {
  describe("#leafPower()", function () {
    it("should be 2 percent per leaf", function () {
      assert.equal(leafPower(2), 1.02);
    });
  });
});
