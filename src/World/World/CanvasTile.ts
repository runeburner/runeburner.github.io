import { game } from "../../Game/game";
import { Offset, ValuesPerTile } from "../../types/map";
import { Camera } from "../../types/uiMessages";

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

export const renderTiles = (ctx: CanvasRenderingContext2D, camera: Camera) => {
  const x = Math.max(0, camera.pos[0]);
  const y = Math.max(0, camera.pos[1]);
  const X = Math.min(game.map.bounds[2], camera.pos[0] + camera.size[0]);
  const Y = Math.min(game.map.bounds[3], camera.pos[1] + camera.size[1]);
  for (let j = y; j < Y; j++) {
    for (let i = x; i < X; i++) {
      const tileID =
        game.map.data[
          (j * game.map.bounds[2] + i) * ValuesPerTile + Offset.TILE_ID
        ];
      const fow =
        game.map.data[
          (j * game.map.bounds[2] + i) * ValuesPerTile + Offset.FOG_OF_WAR
        ];
      ctx.fillStyle = fow ? colors[tileID] : "#00000000";
      ctx.fillRect(i * 64 + 0.5, j * 64 + 0.5, 64 - 1, 64 - 1);
    }
  }
};
