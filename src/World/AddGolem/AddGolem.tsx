import { useState } from "react";
import { PlusIcon } from "../../icons";
import classes from "./AddGolem.module.css";
import { AddGolemModal } from "../AddGolemModal/AddGolemModal";

export const AddGolem = () => {
  const [open, setOpen] = useState(false);
  const onClick = () => setOpen(true);
  return (
    <>
      <div className={"m-4 " + classes.container}>
        <button className="cursor-pointer icon-button">
          <PlusIcon onClick={onClick} />
          {/* <div style={{ width: "24px", height: "24px" }} onClick={onClick} /> */}
        </button>
      </div>
      <AddGolemModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
