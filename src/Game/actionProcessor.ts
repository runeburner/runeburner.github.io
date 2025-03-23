import {
  ActionProgress,
  ActionType,
  ATTUNEProgress,
  MINEProgress,
  MOVE_NEXT_TOProgress,
  SMASHProgress,
} from "../types/actions";
import { Entity, GolemEntity } from "../types/entity";
import { Offset } from "../types/map";
import { Tile } from "../types/tile";
import { game } from "./game";
import { aStarPath } from "./path";

export const process: {
  [T in ActionType]: (rate: number, e: Entity, p: ActionProgress) => boolean;
} = {
  [ActionType.IDLE]: () => true,
  [ActionType.MOVE_NEXT_TO]: (
    rate: number,
    e: Entity,
    p: ActionProgress
  ): boolean => {
    const golem = e as GolemEntity;
    const mp = p as MOVE_NEXT_TOProgress;
    mp.progress[0] += golem.speed * rate * game.powers.attune_power;
    while (mp.progress[0] >= mp.progress[1]) {
      if (game.entityAt(mp.path[1])) {
        const newPath = aStarPath(golem.pos, mp.goal);
        if (!newPath) return true;
        newPath.pop();
        mp.path = newPath;
      }
      mp.progress[0] -= mp.progress[1];
      mp.path.shift();
      const nextNode = mp.path[0];
      game.updateFoW(golem.pos, nextNode, golem.visionRange);
      golem.pos = [...nextNode];
      mp.pos = [...nextNode];
    }
    return mp.path.length === 1;
  },
  [ActionType.MINE]: (rate: number, e: Entity, p: ActionProgress): boolean => {
    const golem = e as GolemEntity;
    const action = p as MINEProgress;
    if (game.tileAt(action.tile)[Offset.TILE_ID] !== Tile.MANA_CRYSTAL)
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
      game.tileAt(action.tile)[Offset.TILE_ID] !== Tile.MANA_CRYSTAL
    );
  },
  [ActionType.ATTUNE]: (
    rate: number,
    e: Entity,
    p: ActionProgress
  ): boolean => {
    const golem = e as GolemEntity;
    const action = p as ATTUNEProgress;
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
  },
  [ActionType.DIE]: () => true,
  [ActionType.SMASH]: (
    rate: number,
    _e: Entity,
    p: ActionProgress
  ): boolean => {
    const action = p as SMASHProgress;
    const target = game.entityM.get(action.target);
    if (!target) return true;
    action.progress[0] += rate * game.powers.attune_power;

    while (action.progress[0] >= action.progress[1]) {
      action.progress[0] -= action.progress[1];
      const died = game.damage(target, 1);
      if (died) return true;
    }

    return false;
  },
};
