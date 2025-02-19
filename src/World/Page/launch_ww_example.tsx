import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";

const extraScript = `const world = (() => {
  const workerID = self.name;
  const SEND = (command, args) => {
    return new Promise((res) => {
      const requestID = crypto.randomUUID();
      onmessage = ({ data }) => {
        if (data.workerID !== workerID || data.requestID !== requestID) return;
        res(data.data);
        onmessage = undefined;
      };
      postMessage({
        workerID,
        requestID,
        command,
        args,
      });
    });
  };

  return Object.freeze(
    new Proxy(
      {},
      {
        get(_, prop) {
          return (...args) => SEND(prop, args);
        },
      }
    )
  );
})();
\n`;

export const Example = () => {
  const i = useAppSelector((s) => s.incantations["basic"]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    const o = URL.createObjectURL(
      new Blob([extraScript + i], { type: "application/javascript" })
    );

    const worker = new Worker(new URL(o, import.meta.url), {
      name: crypto.randomUUID() + "_WEBWORKER_" + i,
    });
    worker.onmessage = (m) => {
      if (m.data.command === "ping") {
        worker.postMessage({
          workerID: m.data.workerID,
          requestID: m.data.requestID,
          data: "pong",
        });
      }
    };

    setStarted(true);
  }, [started, setStarted, i]);

  return <></>;
};
