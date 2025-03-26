import {
  ActionProgress,
  ActionType,
  MINE,
  MINEProgress,
} from "../../types/actions";
import { Entity, EntityType } from "../../types/entity";
import { Offset } from "../../types/map";
import { Tile } from "../../types/tile";
import { dist, eq } from "../../types/vec";
import { game } from "../game";
import { isArgs, isVec } from "../validation";

const maker = (a: MINE): ActionProgress | true | null => {
  if (!isArgs([a.v], isVec)) return null;
  const old = game.actionM.get(a.id);
  const golem = game.entityM.get(a.id);

  if (golem?.__type !== EntityType.GOLEM) return null;

  // If it's too far.
  if (dist(golem.pos, a.v) > 1) return null;

  // If the golem is full.
  if (golem.minecapacity[0] === golem.minecapacity[1]) return null;

  // If we're trying to mine anything other than a mana crystal
  const tile = game.tileAt(a.v);
  if (tile[Offset.TILE_ID] !== Tile.RUNE_CRYSTAL) return null;

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

const processor = (
  rate: number,
  golem: Entity,
  action: MINEProgress
): boolean => {
  if (golem.__type !== EntityType.GOLEM) return true;
  if (game.tileAt(action.tile)[Offset.TILE_ID] !== Tile.RUNE_CRYSTAL)
    return true;

  action.progress[0] += golem.mineSpeed * rate * game.powers.attune_power;
  while (
    action.progress[0] >= action.progress[1] &&
    golem.minecapacity[0] < golem.minecapacity[1] &&
    game.tileAt(action.tile)[Offset.DATA_0] > 0
  ) {
    action.progress[0] -= action.progress[1];
    golem.minecapacity[0]++;

    // reduce resources
    const t = game.tileAt(action.tile);
    t[Offset.DATA_0]--;
    if (t[Offset.DATA_0] === 0) {
      t[Offset.TILE_ID] = 0;
    }
    game.setTileAt(action.tile, t);
  }

  return (
    golem.minecapacity[0] === golem.minecapacity[1] ||
    game.tileAt(action.tile)[Offset.TILE_ID] !== Tile.RUNE_CRYSTAL
  );
};

export const mineHandler = [maker, processor] as const;
