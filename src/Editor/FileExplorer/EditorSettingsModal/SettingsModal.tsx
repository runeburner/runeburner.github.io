import { Modal, ModalProps } from "../../../Modal/Modal";
import { useEditor } from "../EditorContext";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useTranslation } from "react-i18next";
import { MinusIcon, PlusIcon } from "../../../icons";
import { useState } from "react";

type EditorSettingsModalProps = ModalProps;

export const EditorSettingsModal = ({
  open,
  onClose,
}: EditorSettingsModalProps): React.ReactElement => {
  const { t } = useTranslation();
  const [editor] = useEditor();
  const [fontSize, setFontSize] = useState(
    editor?.getOption(monaco.editor.EditorOption.fontSize)
  );

  const changeSize = (n: number): (() => void) => {
    return () => {
      if (!editor) return;
      const fontSize = editor.getOption(monaco.editor.EditorOption.fontSize);
      const newFontSize = fontSize + n;
      editor.updateOptions({ fontSize: newFontSize });
      setFontSize(newFontSize);
      localStorage.setItem("EDITOR_FONT_SIZE", newFontSize + "");
    };
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-2">
        <p> {t("editor.fontSize")}</p>
        <div className="flex items-center">
          <MinusIcon style={{ width: "24px" }} onClick={changeSize(-1)} />
          {fontSize ?? editor?.getOption(monaco.editor.EditorOption.fontSize)}
          <PlusIcon style={{ width: "24px" }} onClick={changeSize(1)} />
        </div>
      </div>
    </Modal>
  );
};
