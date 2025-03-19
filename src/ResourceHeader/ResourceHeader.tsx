import { MagicIcon } from "../icons";
import classes from "./ResourceHeader.module.css";

export const ResourceHeader = (): React.ReactElement => {
  const r = { attunement: 0 };
  return (
    <div className={"py-2 flex-center w-full " + classes.container}>
      <span>{r.attunement}</span>
      <MagicIcon style={{ height: "24px", width: "24px" }} />
    </div>
  );
};
