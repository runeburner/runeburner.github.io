export const Rune = Object.freeze({
  WIND: "WIND",
  VOID: "VOID",
  LABOR: "LABOR",
  HEALTH: "HEALTH",
} as const);

export type Rune = (typeof Rune)[keyof typeof Rune];

export const RuneWeight = Object.freeze({
  [Rune.WIND]: 0,
  [Rune.VOID]: 1,
  [Rune.LABOR]: 1,
  [Rune.HEALTH]: 2,
} as const);
