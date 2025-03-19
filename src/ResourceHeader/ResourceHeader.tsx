import { MagicIcon } from "../icons";
import { useAttunement } from "../store/resources";
import classes from "./ResourceHeader.module.css";

export const ResourceHeader = (): React.ReactElement => {
  const attunement = useAttunement();
  return (
    <div className={"py-2 flex-center w-full " + classes.container}>
      <span>{attunement}</span>
      <MagicIcon style={{ height: "24px", width: "24px" }} />
    </div>
  );
};
