import { useState } from "react";
import { EhwazIcon, OthalanIcon, TiwazIcon } from "../../icons";
import { Modal, ModalProps } from "../../Modal/Modal";
import { RuneSlider } from "./RuneSlider/RuneSlider";
import { Rune } from "../../Game/runes";
import { Golem } from "../Golem/Golem";

type DemoBarProps = {
  label: string;
  value: [number, number];
  setValue: React.Dispatch<React.SetStateAction<[number, number]>>;
};

const DemoBar = ({ label, value, setValue }: DemoBarProps) => {
  return (
    <>
      <span>{label}</span>
      <input
        type="range"
        min={0}
        max={50}
        value={value[0]}
        onChange={(e) =>
          setValue(([, m]) => {
            const nextCurrent = parseInt(e.target.value);
            return [nextCurrent, Math.max(nextCurrent, m)];
          })
        }
      />
      <span>{value[0]}</span>
      <br />

      <span>max {label}</span>
      <input
        type="range"
        min={0}
        max={50}
        value={value[1]}
        onChange={(e) =>
          setValue(([c]) => {
            const nextMax = parseInt(e.target.value);
            return [Math.min(nextMax, c), nextMax];
          })
        }
      />
      <span>{value[1]}</span>
      <br />
    </>
  );
};

export const AddGolemModal = ({ open, onClose }: ModalProps) => {
  const [runes, setRunes] = useState<Record<Rune, number>>(
    Object.fromEntries(Object.values(Rune).map((r) => [r, 0])) as Record<
      Rune,
      number
    >
  );

  const [health, setHealth] = useState<[number, number]>([11, 12]);
  const [armor, setArmor] = useState<[number, number]>([0, 0]);
  const [shield, setShield] = useState<[number, number]>([0, 0]);

  const appliedRunes: [Rune, number][] = Object.entries(runes).filter(
    (r) => r[1] > 0
  ) as [Rune, number][];
  const totalRunes = appliedRunes.reduce((acc, c) => acc + c[1], 0);

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
        <DemoBar label="health" value={health} setValue={setHealth} />
        <DemoBar label="armor" value={armor} setValue={setArmor} />
        <DemoBar label="shield" value={shield} setValue={setShield} />
      </div>
    </Modal>
  );
};
