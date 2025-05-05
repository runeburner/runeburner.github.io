import { useAppSelector } from "../store/hooks";
import { selectBreadcrumbs } from "../store/manual";
import { useTranslation } from "react-i18next";

export const Breadcrumbs = (): React.ReactElement => {
  const { t } = useTranslation();
  const breadcrumbs = useAppSelector(selectBreadcrumbs);

  const topics = breadcrumbs.map((b) => t("manual." + b));

  return <h1>{"> " + topics.join(" > ")}</h1>;
};
