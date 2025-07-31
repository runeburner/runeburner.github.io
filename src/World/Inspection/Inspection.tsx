import { AddGolem } from "../AddGolem/AddGolem";
import classes from "./Inspection.module.css";
import { EntityList } from "./EntityList";
import { SelectedTile } from "./SelectedTile";

export const Inspection = (): React.ReactElement => {
  return (
    <div className={"m-4 p-2 fixed " + classes.container}>
      <EntityList />
      <SelectedTile />
      <div className="w-full flex justify-end">
        <AddGolem />
      </div>
    </div>
  );
};
