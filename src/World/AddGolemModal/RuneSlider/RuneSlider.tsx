import { Rune } from "../../../types/rune";
import { EditIcon, MinusIcon, PlusIcon } from "../../../icons";
import { useTranslation } from "react-i18next";

type RuneSliderProps = {
  icon: typeof EditIcon;
  amount: number;
  disabled?: boolean;
  rune: Rune;
  onUpdate: React.Dispatch<React.SetStateAction<Record<string, number>>>;
};

export const RuneSlider = ({
  icon: Icon,
  rune,
  onUpdate,
  amount,
  disabled,
}: RuneSliderProps) => {
  const { t } = useTranslation();
  return (
    <>
      <p>{t(`runes.${rune}.name`)}</p>
      <div style={{ display: "flex", margin: "8px", alignItems: "center" }}>
        <Icon style={{ width: "24px", height: "24px" }} />
        <MinusIcon
          onClick={() =>
            onUpdate((runes) => ({
              ...runes,
              [rune]: Math.max(0, runes[rune] - 1),
            }))
          }
        />
        {amount}
        <PlusIcon
          onClick={() =>
            !disabled &&
            onUpdate((runes) => ({
              ...runes,
              [rune]: runes[rune] + 1,
            }))
          }
        />
      </div>
      <p>{t(`runes.${rune}.effect`)}</p>
    </>
  );
};
