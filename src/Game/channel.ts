import { MessageTypes, UIMessage } from "./messages";
import { map } from "./worker";

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
      const submap: number[][] = [];
      const startX = Math.max(0, camera.x);
      const startY = Math.max(0, camera.y);
      for (
        let x = startX;
        x < Math.min(map.length, camera.x + camera.width);
        x++
      ) {
        const row: number[] = [];
        for (
          let y = startY;
          y < Math.min(map.length, camera.y + camera.height);
          y++
        ) {
          row.push(map[x][y]);
        }
        submap.push(row);
      }
      UIChannel.postMessage({
        type: "MAP",
        data: {
          tiles: submap,
          x: startX,
          y: startY,
        },
      });
    }
  }
};
