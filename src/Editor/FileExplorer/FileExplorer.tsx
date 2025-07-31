import classes from "./FileExplorer.module.css";
import { useIncantationNames } from "../../store/incantations";
import { FilePlusIcon, SettingsIcon } from "../../icons";
import { File } from "./File/File";
import { CreateIncantationModal } from "./Create/Create";
import { useState } from "react";
import { EditorSettingsModal } from "./EditorSettingsModal/SettingsModal";

export const FileExplorer = (): React.ReactElement => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const names = useIncantationNames();

  return (
    <div className="h-full py-2">
      <ul>
        <li className={`px-3 py-1 ${classes.item} flex justify-center`}>
          <SettingsIcon
            style={{ width: "24px" }}
            onClick={() => setSettingsOpen(true)}
          />
          <EditorSettingsModal
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
          <FilePlusIcon
            style={{ width: "24px" }}
            onClick={() => setCreateOpen(true)}
          />
          <CreateIncantationModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
          />
        </li>
        {names.map((n) => (
          <File key={n} name={n} />
        ))}
      </ul>
    </div>
  );
};
