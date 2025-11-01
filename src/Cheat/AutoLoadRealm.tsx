import { ChangeEvent, useState } from "react";
import { Realms } from "../Realm/Realms";
import { useTranslation } from "react-i18next";
import { AUTO_LOAD_REALM_KEY } from "../debug";

export const AutoLoadRealm = (): React.ReactElement => {
  const { t } = useTranslation();
  const [autoLoadRealm, setAutoLoadRealm] = useState(
    localStorage.getItem(AUTO_LOAD_REALM_KEY) ?? ""
  );

  const onAutoLoadRealmChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
    setAutoLoadRealm(ev.target.value);
    localStorage.setItem(AUTO_LOAD_REALM_KEY, ev.target.value);
  };

  return (
    <tr>
      <td>
        <p>{t("cheat." + AUTO_LOAD_REALM_KEY)}</p>
      </td>
      <td>
        <select
          className="select"
          value={autoLoadRealm}
          onChange={onAutoLoadRealmChange}
        >
          <option key={"---"} value={""}>
            ---
          </option>
          {Array.from(
            Realms.entries().map((r) => (
              <option key={r[0]} value={r[0]}>
                {r[0]}
              </option>
            ))
          )}
        </select>
      </td>
    </tr>
  );
};
