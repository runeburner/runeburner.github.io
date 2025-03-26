import { useState } from "react";
import { PlusIcon } from "../../icons";
import { AddGolemModal } from "../AddGolemModal/AddGolemModal";

export const AddGolem = (): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const onClick = (): void => setOpen(true);
  return (
    <>
      <button className="cursor-pointer btn icon-button" onClick={onClick}>
        <PlusIcon />
      </button>
      <AddGolemModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
