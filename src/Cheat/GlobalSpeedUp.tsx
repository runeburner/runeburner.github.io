import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { GLOBAL_SPEED_UP_KEY } from "../debug";

export const GlobalSpeedUp = (): React.ReactElement => {
  const { t } = useTranslation();
  const [speed, setSpeed] = useState(
    parseFloat(localStorage.getItem(GLOBAL_SPEED_UP_KEY) ?? "1")
  );

  const onSpeedchange = (ev: ChangeEvent<HTMLInputElement>): void => {
    const newSpeed = parseFloat(ev.target.value);
    if (newSpeed <= 0) return;
    localStorage.setItem(GLOBAL_SPEED_UP_KEY, ev.target.value);
    setSpeed(newSpeed);
  };

  return (
    <tr>
      <td>
        <p>{t("cheat." + GLOBAL_SPEED_UP_KEY)}</p>
      </td>
      <td>
        <input
          className="input"
          type="number"
          value={speed}
          onChange={onSpeedchange}
        />
      </td>
    </tr>
  );
};
