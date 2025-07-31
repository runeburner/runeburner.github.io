import { Game } from "../../Game/game";
import { ID } from "../../Game/id";
import { Entity, EntityType } from "../../types/entity";
import { registerRealm } from "../Realms";
import { AddYggdrasilLeafs } from "../Rewards";
import mapData from "./mapData.txt?raw";

const init = (): void => {
  const entities = (): Entity[] => [
    {
      __type: EntityType.HEART,
      id: ID.next(),
      pos: [4, 5],
      visionRange: 10,
      health: [25, 25],
      armor: [0, 0],
      shield: [0, 0],
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [3, 2],
      quantity: 8,
      hardness: 5,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [4, 2],
      quantity: 8,
      hardness: 5,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [5, 2],
      quantity: 4,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [5, 3],
      quantity: 8,
      hardness: 5,
    },
  ];

  registerRealm({
    id: "tutorial_0",
    location: [19, 11],
    golemLives: 99,
    mapData: mapData,
    startingEntities: entities,
    goals: [
      {
        check: (game: Game): boolean => {
          return !game.entities
            .values()
            .some((e) => e.__type === EntityType.ROCK);
        },
        i18nArgs: ["goals.destroyAllRocks"],
      },
    ],
    rewards: [AddYggdrasilLeafs(1)],
  });
};

init();
