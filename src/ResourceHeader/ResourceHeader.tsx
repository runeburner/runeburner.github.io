import { useTranslation } from "react-i18next";
import { Game } from "../Game/game";
import { LeafIcon, Music3Icon, HeartIcon } from "../icons";
import { useGameSelector } from "../store/gameRedux";
import { HasTooltip, Tooltip } from "../Tooltip/Tooltip";
import classes from "./ResourceHeader.module.css";

const selectMusicalNotes = (g: Game): number => g.resources.musicalNotes;
const selectLeaves = (g: Game): number => g.resources.leafs;
const selectMusicalPower = (g: Game): number => g.powers.musicalStrength;
const selectLeafPower = (g: Game): number => g.powers.leafPower;
const selectLivesLeft = (g: Game): number => g.livesLeft;

export const ResourceHeader = (): React.ReactElement => {
  const { t } = useTranslation();
  const musicalNotes = useGameSelector(selectMusicalNotes);
  const leaves = useGameSelector(selectLeaves);
  const musicalPower = useGameSelector(selectMusicalPower);
  const leafPower = useGameSelector(selectLeafPower);
  const liveLeft = useGameSelector(selectLivesLeft);
  return (
    <div className={"py-2 flex-center w-full " + classes.container}>
      <span className="mx-2">{musicalNotes}</span>
      <HasTooltip>
        <Music3Icon style={{ height: "24px", width: "24px" }} />
        <Tooltip>
          {t("resources.actionSpeed", {
            amount: ((musicalPower - 1) * 100).toFixed(0),
          })}
        </Tooltip>
      </HasTooltip>
      <span className="mx-2">{leaves}</span>
      <HasTooltip>
        <LeafIcon style={{ height: "24px", width: "24px" }} />
        <Tooltip>
          {t("resources.actionSpeed", {
            amount: ((leafPower - 1) * 100).toFixed(0),
          })}
        </Tooltip>
      </HasTooltip>
      <span className="mx-2">{liveLeft}</span>
      <HeartIcon style={{ height: "24px", width: "24px" }} />
    </div>
  );
};
