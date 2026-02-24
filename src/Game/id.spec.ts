import { describe, expect, it } from "vitest";
import { ID } from "./id";

describe("id", () => {
  it("should increment on each next and reset when asked", () => {
    expect(ID.next()).toBe(0);
    expect(ID.next()).toBe(1);
    expect(ID.next()).toBe(2);
    ID.reset();
    expect(ID.next()).toBe(0);
    expect(ID.next()).toBe(1);
    expect(ID.next()).toBe(2);
  });
});
