import { useState } from "react";
import { PlusSquareIcon } from "../../icons";
import classes from "./AddGolem.module.css";
import { AddGolemModal } from "../AddGolemModal/AddGolemModal";

export const AddGolem = () => {
  const [open, setOpen] = useState(false);
  const onClick = () => setOpen(true);
  return (
    <>
      <div className={classes.container}>
        <PlusSquareIcon onClick={onClick} />
      </div>
      <AddGolemModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
