import { Game } from "../Game/game";
import { Entity } from "../types/entity";
import { Vec } from "../types/vec";
import { useTranslation } from "react-i18next";

export type Goal = Readonly<{
  check: (game: Game) => boolean;
  i18nArgs: Parameters<ReturnType<typeof useTranslation>["t"]>;
}>;

export type Reward = Readonly<{
  apply: (game: Game) => void;
  i18nArgs: Parameters<ReturnType<typeof useTranslation>["t"]>;
}>;

export type Realm = Readonly<{
  id: string;
  location: Vec;
  parent?: string;
  mapData: string;
  golemLives: number;
  startingEntities: () => Entity[];
  goals: Goal[];
  rewards: Reward[];
}>;
