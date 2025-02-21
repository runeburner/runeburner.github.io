import { useState } from "react";
import { EhwazIcon, OthalanIcon, TiwazIcon } from "../../icons";
import { Modal, ModalProps } from "../../Modal/Modal";
import { RuneSlider } from "./RuneSlider/RuneSlider";
import { Rune } from "../../Game/runes";
import { Golem } from "../Golem/Golem";

export const AddGolemModal = ({ open, onClose }: ModalProps) => {
  const [runes, setRunes] = useState<Record<Rune, number>>(
    Object.fromEntries(Object.values(Rune).map((r) => [r, 0])) as Record<
      Rune,
      number
    >
  );

  const [health, setHealth] = useState(10);
  const [armor, setArmor] = useState(10);
  const [shield, setShield] = useState(10);
  const [percent, setPercent] = useState(75);

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
          percent={percent / 100}
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
        <span>health</span>
        <input
          type="range"
          min={0}
          max={50}
          value={health}
          onChange={(e) => setHealth(parseInt(e.target.value))}
        />
        <span>{health}</span>
        <br></br>
        <span>armor</span>
        <input
          type="range"
          min={0}
          max={50}
          value={armor}
          onChange={(e) => setArmor(parseInt(e.target.value))}
        />
        <span>{armor}</span>
        <br></br>
        <span>shield</span>
        <input
          type="range"
          min={0}
          max={50}
          value={shield}
          onChange={(e) => setShield(parseInt(e.target.value))}
        />
        <span>{shield}</span>
        <br></br>
        <span>percent</span>
        <input
          type="range"
          min={0}
          max={100}
          value={percent}
          onChange={(e) => setPercent(parseInt(e.target.value))}
        />
        <span>{percent}</span>
      </div>
    </Modal>
  );
};
