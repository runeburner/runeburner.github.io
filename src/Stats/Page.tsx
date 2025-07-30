import { useTranslation } from "react-i18next";
import { arrayShallowEquals, useGameSelector } from "../store/gameRedux";
import { Game } from "../Game/game";
import { leafPower } from "../Game/formulas";
import { EldritchRune, EldritchRunesI18N } from "../types/eldritchRunes";

const selectEldritchRunes = (g: Game): EldritchRune[] =>
  g.eldritchRunesUnlocked;
const selectLeaves = (g: Game): number => g.resources.leafs;

export const StatsPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const leaves = useGameSelector(selectLeaves);
  const eldritchRunes = useGameSelector(
    selectEldritchRunes,
    arrayShallowEquals
  );
  return (
    <div className="m-4">
      <p className="mb-2">
        {t("stats.yggdrasilLeaves", {
          leaves: leaves,
          speed: ((leafPower(leaves) - 1) * 100).toFixed(0),
        })}
      </p>
      {eldritchRunes.length > 0 && (
        <>
          <span>{t("stats.eldritchRunes")}</span>
          <ul>
            {eldritchRunes.map((e, i) => (
              <li className="ml-2" key={i}>
                <p>· {t(`eldritchRunes.${e}.title`)}</p>
                <p>
                  {t(`eldritchRunes.${e}.description`, EldritchRunesI18N[e])}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
