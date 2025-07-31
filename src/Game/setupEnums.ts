import { EntityType } from "../types/entity";
import { Tile } from "../types/tile";

export const SetupGlobals = (): void => {
  window.Tile = Tile;
  window.EntityType = EntityType;
  window.Memory = {};
};
