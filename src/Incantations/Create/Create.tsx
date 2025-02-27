import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { defaultIncantation, saveIncantation } from "../../store/incantations";
import { useTranslation } from "react-i18next";

export const Create = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const onClick = () => {
    dispatch(
      saveIncantation({
        name,
        content: defaultIncantation,
      })
    );
    setName("");
  };
  return (
    <>
      <input
        type="text"
        placeholder={t("incantation_page.create_placeholder")}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={onClick} disabled={name === ""}>
        {t("incantation_page.create_incantation_button")}
      </button>
    </>
  );
};
