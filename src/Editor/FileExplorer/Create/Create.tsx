import { useState } from "react";
import { Modal, ModalProps } from "../../../Modal/Modal";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useTranslation } from "react-i18next";
import { emptyFile, saveIncantation } from "../../../store/incantations";

export const CreateIncantationModal = ({
  open,
  onClose,
}: ModalProps): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [editName, setEditName] = useState(t("editor.defaultFileName"));
  const exists = useAppSelector((s) => !!s.incantations[editName]);

  const onCreate = (): void => {
    dispatch(
      saveIncantation({
        name: editName,
        content: emptyFile,
      })
    );
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex">
        <input
          className="input"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <button className={"btn ml-2"} onClick={onCreate} disabled={exists}>
          {t("editor.create")}
        </button>
      </div>
    </Modal>
  );
};
