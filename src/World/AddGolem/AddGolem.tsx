import { useState } from "react";
import { PlusIcon } from "../../icons";
import classes from "./AddGolem.module.css";
import { AddGolemModal } from "../AddGolemModal/AddGolemModal";

export const AddGolem = (): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const onClick = (): void => setOpen(true);
  return (
    <>
      <div className={"m-4 fixed " + classes.container}>
        <button className="cursor-pointer icon-button">
          <PlusIcon onClick={onClick} />
        </button>
      </div>
      <AddGolemModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
