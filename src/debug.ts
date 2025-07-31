import { game } from "./Game/game";
import { parseMap, Realms } from "./Realm/Realms";
import { changePage, Page } from "./store/sidebar";
import { store } from "./store/store";

export const GLOBAL_SPEED_UP = ((): number => {
  const f = parseFloat(localStorage.getItem("GLOBAL_SPEED_UP") ?? "1");
  if (isNaN(f)) return 1;
  if (f < 0) return 1;
  return f;
})();

((): void => {
  setTimeout(() => {
    const autoRealm = localStorage.getItem("AUTO_LOAD_REALM");
    if (!autoRealm) return;
    const realm = Realms.get(autoRealm);
    if (!realm) {
      console.error(
        `Trying to auto load realm ${autoRealm} but it doesn't exists.`
      );
      return;
    }
    game.loadMap(realm, parseMap(realm.mapData));
    store.dispatch(changePage(Page.WORLD));
  }, 1000);
})();
