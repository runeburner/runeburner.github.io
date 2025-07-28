import { useState } from "react";
import { EhwazIcon, OthalanIcon, TiwazIcon } from "../../icons";
import { Modal, ModalProps } from "../../Modal/Modal";
import { RuneSlider } from "./RuneSlider/RuneSlider";
import { Rune, RuneWeight } from "../../types/rune";
import { store } from "../../store/store";
import { Trans, useTranslation } from "react-i18next";
import { useIncantationNames } from "../../store/incantations";
import { game } from "../../Game/game";
import { EldritchRune } from "../../types/eldritchRunes";

const maxRunes = 12;

export const AddGolemModal = ({
  open,
  onClose,
}: ModalProps): React.ReactElement => {
  const { t } = useTranslation();
  const [runes, setRunes] = useState<Record<Rune, number>>(
    Object.fromEntries(Object.values(Rune).map((r) => [r, 0])) as Record<
      Rune,
      number
    >
  );
  const incantationNames = useIncantationNames();
  const [selectedIncantation, setSelectedIncantation] = useState(
    incantationNames[0]
  );

  const [selectedEldritchRune, setSelectedEldritchRune] = useState<
    EldritchRune | undefined
  >(
    game.eldritchRunesUnlocked.length > 0
      ? game.eldritchRunesUnlocked[0]
      : undefined
  );

  const appliedRunes = Object.entries(runes).filter((r) => r[1] > 0) as [
    Rune,
    number
  ][];
  const totalRunes = appliedRunes.reduce((acc, c) => acc + c[1], 0);
  const disabled = totalRunes >= maxRunes;
  const weight = appliedRunes.reduce(
    (w, [rune, amt]) => w + RuneWeight[rune as Rune] * amt,
    1
  );

  const onAnimate = (): void => {
    game.animate(
      runes,
      store.getState().incantations[selectedIncantation],
      selectedEldritchRune
    );
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
        <p>
          <Trans
            i18nKey="create_golem_modal.wind_description"
            values={{
              speed: (
                (runes[Rune.WIND] * game.powers.movePerRune) /
                weight
              ).toFixed(2),
            }}
          />
        </p>
        <RuneSlider
          onUpdate={setRunes}
          rune={Rune.LABOR}
          icon={TiwazIcon}
          amount={runes[Rune.LABOR]}
          disabled={disabled}
        />
        <p>
          <Trans
            i18nKey="create_golem_modal.labor_description"
            values={{
              speed: runes[Rune.LABOR] * game.powers.workPerRune,
            }}
          />
        </p>
        <RuneSlider
          onUpdate={setRunes}
          rune={Rune.VOID}
          icon={OthalanIcon}
          amount={runes[Rune.VOID]}
          disabled={disabled}
        />
        <p>
          <Trans
            i18nKey="create_golem_modal.void_description"
            values={{
              cap: runes[Rune.VOID] * game.powers.capacityPerRune,
            }}
          />
        </p>
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
        {game.eldritchRunesUnlocked.length > 0 && (
          <>
            {t("create_golem_modal.eldritchRune")}:{" "}
            <select
              value={selectedEldritchRune}
              onChange={(e) =>
                setSelectedEldritchRune(e.target.value as EldritchRune)
              }
            >
              {game.eldritchRunesUnlocked.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </>
        )}
        <button
          disabled={totalRunes === 0}
          className="btn w-full my-2"
          onClick={onAnimate}
        >
          {t("create_golem_modal.animate")}
        </button>
      </div>
    </Modal>
  );
};
