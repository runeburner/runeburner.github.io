import { useEffect, useState } from "react";

// This blocks rendering the world if the game worker isn't ready
const useGameReady = (() => {
  const worldReadyChannel = new BroadcastChannel("READY");
  let receivedReady = false;
  let onReceiveReady = () => {};
  worldReadyChannel.onmessage = () => {
    receivedReady = true;
    onReceiveReady();
    worldReadyChannel.close();
  };

  return () => {
    const [isReady, setReady] = useState(receivedReady);

    useEffect(() => {
      if (receivedReady) return;
      onReceiveReady = () => setReady(true);
    }, []);

    return isReady;
  };
})();

export const GameReadyGate = ({
  children,
}: React.PropsWithChildren<object>) => {
  const isReady = useGameReady();
  if (!isReady) return <></>;
  return <>{children}</>;
};
