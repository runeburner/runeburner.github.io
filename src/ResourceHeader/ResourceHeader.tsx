import classes from "./ResourceHeader.module.css";
import { MusicNotesHeader } from "./MusicNotesHeader";
import { ChoordsHeader } from "./ChoordsHeader";
import { LeafHeader } from "./LeafHeader";
import { LivesHeader } from "./LivesHeader";
import { GolemHeader } from "./GolemHeader";

export const ResourceHeader = (): React.ReactElement => {
  return (
    <div className={"py-2 flex-center w-full " + classes.container}>
      <MusicNotesHeader />
      <ChoordsHeader />
      <LeafHeader />
      <LivesHeader />
      <GolemHeader />
    </div>
  );
};
