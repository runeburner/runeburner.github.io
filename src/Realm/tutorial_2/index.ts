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
      visionRange: 10,
      health: [25, 25],
      armor: [0, 0],
      shield: [0, 0],
    },
    {
      __type: EntityType.RUNE_CRYSTAL,
      id: ID.next(),
      pos: [4, 8],
      quantity: 96,
      hardness: 1,
    },

    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [2, 2],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [3, 2],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [4, 2],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [5, 2],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [6, 2],
      quantity: 16,
      hardness: 20,
    },

    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [2, 3],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [6, 3],
      quantity: 16,
      hardness: 20,
    },

    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [2, 4],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [6, 4],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [2, 5],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [6, 5],
      quantity: 16,
      hardness: 20,
    },

    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [2, 6],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [6, 6],
      quantity: 16,
      hardness: 20,
    },

    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [2, 7],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [3, 7],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [4, 7],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [5, 7],
      quantity: 16,
      hardness: 20,
    },
    {
      __type: EntityType.ROCK,
      id: ID.next(),
      pos: [6, 7],
      quantity: 16,
      hardness: 20,
    },
  ];

  registerRealm({
    id: "tutorial_2",
    location: [18, 14],
    // parent: "tutorial_1",
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
    rewards: [AddYggdrasilLeafs(1)],
  });
};

init();
