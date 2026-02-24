import { useCallback } from "react";
import classes from "./Node.module.css";
import { NodeStatus } from "./NodeStatus";
import { runGameSelectors, useGameSelector } from "../../store/gameRedux";
import { game, Game } from "../../Game/game";
import { Melody } from "../../Game/Melodies/Melodies";
import { useTranslation } from "react-i18next";
import { HasTooltip, Tooltip } from "../../Tooltip/Tooltip";

const statusContainerClasses: Record<string, string> = {
  PURCHASED: classes.purchasedContainer,
  AVAILABLE: classes.availableContainer,
  UNLOCKED: classes.unlockedContainer,
  LOCKED: classes.lockedContainer,
};

const statusIconClasses: Record<string, string> = {
  PURCHASED: classes.purchasedIcon,
  AVAILABLE: classes.availableIcon,
  UNLOCKED: classes.unlockedIcon,
  LOCKED: classes.lockedIcon,
};

type NodeProps = {
  melody: Melody;
};

export const Node = ({ melody }: NodeProps): React.ReactElement => {
  const { t } = useTranslation();
  const status = useGameSelector(
    useCallback(
      (g: Game) => {
        const isBought = g.melodies[melody.id];
        const hasPrerequisite = g.melodies[melody.require ?? ""] ?? false;
        const hasChoords = g.choords > 0;
        return isBought
          ? NodeStatus.PURCHASED
          : hasChoords && hasPrerequisite
            ? NodeStatus.AVAILABLE
            : NodeStatus.LOCKED;
      },
      [melody],
    ),
  );

  const { x, y } = melody;
  const { icon } = melody;

  const Icon = icon;

  const onClick = (): void => {
    game.unlockMelody(melody.id);
    runGameSelectors();
  };
  return (
    <HasTooltip className="absolute" style={{ left: x, top: y }}>
      <div
        onClick={onClick}
        className={
          "p-4 select-none " +
          classes.node +
          " " +
          statusContainerClasses[status]
        }
      >
        <Icon className={statusIconClasses[status]} />
        <Tooltip>
          <span style={{ fontSize: "2em" }}>
            {t(`melodies.${melody.localeId}.title`)}
          </span>
          <br />
          <span>{t(`melodies.${melody.localeId}.description`)}</span>
        </Tooltip>
      </div>
    </HasTooltip>
  );
};
