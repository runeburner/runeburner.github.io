import { useState } from "react";
import { EhwazIcon, OthalanIcon, TiwazIcon } from "../../icons";
import { Modal, ModalProps } from "../../Modal/Modal";
import { RuneSlider } from "./RuneSlider/RuneSlider";
import { Rune } from "../../types/rune";
import { Golem } from "../Golem/Golem";
import { UIMessageType } from "../../types/uiMessages";
import { store } from "../../store/store";
import { Channel } from "../channel";
import { Vec } from "../../types/vec";
import { useTranslation } from "react-i18next";
import { useIncantationNames } from "../../store/incantations";
export const AddGolemModal = ({
  open,
  onClose,
}: ModalProps): React.ReactElement => {
  const { t } = useTranslation();
  const [runes, setRunes] = useState<Record<Rune, number>>(
    Object.fromEntries(Object.values(Rune).map((r) => [r, 2])) as Record<
      Rune,
      number
    >
  );
  const incantationNames = useIncantationNames();
  const [selectedIncantation, setSelectedIncantation] = useState(
    incantationNames[0]
  );

  const [health /*, setHealth*/] = useState<Vec>([50, 50]);
  const [armor /*, setArmor*/] = useState<Vec>([50, 50]);
  const [shield /*, setShield*/] = useState<Vec>([50, 50]);
  const [mana /*, setMana*/] = useState<Vec>([50, 50]);

  const appliedRunes: [Rune, number][] = Object.entries(runes).filter(
    (r) => r[1] > 0
  ) as [Rune, number][];
  const totalRunes = appliedRunes.reduce((acc, c) => acc + c[1], 0);

  const onAnimate = (): void => {
    for (let i = 0; i < 5; i++) {
      setTimeout(
        () =>
          Channel.send({
            __type: UIMessageType.ANIMATE,
            data: {
              runes: appliedRunes,
              incantation: store.getState().incantations[selectedIncantation],
            },
          }),
        i * 200
      );
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <div style={{ height: "128px" }}>
          <Golem
            runes={appliedRunes}
            health={health}
            armor={armor}
            shield={shield}
            mana={mana}
          />
        </div>
        <p>
          {t("create_golem_modal.runes")}: {totalRunes}/6
        </p>
        <p>
          {t("create_golem_modal.rune_types")}: {appliedRunes.length}/3
        </p>
        <RuneSlider
          onUpdate={setRunes}
          rune={Rune.WIND}
          icon={EhwazIcon}
          amount={runes[Rune.WIND]}
        />
        <RuneSlider
          onUpdate={setRunes}
          rune={Rune.LABOR}
          icon={TiwazIcon}
          amount={runes[Rune.LABOR]}
        />
        <RuneSlider
          onUpdate={setRunes}
          rune={Rune.VOID}
          icon={OthalanIcon}
          amount={runes[Rune.VOID]}
        />
        {t("create_golem_modal.incantation")}:
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
        <br />
        <button className="w-full my-2" onClick={onAnimate}>
          {t("create_golem_modal.animate")}
        </button>
      </div>
    </Modal>
  );
};
