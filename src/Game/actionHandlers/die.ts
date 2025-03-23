import { ActionProgress, DIE } from "../../types/actions";
import { game } from "../game";

const maker = (a: DIE): ActionProgress | true | null => {
  game.removeEntity(a.id);
  return null;
};
const processor = (): boolean => true;

export const dieHandler = [maker, processor] as const;
