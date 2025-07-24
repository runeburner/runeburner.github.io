import { game } from "../Game/game";
import { Realm } from "../Realm/Realm";
import { loadRealm } from "../Realm/Realms";
import { useAppDispatch } from "../store/hooks";
import { changePage, Page } from "../store/sidebar";
import classes from "./RealmNode.module.css";

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
  const dispatch = useAppDispatch();
  const [cssClass, available] = getAvailability(realm);
  const onClick = (): void => {
    loadRealm(realm);
    dispatch(changePage(Page.WORLD));
  };
  return (
    <span
      onClick={onClick}
      className={`${available ? "cursor-pointer" : ""} ${cssClass}`}
    >
      ●
    </span>
  );
};
