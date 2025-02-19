import { useState } from "react";
import { BoxIcon, FeatherIcon, SettingsIcon } from "../../icons";
import { Modal, ModalProps } from "../../Modal/Modal";
import { RuneSlider } from "./RuneSlider/RuneSlider";
import { Rune, Runes } from "../../Game/runes";
import { Golem } from "../Golem/Golem";

export const AddGolemModal = ({ open, onClose }: ModalProps) => {
  const [runes, setRunes] = useState<Record<Rune, number>>(
    Object.fromEntries(Object.values(Runes).map((r) => [r, 0])) as Record<
      Rune,
      number
    >
  );

  const appliedRunes: [Rune, number][] = Object.entries(runes).filter(
    (r) => r[1] > 0
  ) as [Rune, number][];
  const totalRunes = appliedRunes.reduce((acc, c) => acc + c[1], 0);

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <Golem runes={appliedRunes} />
        <p>Runes: {totalRunes}/6</p>
        <p>Rune Types: {appliedRunes.length}/3</p>
        <RuneSlider
          onUpdate={setRunes}
          rune={Runes.WIND}
          icon={FeatherIcon}
          amount={runes[Runes.WIND]}
        />
        <RuneSlider
          onUpdate={setRunes}
          rune={Runes.LABOR}
          icon={SettingsIcon}
          amount={runes[Runes.LABOR]}
        />
        <RuneSlider
          onUpdate={setRunes}
          rune={Runes.VOID}
          icon={BoxIcon}
          amount={runes[Runes.VOID]}
        />
      </div>
    </Modal>
  );
};
