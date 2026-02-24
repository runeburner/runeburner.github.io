import { useTranslation } from "react-i18next";
import { Game } from "../Game/game";
import { useGameSelector } from "../store/gameRedux";
import { HasTooltip, Tooltip } from "../Tooltip/Tooltip";
import { LeafIcon } from "../icons";

const selectLeaves = (g: Game): number => g.resources.leafs;
const selectLeafPower = (g: Game): number => g.powers.leafPower;

export const LeafHeader = (): React.ReactElement => {
  const { t } = useTranslation();
  const leaves = useGameSelector(selectLeaves);
  const leafPower = useGameSelector(selectLeafPower);

  return (
    <>
      <span className="mx-2">{leaves}</span>
      <HasTooltip>
        <LeafIcon style={{ height: "24px", width: "24px" }} />
        <Tooltip>
          {t("resources.actionSpeed", {
            amount: ((leafPower - 1) * 100).toFixed(0),
          })}
        </Tooltip>
      </HasTooltip>
    </>
  );
};
