import { Game } from "../Game/game";
import { EldritchRune } from "../types/eldritchRunes";
import { Reward } from "./Realm";

export const AddYggdrasilLeafs = (n: number): Reward => {
  return {
    apply: (game: Game): void => {
      game.resources.leafs += n;
    },
    i18nArgs: ["rewards.leafs", { amount: n }],
  };
};

export const UnlockEldritchRune = (r: EldritchRune): Reward => {
  return {
    apply: (game: Game): void => {
      if (!game.eldritchRunesUnlocked.includes(r))
        game.eldritchRunesUnlocked.push(r);
    },
    i18nArgs: ["rewards.eldritchRune", { rune: r }],
  };
};
