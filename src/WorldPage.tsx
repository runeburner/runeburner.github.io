import { useEffect, useState } from "react";
import { useAppSelector } from "./store/hooks";
import { useIsTabSelected } from "./store/sidebar";

const extraScript = `self.importScripts('${location}/worker.js');\n`;

export const WorldPage = () => {
  const is = useIsTabSelected("WORLD");
  const i = useAppSelector((s) => s.incantations["basic"]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!is || started) return;

    const o = URL.createObjectURL(
      new Blob([extraScript + i], { type: "application/javascript" })
    );

    const worker = new Worker(new URL(o, import.meta.url), {
      name: crypto.randomUUID(),
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
  }, [is, started, setStarted, i]);
  if (!is) return <></>;

  return <></>;
};
