import { useState } from "react";
import { game } from "../Game/game";
import { Modal } from "../Modal/Modal";
import { Realm } from "../Realm/Realm";
import { loadRealm } from "../Realm/Realms";
import { useAppDispatch } from "../store/hooks";
import { changePage, Page } from "../store/sidebar";
import classes from "./RealmNode.module.css";
import { useTranslation } from "react-i18next";

const getAvailability = (realm: Realm): [string, boolean] => {
  if (game.completedRealms.includes(realm.id))
    return [classes.completedRealm, true];
  if (!realm.parent || game.completedRealms.includes(realm.parent))
    return [classes.availableRealm, true];
  return [classes.lockedRealm, false];
};

type RealmNodeProps = {
  realm: Realm;
};

export const RealmNode = ({ realm }: RealmNodeProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [cssClass, available] = getAvailability(realm);
  const onClick = (): void => {
    setOpen(true);
  };

  const onEnter = (): void => {
    loadRealm(realm);
    dispatch(changePage(Page.WORLD));
  };
  return (
    <>
      <span onClick={onClick} className={`cursor-pointer ${cssClass}`}>
        ●
      </span>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col" style={{ maxWidth: "400px" }}>
          <p>{t(`yggdrasil.realm.${realm.id}.title`)}</p>
          {realm.goals.length > 0 && (
            <ul>
              {realm.goals.map((g, i) => (
                <li key={i}>· {t(...g.i18nArgs)}</li>
              ))}
            </ul>
          )}
          <p>{t(`yggdrasil.realm.${realm.id}.instructions`)}</p>
          {available && (
            <button className={"btn"} onClick={onEnter}>
              {t("yggdrasil.enter")}
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};
