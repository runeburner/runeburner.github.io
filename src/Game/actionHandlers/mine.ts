import {
  ActionProgress,
  ActionType,
  MINE,
  MINEProgress,
} from "../../types/actions";
import { EldritchRune } from "../../types/eldritchRunes";
import { Entity, EntityType } from "../../types/entity";
import { Offset } from "../../types/map";
import { Rune } from "../../types/rune";
import { Tile } from "../../types/tile";
import { dist, eq } from "../../types/vec";
import { BloodRunePower } from "../formulas";
import { game } from "../game";
import { isArgs, isVec } from "../validation";

const maker = (a: MINE): ActionProgress | true | null => {
  if (!isArgs([a.v], isVec)) return null;
  const old = game.actions.get(a.id);
  const golem = game.entities.get(a.id);

  if (golem?.__type !== EntityType.GOLEM) return null;

  // If it's too far.
  if (dist(golem.pos, a.v) > 1) return null;

  // If the golem is full.
  const capacity = golem.runes[Rune.VOID] * game.powers.capacityPerRune;
  if (
    game.tileAt(a.v)[Offset.TILE_ID] === Tile.RUNE_CRYSTAL &&
    golem.runeCrystals === capacity
  )
    return null;

  // If we're trying to mine anything other than a mana crystal
  const tile = game.tileAt(a.v);
  if (
    tile[Offset.TILE_ID] !== Tile.RUNE_CRYSTAL &&
    tile[Offset.TILE_ID] !== Tile.ROCK
  )
    return null;

  // If we were already mining this tile.
  const wasMining = old && old.__type === ActionType.MINE;
  if (wasMining && eq(old.tile, a.v)) return true;
  return {
    __type: ActionType.MINE,
    pos: [...golem.pos],
    // If we swap mining tile in the middle, carry over progress
    progress: wasMining ? old.progress : [0, tile[Offset.DATA_1]],
    tile: [...a.v],
  };
};

const Mineables: Readonly<Tile[]> = [Tile.ROCK, Tile.RUNE_CRYSTAL];

const isMinable = (v: Vec): boolean => {
  return Mineables.includes(game.tileAt(v)[Offset.TILE_ID] as Tile);
};

const processor = (
  rate: number,
  golem: Entity,
  action: MINEProgress
): boolean => {
  if (golem.__type !== EntityType.GOLEM) return true;
  if (!isMinable(action.tile)) return true;
  const capacity = golem.runes[Rune.VOID] * game.powers.capacityPerRune;
  action.progress[0] +=
    golem.runes[Rune.LABOR] *
    game.powers.workPerRune *
    rate *
    game.powers.musicalStrength *
    game.powers.leafPower *
    (golem.eldritchRune === EldritchRune.BLOOD ? BloodRunePower : 1);
  const isRuneCrystal =
    game.tileAt(action.tile)[Offset.TILE_ID] === Tile.RUNE_CRYSTAL;
  while (
    action.progress[0] >= action.progress[1] &&
    (!isRuneCrystal || golem.runeCrystals < capacity) &&
    isMinable(action.tile)
  ) {
    action.progress[0] -= action.progress[1];
    if (game.tileAt(action.tile)[Offset.TILE_ID] === Tile.RUNE_CRYSTAL)
      golem.runeCrystals++;

    // reduce resources
    const t = game.tileAt(action.tile);
    t[Offset.DATA_0]--;
    if (t[Offset.DATA_0] === 0) {
      t[Offset.TILE_ID] = 0;
    }
    game.setTileAt(action.tile, t);
  }

  return (
    (isRuneCrystal && golem.runeCrystals === capacity) ||
    !isMinable(action.tile)
  );
};

export const mineHandler = [maker, processor] as const;
