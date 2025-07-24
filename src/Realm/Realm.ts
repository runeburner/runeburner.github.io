import { Game } from "../Game/game";
import { Entity } from "../types/entity";
import { Vec } from "../types/vec";
import { useTranslation } from "react-i18next";

export type Goal = {
  check: (game: Game) => boolean;
  i18nArgs: Parameters<ReturnType<typeof useTranslation>["t"]>;
};

export type Realm = {
  id: string;
  location: Vec;
  parent?: string;
  mapData: string;
  startingEntities: () => Entity[];
  goals: Goal[];
};
