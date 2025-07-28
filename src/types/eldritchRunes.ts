export const EldritchRune = Object.freeze({
  BLOOD: "BLOOD",
} as const);

export type EldritchRune = (typeof EldritchRune)[keyof typeof EldritchRune];
