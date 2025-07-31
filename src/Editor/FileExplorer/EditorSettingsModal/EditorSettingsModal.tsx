import { Modal, ModalProps } from "../../../Modal/Modal";
import { useTranslation } from "react-i18next";
import { MinusIcon, PlusIcon } from "../../../icons";
import { ChangeEvent, useState } from "react";
import { EditorSettings, updateEditorOptions } from "../../EditorSettings";

type EditorSettingsModalProps = ModalProps;

const monacoThemes = ["vs", "vs-dark", "hc-black", "hc-light"];

export const EditorSettingsModal = ({
  open,
  onClose,
}: EditorSettingsModalProps): React.ReactElement => {
  const { t } = useTranslation();
  const [fontSize, setFontSize] = useState(EditorSettings.fontSize);
  const [theme, setTheme] = useState(EditorSettings.theme);

  const changeSize = (n: number): (() => void) => {
    return () => {
      setFontSize(fontSize + n);
      updateEditorOptions({ fontSize: fontSize + n });
    };
  };

  const onThemeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setTheme(e.target.value);
    updateEditorOptions({ theme: e.target.value });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-2">
        <p> {t("editor.fontSize")}</p>
        <div className="flex items-center">
          <MinusIcon style={{ width: "24px" }} onClick={changeSize(-1)} />
          {fontSize}
          <PlusIcon style={{ width: "24px" }} onClick={changeSize(1)} />
        </div>
        <p>{t("editor.theme")}</p>
        <select className="select" value={theme} onChange={onThemeChange}>
          {monacoThemes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
};
