import { describe, expect, it } from "vitest";
import { isBool, isNumber, isString, isVec } from "./validation";

describe("isVec", () => {
  it("should not accept numbers", () => {
    expect(isVec(1)).toBeFalsy();
  });
  it("should not accept strings", () => {
    expect(isVec("a")).toBeFalsy();
  });
  it("should not accept booleans", () => {
    expect(isVec(false)).toBeFalsy();
  });
  it("should accept vec", () => {
    expect(isVec([1, 0])).toBeTruthy();
  });
});

describe("isString", () => {
  it("should not accept numbers", () => {
    expect(isString(1)).toBeFalsy();
  });
  it("should not accept booleans", () => {
    expect(isString(false)).toBeFalsy();
  });
  it("should not accept arrays", () => {
    expect(isString([])).toBeFalsy();
  });
  it("should accept strings", () => {
    expect(isString("a")).toBeTruthy();
  });
});

describe("isNumber", () => {
  it("should not accept booleans", () => {
    expect(isNumber(false)).toBeFalsy();
  });
  it("should not accept arrays", () => {
    expect(isNumber([])).toBeFalsy();
  });
  it("should not accept strings", () => {
    expect(isNumber("a")).toBeFalsy();
  });
  it("should accept numbers", () => {
    expect(isNumber(1)).toBeTruthy();
  });
});

describe("isBool", () => {
  it("should not accept arrays", () => {
    expect(isBool([])).toBeFalsy();
  });
  it("should not accept strings", () => {
    expect(isBool("a")).toBeFalsy();
  });
  it("should not accept numbers", () => {
    expect(isBool(1)).toBeFalsy();
  });
  it("should accept booleans", () => {
    expect(isBool(false)).toBeTruthy();
  });
});
