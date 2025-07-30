import { ActionProgress, FADE } from "../../types/actions";
import { game } from "../game";

const maker = (a: FADE): ActionProgress | true | null => {
  game.removeEntity(a.id);
  return null;
};
const processor = (): boolean => true;

export const fadeHandler = [maker, processor] as const;
