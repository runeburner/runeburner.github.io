import {
  ActionProgress,
  ActionType,
  ATTUNE,
  ATTUNEProgress,
} from "../../types/actions";
import { Entity, EntityType, GolemEntity } from "../../types/entity";
import { dist } from "../../types/vec";
import { game } from "../game";

const maker = (a: ATTUNE): ActionProgress | true | null => {
  const old = game.actionM.get(a.id) as ActionProgress | undefined;
  const golem = game.entityM.get(a.id) as GolemEntity;
  const heart = ((): Entity | undefined => {
    for (const e of game.entityM.values()) {
      if (e.__type === EntityType.HEART) return e;
    }
    return undefined;
  })();
  if (!heart) return null;

  // If it's too far.
  if (dist(golem.pos, heart.pos) > 1) return null;

  // If we have no mana crystals
  if (golem.minecapacity[0] === 0) return null;

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
  e: Entity,
  action: ATTUNEProgress
): boolean => {
  const golem = e as GolemEntity;
  action.progress[0] += golem.mineSpeed * rate * game.powers.attune_power;
  while (
    action.progress[0] >= action.progress[1] &&
    golem.minecapacity[0] > 0
  ) {
    action.progress[0] -= action.progress[1];
    golem.minecapacity[0]--;
    game.addAttunement(1);
  }

  return golem.minecapacity[0] === 0;
};

export const attuneHandler = [maker, processor] as const;
