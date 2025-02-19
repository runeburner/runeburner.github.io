export const Runes = Object.freeze({
  WIND: "WIND",
  VOID: "VOID",
  LABOR: "LABOR",
} as const);

export type Rune = (typeof Runes)[keyof typeof Runes];
