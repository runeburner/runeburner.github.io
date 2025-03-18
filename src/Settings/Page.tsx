import { useTranslation } from "react-i18next";
import { ChangeEvent, useState } from "react";
import { Languages } from "../i18n";
import { setUIFPS, uiFPS } from "../World/uiThrottler";

export const Page = (): React.ReactElement => {
  const [fps, setFPS] = useState(uiFPS);
  const { t, i18n } = useTranslation();

  const onLanguageChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
    i18n.changeLanguage(ev.target.value);
  };
  const onFPSChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(ev.target.value);
    setUIFPS(v);
    setFPS(v);
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
      <br />
      <p>FPS: {fps}</p>
      <input
        type="range"
        min="1"
        max="100"
        value={fps}
        onChange={onFPSChange}
      />
    </>
  );
};
