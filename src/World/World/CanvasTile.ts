import { game } from "../../Game/game";
import { Offset, ValuesPerTile } from "../../types/map";
import { camera } from "./Camera";

const colors = [
  "#a2b9bc",
  "#b2ad7f",
  "#878f99",
  "#6b5b95",
  "#6b5b95",
  "#feb236",
  "#d64161",
  "#ff7b25",
  "#e3eaa7",
];

export const renderTiles = (ctx: CanvasRenderingContext2D) => {
  const x = Math.floor(Math.max(0, camera.c.pos[0] - 1));
  const y = Math.floor(Math.max(0, camera.c.pos[1] - 1));
  const X = Math.ceil(
    Math.min(game.map.bounds[2], camera.c.pos[0] + camera.c.size[0])
  );
  const Y = Math.ceil(
    Math.min(game.map.bounds[3], camera.c.pos[1] + camera.c.size[1])
  );
  console.log(x, y, X, Y);
  for (let j = y; j < Y; j++) {
    for (let i = x; i < X; i++) {
      const tileID =
        game.map.data[
          (j * game.map.bounds[2] + i) * ValuesPerTile + Offset.TILE_ID
        ];
      const isVisible =
        game.map.data[
          (j * game.map.bounds[2] + i) * ValuesPerTile + Offset.FOG_OF_WAR
        ] > 0;
      ctx.fillStyle = isVisible ? colors[tileID] : "#222222ff";
      ctx.fillRect(i * 64 + 0.5, j * 64 + 0.5, 64 - 1, 64 - 1);
    }
  }
};
