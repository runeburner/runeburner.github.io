export const isVec = (v: unknown): v is Vec =>
  Array.isArray(v) && isNumber(v[0]) && isNumber(v[1]);
export const isString = (v: unknown): v is string => typeof v === typeof "";
export const isNumber = (v: unknown): v is string => typeof v === typeof 0;

export const isArgs = (
  args: unknown[],
  ...vals: ((v: unknown) => boolean)[]
): boolean =>
  args.length === vals.length && args.every((arg, i) => vals[i](arg));
