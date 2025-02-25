export const Rune = Object.freeze({
  WIND: "WIND",
  VOID: "VOID",
  LABOR: "LABOR",
} as const);

export type Rune = (typeof Rune)[keyof typeof Rune];

export const RuneWeight: Record<Rune, number> = Object.freeze({
  [Rune.WIND]: 0,
  [Rune.VOID]: 4,
  [Rune.LABOR]: 4,
});
