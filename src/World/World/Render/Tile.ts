import { game } from "../../../Game/game";
import { Offset, ValuesPerTile } from "../../../types/map";
import { camera } from "../Camera";

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

export const renderTiles = (ctx: CanvasRenderingContext2D): void => {
  const x = Math.floor(Math.max(0, camera.c.pos[0] - 1));
  const y = Math.floor(Math.max(0, camera.c.pos[1] - 1));
  const X = Math.ceil(
    Math.min(game.plane.bounds[2], camera.c.pos[0] + camera.c.size[0])
  );
  const Y = Math.ceil(
    Math.min(game.plane.bounds[3], camera.c.pos[1] + camera.c.size[1])
  );
  for (let j = y; j < Y; j++) {
    for (let i = x; i < X; i++) {
      const tileID =
        game.plane.data[
          (j * game.plane.bounds[2] + i) * ValuesPerTile + Offset.TILE_ID
        ];
      const isVisible =
        game.plane.data[
          (j * game.plane.bounds[2] + i) * ValuesPerTile + Offset.FOG_OF_WAR
        ] > 0;
      ctx.fillStyle = isVisible ? colors[tileID] : "#666666ff";
      ctx.fillRect(i + 1 / 128, j + 1 / 128, 1 - 2 / 128, 1 - 2 / 128);
    }
  }
};
