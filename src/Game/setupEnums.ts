import { EntityType } from "../types/entity";
import { Tile } from "../types/tile";

export const SetupGlobalEnums = (): void => {
  window.Tile = Tile;
  window.EntityType = EntityType;
};
