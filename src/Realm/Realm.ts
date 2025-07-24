import { Entity } from "../types/entity";
import { Vec } from "../types/vec";

export type Realm = {
  id: string;
  location: Vec;
  parent?: string;
  mapData: string;
  startingEntities: Entity[];
};
