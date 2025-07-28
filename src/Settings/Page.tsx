import { useTranslation } from "react-i18next";
import { ChangeEvent, useState } from "react";
import { Languages } from "../i18n/i18n";
import { setUIFPS, uiFPS } from "../World/uiFPS";
import { CHOSEN_LANGUAGE_KEY } from "../i18n/I18NPicker";

const fpsValues = [1, 2, 3, 5, 10, 15, 20, 25, 30, 60, 100];
export const Page = (): React.ReactElement => {
  const [sliderIndex, setSliderIndex] = useState(fpsValues.indexOf(uiFPS) + 1);
  const { t, i18n } = useTranslation();

  const onLanguageChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
    i18n.changeLanguage(ev.target.value);
    localStorage.setItem(CHOSEN_LANGUAGE_KEY, ev.target.value);
  };

  const onSliderChange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const v = parseInt(ev.target.value);
    setUIFPS(fpsValues[v - 1]);
    setSliderIndex(v);
  };

  return (
    <div className="m-4">
      <span>{t("settings.language")}: </span>
      <select
        className="select inline"
        value={i18n.language}
        onChange={onLanguageChange}
      >
        {Object.keys(Languages).map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <br />
      <p>FPS: {fpsValues[sliderIndex - 1]}</p>
      <input
        type="range"
        min={1}
        max={fpsValues.length}
        step={1}
        value={sliderIndex}
        onChange={onSliderChange}
      />
    </div>
  );
};
