import { useEffect, useState } from "react";
import { MagicIcon } from "../icons";
import { Resources } from "../types/resources";
import { Channel } from "../World/channel";
import classes from "./ResourcesHeader.module.css";

const useResources = (): Resources => {
  const [r, setR] = useState<Resources>({
    attunement: 0,
  });

  useEffect(() => {
    return Channel.subResources(setR);
  }, [setR]);

  return r;
};

export const ResourceHeader = (): React.ReactElement => {
  const r = useResources();
  return (
    <div className={"py-2 " + classes.container}>
      <span>{r.attunement}</span>
      <MagicIcon style={{ height: "24px", width: "24px" }} />
    </div>
  );
};
