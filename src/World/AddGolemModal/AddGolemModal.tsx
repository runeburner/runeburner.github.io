import { useState } from "react";
import { EhwazIcon, OthalanIcon, TiwazIcon } from "../../icons";
import { Modal, ModalProps } from "../../Modal/Modal";
import { RuneSlider } from "./RuneSlider/RuneSlider";
import { Rune } from "../../types/rune";
import { store } from "../../store/store";
import { useTranslation } from "react-i18next";
import { useIncantationNames } from "../../store/incantations";
import { game } from "../../Game/game";

const maxRunes = 12;

export const AddGolemModal = ({
  open,
  onClose,
}: ModalProps): React.ReactElement => {
  const { t } = useTranslation();
  const [runes, setRunes] = useState<Record<Rune, number>>(
    Object.fromEntries(Object.values(Rune).map((r) => [r, 4])) as Record<
      Rune,
      number
    >
  );
  const incantationNames = useIncantationNames();
  const [selectedIncantation, setSelectedIncantation] = useState(
    incantationNames[0]
  );

  const appliedRunes = Object.entries(runes).filter((r) => r[1] > 0) as [
    Rune,
    number
  ][];
  const totalRunes = appliedRunes.reduce((acc, c) => acc + c[1], 0);
  const disabled = totalRunes >= maxRunes;

  const onAnimate = (): void => {
    game.animate(runes, store.getState().incantations[selectedIncantation]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <p style={{ fontSize: "2em" }} className="mb-2">
          {t("create_golem_modal.runes")}: {totalRunes} / {maxRunes}
        </p>
        <RuneSlider
          onUpdate={setRunes}
          rune={Rune.WIND}
          icon={EhwazIcon}
          amount={runes[Rune.WIND]}
          disabled={disabled}
        />
        <RuneSlider
          onUpdate={setRunes}
          rune={Rune.LABOR}
          icon={TiwazIcon}
          amount={runes[Rune.LABOR]}
          disabled={disabled}
        />
        <RuneSlider
          onUpdate={setRunes}
          rune={Rune.VOID}
          icon={OthalanIcon}
          amount={runes[Rune.VOID]}
          disabled={disabled}
        />
        <div className="my-2">
          {t("create_golem_modal.incantation")}:{" "}
          <select
            value={selectedIncantation}
            onChange={(e) => setSelectedIncantation(e.target.value)}
          >
            {incantationNames.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <button className="btn w-full my-2" onClick={onAnimate}>
          {t("create_golem_modal.animate")}
        </button>
      </div>
    </Modal>
  );
};
