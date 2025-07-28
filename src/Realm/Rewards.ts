import { Game } from "../Game/game";
import { Reward } from "./Realm";

export const AddYggdrasilLeafs = (n: number): Reward => {
  return {
    apply: (game: Game): void => {
      game.resources.leafs += n;
    },
    i18nArgs: ["rewards.leafs", { amount: n }],
  };
};
