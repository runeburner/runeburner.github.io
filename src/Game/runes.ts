export const Rune = Object.freeze({
  WIND: "WIND",
  VOID: "VOID",
  LABOR: "LABOR",
} as const);

export type Rune = (typeof Rune)[keyof typeof Rune];
