import { GLOBAL_SPEED_UP } from "../../debug";
import {
  ActionProgress,
  ActionType,
  FADE,
  FADEProgress,
} from "../../types/actions";
import { Entity } from "../../types/entity";
import { game } from "../game";

const maker = (a: FADE): ActionProgress | true | null => {
  const old = game.actions.get(a.id);
  const entity = game.entities.get(a.id);
  if (entity === undefined) return null;

  const wasFading = old && old.__type === ActionType.FADE;
  if (wasFading) return true;
  return {
    __type: ActionType.FADE,
    pos: [...entity.pos],
    progress: [0, 10],
  };
};
const processor = (
  rate: number,
  golem: Entity,
  action: FADEProgress
): boolean => {
  action.progress[0] += rate * GLOBAL_SPEED_UP;
  if (action.progress[0] > action.progress[1]) {
    game.removeEntity(golem.id);
    game.livesLeft++;
    return true;
  }
  return false;
};

export const fadeHandler = [maker, processor] as const;
