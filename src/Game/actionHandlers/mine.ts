import { GLOBAL_SPEED_UP } from "../../debug";
import {
  ActionProgress,
  ActionType,
  MINE,
  MINEProgress,
} from "../../types/actions";
import { EldritchRune } from "../../types/eldritchRunes";
import {
  Entity,
  EntityType,
  RockEntity,
  RuneCrystalEntity,
} from "../../types/entity";
import { Rune } from "../../types/rune";
import { dist } from "../../types/vec";
import { BloodRunePower } from "../formulas";
import { game } from "../game";
import { isArgs, isNumber } from "../validation";

const Mineables: Readonly<EntityType[]> = [
  EntityType.ROCK,
  EntityType.RUNE_CRYSTAL,
];

const isMinable = (e: Entity): e is RockEntity | RuneCrystalEntity => {
  return Mineables.includes(e.__type);
};

const maker = (a: MINE): ActionProgress | true | null => {
  if (!isArgs([a.target], isNumber)) return null;
  const old = game.actions.get(a.id);
  const golem = game.entities.get(a.id);

  if (golem?.__type !== EntityType.GOLEM) return null;
  const target = game.entities.get(a.target);
  if (!target || !isMinable(target)) return null;

  // If it's too far.
  if (dist(golem.pos, target.pos) > 1) return null;

  // If the golem is full.
  const capacity = golem.runes[Rune.VOID] * game.powers.capacityPerRune;
  if (
    target.__type === EntityType.RUNE_CRYSTAL &&
    golem.runeCrystals === capacity
  )
    return null;

  // If we were already mining this entity.
  const wasMining = old && old.__type === ActionType.MINE;
  if (wasMining && old.target === a.target) return true;
  return {
    __type: ActionType.MINE,
    pos: [...golem.pos],
    // If we swap mining entity in the middle, carry over progress
    progress: wasMining ? old.progress : [0, target.hardness],
    target: a.target,
  };
};

const processor = (
  rate: number,
  actor: Entity,
  action: MINEProgress
): boolean => {
  if (actor.__type !== EntityType.GOLEM) return true;
  const target = game.entities.get(action.target);
  if (!target) return true;
  if (!isMinable(target)) return true;
  const capacity = actor.runes[Rune.VOID] * game.powers.capacityPerRune;
  action.progress[0] +=
    GLOBAL_SPEED_UP *
    actor.runes[Rune.LABOR] *
    game.powers.workPerRune *
    rate *
    game.powers.musicalStrength *
    game.powers.leafPower *
    (actor.eldritchRune === EldritchRune.BLOOD ? BloodRunePower : 1);
  const isRuneCrystal = target.__type === EntityType.RUNE_CRYSTAL;
  while (
    action.progress[0] >= action.progress[1] &&
    (!isRuneCrystal || actor.runeCrystals < capacity) &&
    target.quantity > 0
  ) {
    action.progress[0] -= action.progress[1];
    if (isRuneCrystal) actor.runeCrystals++;

    game.addSpecialEffect({
      pos: [target.pos[0], target.pos[1] + 0.5],
      actionType: action.__type,
      amount: 1,
    });

    target.quantity--;
    if (target.quantity === 0) {
      game.removeEntity(target.id);
    }
  }

  return (
    (isRuneCrystal && actor.runeCrystals === capacity) || target.quantity <= 0
  );
};

export const mineHandler = [maker, processor] as const;
