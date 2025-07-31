import { useState } from "react";
import { Modal, ModalProps } from "../../../Modal/Modal";
import { useTranslation } from "react-i18next";
import {
  removeIncantation,
  renameIncantation,
} from "../../../store/incantations";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { iTextModelStore } from "../../Editor/editorStore";
import { closeModalByName, renameModel } from "../../../store/monacoModels";

type FileSettingsModalProps = {
  name: string;
} & ModalProps;

export const FileSettingsModal = ({
  open,
  onClose,
  name,
}: FileSettingsModalProps): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [editName, setEditName] = useState(name);
  const exists = useAppSelector((s) => !!s.incantations[editName]);

  const onSave = (): void => {
    iTextModelStore.rename(name, editName);
    dispatch(renameIncantation([name, editName]));
    dispatch(renameModel([name, editName]));
    onClose();
  };

  const onDelete = (): void => {
    dispatch(removeIncantation(name));
    dispatch(closeModalByName(name));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col justify-center">
        <div className="flex">
          <input
            className="input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <button className={"btn ml-2"} onClick={onSave} disabled={exists}>
            {t("editor.save")}
          </button>
        </div>
        <button className={"btn mt-4"} onClick={onDelete}>
          {t("editor.delete")}
        </button>
      </div>
    </Modal>
  );
};
