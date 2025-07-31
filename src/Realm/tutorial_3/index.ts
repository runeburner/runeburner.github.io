import { Game } from "../../Game/game";
import { ID } from "../../Game/id";
import { Entity } from "../../types/entity";
import { registerRealm } from "../Realms";
import { AddYggdrasilLeafs } from "../Rewards";
import mapData from "./mapData.txt?raw";

const init = (): void => {
  const entities = (): Entity[] => [
    {
      __type: EntityType.HEART,
      id: ID.next(),
      pos: [4, 5],
      visionRange: 3,
      health: [25, 25],
      armor: [0, 0],
      shield: [0, 0],
    },
    {
      __type: EntityType.RUNE_CRYSTAL,
      id: ID.next(),
      pos: [13, 4],
      quantity: 96,
      hardness: 1,
    },
  ];

  registerRealm({
    id: "tutorial_3",
    location: [17, 16],
    // parent: "tutorial_2",
    golemLives: 99,
    mapData: mapData,
    startingEntities: entities,
    goals: [
      {
        check: (game: Game): boolean => {
          return game.resources.musicalNotes >= 64;
        },
        i18nArgs: ["goals.getXNotes", { x: 64 }],
      },
    ],
    rewards: [AddYggdrasilLeafs(3)],
  });
};

init();
