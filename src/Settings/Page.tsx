import { useTranslation } from "react-i18next";
import { ChangeEvent } from "react";
import { Languages } from "../i18n";

export const Page = (): React.ReactElement => {
  const { t, i18n } = useTranslation();

  const onLanguageChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
    i18n.changeLanguage(ev.target.value);
  };
  return (
    <>
      <p>{t("settings.language")}:</p>
      <select value={i18n.language} onChange={onLanguageChange}>
        {Object.keys(Languages).map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </>
  );
};
