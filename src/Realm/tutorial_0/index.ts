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
          return game.findAllTiles([0, 0], Tile.ROCK, 999999).length === 0;
        },
        i18nArgs: ["goals.destroyAllRocks"],
      },
    ],
    rewards: [AddYggdrasilLeafs(1)],
  });
};

init();
