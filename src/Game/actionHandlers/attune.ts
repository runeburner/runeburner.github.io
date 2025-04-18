import {
  ActionProgress,
  ActionType,
  ATTUNE,
  ATTUNEProgress,
} from "../../types/actions";
import { Entity, EntityType } from "../../types/entity";
import { Rune } from "../../types/rune";
import { dist } from "../../types/vec";
import { game } from "../game";

const maker = (a: ATTUNE): ActionProgress | true | null => {
  const old = game.actions.get(a.id);
  const golem = game.entities.get(a.id);
  if (golem?.__type !== EntityType.GOLEM) return null;
  const heart = ((): Entity | undefined => {
    for (const e of game.entities.values()) {
      if (e.__type === EntityType.HEART) return e;
    }
    return undefined;
  })();
  if (!heart) return null;

  // If it's too far.
  if (dist(golem.pos, heart.pos) > 1) return null;

  // If we have no rune crystals
  if (golem.runeCrystals === 0) return null;

  // If we were already attuning
  if (old && old.__type === ActionType.ATTUNE) return true;

  return {
    __type: ActionType.ATTUNE,
    progress: [0, 2],
    pos: [...golem.pos],
    heart: [...heart.pos],
  };
};
const processor = (
  rate: number,
  golem: Entity,
  action: ATTUNEProgress
): boolean => {
  if (golem.__type !== EntityType.GOLEM) return true;
  action.progress[0] +=
    golem.runes[Rune.LABOR] *
    game.powers.workPerRune *
    rate *
    game.powers.attuneStrength;
  while (action.progress[0] >= action.progress[1] && golem.runeCrystals > 0) {
    action.progress[0] -= action.progress[1];
    golem.runeCrystals--;
    game.addAttunement(1);
  }

  return golem.runeCrystals === 0;
};

export const attuneHandler = [maker, processor] as const;
