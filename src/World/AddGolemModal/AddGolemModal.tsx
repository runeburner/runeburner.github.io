import { useState } from "react";
import { EhwazIcon, OthalanIcon, TiwazIcon } from "../../icons";
import { Modal, ModalProps } from "../../Modal/Modal";
import { RuneSlider } from "./RuneSlider/RuneSlider";
import { Rune } from "../../types/rune";
import { Golem } from "../Golem/Golem";
import { MessageType } from "../../types/message";
import { useAppSelector } from "../../store/hooks";
import { store } from "../../store/store";
import { Channel } from "../channel";

export const AddGolemModal = ({ open, onClose }: ModalProps) => {
  const [runes, setRunes] = useState<Record<Rune, number>>(
    Object.fromEntries(Object.values(Rune).map((r) => [r, 2])) as Record<
      Rune,
      number
    >
  );
  const incantationNames = useAppSelector((s) => Object.keys(s.incantations));
  const [selectedIncantation, setSelectedIncantation] = useState(
    incantationNames[0]
  );

  const [health /*, setHealth*/] = useState<[number, number]>([0, 0]);
  const [armor /*, setArmor*/] = useState<[number, number]>([0, 0]);
  const [shield /*, setShield*/] = useState<[number, number]>([0, 0]);

  const appliedRunes: [Rune, number][] = Object.entries(runes).filter(
    (r) => r[1] > 0
  ) as [Rune, number][];
  const totalRunes = appliedRunes.reduce((acc, c) => acc + c[1], 0);

  const onAnimate = () => {
    Channel.send({
      type: MessageType.ANIMATE,
      data: {
        runes: appliedRunes,
        incantation: store.getState().incantations[selectedIncantation],
      },
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <Golem
          runes={appliedRunes}
          health={health}
          armor={armor}
          shield={shield}
        />
        <p>Runes: {totalRunes}/6</p>
        <p>Rune Types: {appliedRunes.length}/3</p>
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
        Incantation:
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
        <button onClick={onAnimate}>Animate</button>
      </div>
    </Modal>
  );
};
