import { useTranslation } from "react-i18next";
import { Game } from "../Game/game";
import { useGameSelector } from "../store/gameRedux";
import { HasTooltip, Tooltip } from "../Tooltip/Tooltip";
import { Music3Icon } from "../icons";

const selectMusicalNotes = (g: Game): number => g.resources.musicalNotes;
const selectMusicalPower = (g: Game): number => g.powers.musicalStrength;

export const MusicNotesHeader = (): React.ReactElement => {
  const { t } = useTranslation();
  const musicalNotes = useGameSelector(selectMusicalNotes);
  const musicalPower = useGameSelector(selectMusicalPower);
  return (
    <>
      <span className="mx-2">{musicalNotes}</span>
      <HasTooltip>
        <Music3Icon style={{ height: "24px", width: "24px" }} />
        <Tooltip>
          {t("resources.actionSpeed", {
            amount: ((musicalPower - 1) * 100).toFixed(0),
          })}
        </Tooltip>
      </HasTooltip>
    </>
  );
};
