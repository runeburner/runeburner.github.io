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

const selectCanBuy = (g: Game): boolean => g.choords > 0;

export const Node = ({ melody }: NodeProps): React.ReactElement => {
  const { t } = useTranslation();
  const isBought = useGameSelector(
    useCallback((g: Game) => g.melodies[melody.id], [melody])
  );
  const hasPrerequisite = useGameSelector(
    useCallback(
      (g: Game) => g.melodies[melody.require ?? ""] ?? false,
      [melody]
    )
  );
  const hasChoords = useGameSelector(selectCanBuy);
  const { x, y } = melody;
  const { icon } = melody;

  const status = isBought
    ? NodeStatus.PURCHASED
    : hasChoords && hasPrerequisite
    ? NodeStatus.AVAILABLE
    : NodeStatus.LOCKED;
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
            {t(`melodies.${melody.id}.title`)}
          </span>
          <br />
          <span>{t(`melodies.${melody.id}.description`)}</span>
        </Tooltip>
      </div>
    </HasTooltip>
  );
};
