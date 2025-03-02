import { useEffect, useState } from "react";

// This blocks rendering the world if the game worker isn't ready
const useGameReady = ((): (() => boolean) => {
  const worldReadyChannel = new BroadcastChannel("READY");
  let receivedReady = false;
  let onReceiveReady = (): void => {};
  worldReadyChannel.onmessage = (): void => {
    receivedReady = true;
    onReceiveReady();
    worldReadyChannel.close();
  };

  return (): boolean => {
    const [isReady, setReady] = useState(receivedReady);

    useEffect(() => {
      if (receivedReady) return;
      onReceiveReady = (): void => setReady(true);
    }, []);

    return isReady;
  };
})();

export const GameReadyGate = ({
  children,
}: React.PropsWithChildren<object>): React.ReactElement => {
  const isReady = useGameReady();
  if (!isReady) return <></>;
  return <>{children}</>;
};
