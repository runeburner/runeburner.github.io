import { BloodRunePower } from "../Game/formulas";

export const EldritchRune = Object.freeze({
  BLOOD: "BLOOD",
} as const);

export type EldritchRune = (typeof EldritchRune)[keyof typeof EldritchRune];

export const EldritchRunesI18N = Object.freeze({
  [EldritchRune.BLOOD]: { amount: ((BloodRunePower - 1) * 100).toFixed(2) },
});
