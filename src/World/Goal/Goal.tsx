import { useTranslation } from "react-i18next";
import { game, Game } from "../../Game/game";
import { useGameSelector } from "../../store/gameRedux";
import classes from "./Goal.module.css";
import { Realms } from "../../Realm/Realms";

const selectRealmCompleted = (g: Game): boolean => g.realmCompleted;
const selectRealmId = (g: Game): string => g.realmId;

export const Goal = (): React.ReactElement => {
  const realmId = useGameSelector(selectRealmId);
  const realmCompleted = useGameSelector(selectRealmCompleted);
  const realm = Realms.get(realmId);
  const { t } = useTranslation();
  const onComplete = (): void => {
    game.completeRealm(realmId);
  };
  return (
    <div className={"m-4 p-2 fixed flex flex-col " + classes.container}>
      {t(`yggdrasil.realm.${realmId}`)}
      {realm?.goals.map((g, i) => (
        <p key={i}>{t(...g.i18nArgs)}</p>
      ))}
      {realmCompleted && (
        <button className="btn" onClick={onComplete}>
          {t("world.complete")}
        </button>
      )}
    </div>
  );
};
