import { useTranslation } from "react-i18next";
import { game, Game } from "../../Game/game";
import { useGameSelector } from "../../store/gameRedux";
import classes from "./Goal.module.css";
import { Realms } from "../../Realm/Realms";
import { HelpIcon } from "../../icons";
import { Modal } from "../../Modal/Modal";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { changePage, Page } from "../../store/sidebar";

const selectRealmCompleted = (g: Game): boolean => g.realmCompleted;
const selectRealmId = (g: Game): string => g.realmId;

export const Goal = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const realmId = useGameSelector(selectRealmId);
  const realmCompleted = useGameSelector(selectRealmCompleted);
  const realm = Realms.get(realmId);
  const { t } = useTranslation();
  const [helpOpen, setHelpOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  if (realm === undefined) return <></>;
  const onComplete = (): void => {
    game.completeRealm(realm);
    dispatch(changePage(Page.YGGDRASIL));
  };
  return (
    <div className={"m-4 p-2 fixed flex flex-col " + classes.container}>
      <div className="flex">
        {t(`yggdrasil.realm.${realmId}.title`)}&nbsp;
        <HelpIcon
          onClick={() => setHelpOpen(true)}
          className="cursor-pointer"
          style={{ width: "1em" }}
        />
      </div>
      {(realm.goals.length ?? 0) > 0 && (
        <ul>
          {realm.goals.map((g, i) => (
            <li key={i}>· {t(...g.i18nArgs)}</li>
          ))}
        </ul>
      )}
      {realmCompleted && (
        <button className="btn" onClick={() => setRewardOpen(true)}>
          {t("world.complete")}
        </button>
      )}
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)}>
        <div className="flex flex-col" style={{ maxWidth: "400px" }}>
          <p>{t(`yggdrasil.realm.${realm.id}.instructions`)}</p>
        </div>
      </Modal>
      <Modal open={rewardOpen} onClose={() => setRewardOpen(false)}>
        <div className="flex flex-col" style={{ maxWidth: "400px" }}>
          <p>{t("rewards.youAcquired")}:</p>
          <ul>
            {realm.rewards.map((r, i) => (
              <li key={i}>{t(...r.i18nArgs)}</li>
            ))}
          </ul>
          <button className="btn" onClick={onComplete}>
            {t("world.complete")}
          </button>
        </div>
      </Modal>
    </div>
  );
};
