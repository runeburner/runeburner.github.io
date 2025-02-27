import { useTranslation } from "react-i18next";
import { useIncantationNames } from "../../store/incantations";
import { Row } from "./Row/Row";

export const List = (): React.ReactElement => {
  const { t } = useTranslation();
  const names = useIncantationNames();

  return (
    <table>
      <thead>
        <tr>
          <th>{t("incantation_page.incantation_name")}</th>
          <th>{t("incantation_page.rename")}</th>
          <th>{t("incantation_page.edit")}</th>
          <th>{t("incantation_page.delete")}</th>
        </tr>
      </thead>
      <tbody>
        {names.map((n) => (
          <Row key={n} name={n} />
        ))}
      </tbody>
    </table>
  );
};
