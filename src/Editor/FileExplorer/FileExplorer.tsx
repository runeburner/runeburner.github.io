import classes from "./FileExplorer.module.css";
import { useIncantationNames } from "../../store/incantations";
import { PlusIcon } from "../../icons";
import { File } from "./File/File";
import { CreateIncantationModal } from "./Create/Create";
import { useState } from "react";

export const FileExplorer = (): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const names = useIncantationNames();

  return (
    <div className="h-full py-2">
      <ul>
        {names.map((n) => (
          <File key={n} name={n} />
        ))}
        <li className={`px-3 py-1 ${classes.item} flex justify-center`}>
          <PlusIcon onClick={() => setOpen(true)} />
          <CreateIncantationModal open={open} onClose={() => setOpen(false)} />
        </li>
      </ul>
    </div>
  );
};
