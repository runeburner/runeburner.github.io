import { Rune } from "../../../Game/runes";
import { EditIcon, MinusIcon, PlusIcon } from "../../../icons";

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
  return (
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
  );
};
