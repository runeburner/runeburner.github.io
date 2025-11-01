import { ActionType } from "../types/actions";
import { Vec } from "../types/vec";

export type SpecialEffect = {
  pos: Vec;
  actionType: ActionType;
};
