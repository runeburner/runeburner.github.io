import { useEffect, useState } from "react";
import { MagicIcon } from "../icons";
import { Resources } from "../types/resources";
import { Channel } from "../World/channel";

const useResources = () => {
  const [r, setR] = useState<Resources>({
    attunement: 0,
  });

  useEffect(() => {
    return Channel.subResources(setR);
  }, [setR]);

  return r;
};

export const ResourceHeader = () => {
  const r = useResources();
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>{r.attunement}</p>
      <MagicIcon style={{ height: "24px", width: "24px" }} />
    </div>
  );
};
