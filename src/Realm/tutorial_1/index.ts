import { Game } from "../../Game/game";
import { ID } from "../../Game/id";
import { EldritchRune } from "../../types/eldritchRunes";
import { Entity } from "../../types/entity";
import { registerRealm } from "../Realms";
import { AddYggdrasilLeafs, UnlockEldritchRune } from "../Rewards";
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
      pos: [2, 2],
      quantity: 16,
      hardness: 1,
    },
    {
      __type: EntityType.RUNE_CRYSTAL,
      id: ID.next(),
      pos: [2, 3],
      quantity: 16,
      hardness: 1,
    },
    {
      __type: EntityType.RUNE_CRYSTAL,
      id: ID.next(),
      pos: [2, 4],
      quantity: 16,
      hardness: 1,
    },
    {
      __type: EntityType.RUNE_CRYSTAL,
      id: ID.next(),
      pos: [2, 5],
      quantity: 16,
      hardness: 1,
    },

    {
      __type: EntityType.RUNE_CRYSTAL,
      id: ID.next(),
      pos: [4, 1],
      quantity: 16,
      hardness: 1,
    },
    {
      __type: EntityType.RUNE_CRYSTAL,
      id: ID.next(),
      pos: [5, 1],
      quantity: 16,
      hardness: 1,
    },

    {
      __type: EntityType.RUNE_CRYSTAL,
      id: ID.next(),
      pos: [4, 2],
      quantity: 16,
      hardness: 1,
    },
    {
      __type: EntityType.RUNE_CRYSTAL,
      id: ID.next(),
      pos: [5, 2],
      quantity: 16,
      hardness: 1,
    },
  ];

  registerRealm({
    id: "tutorial_1",
    location: [18, 13],
    // parent: "tutorial_0",
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
    rewards: [AddYggdrasilLeafs(1), UnlockEldritchRune(EldritchRune.BLOOD)],
  });
};

init();
