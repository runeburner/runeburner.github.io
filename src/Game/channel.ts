import { MessageTypes, UIMessage } from "./messages";
import { ValuesPerTile, map } from "./worker";

const UIChannel = new BroadcastChannel("UI");

// x, y, w, h
const camera = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

UIChannel.onmessage = (event) => {
  const msg = event.data as UIMessage;
  switch (msg.type) {
    case MessageTypes.SUBSCRIBE: {
      Object.assign(camera, msg.data);
      const x = Math.max(0, camera.x);
      const y = Math.max(0, camera.y);
      const X = Math.min(map.width, camera.x + camera.width);
      const Y = Math.min(map.height, camera.y + camera.height);
      const width = X - x;
      const height = Y - y;
      const data = new Int32Array(width * height * ValuesPerTile);
      for (let i = x; i < X; i++) {
        for (let j = y; j < Y; j++) {
          data[((j - y) * width + i - x) * ValuesPerTile] =
            map.data[(j * map.width + i) * ValuesPerTile];
        }
      }
      UIChannel.postMessage({
        type: "MAP",
        data: {
          x,
          y,
          map: {
            width,
            height,
            data,
          },
        },
      });
    }
  }
};
