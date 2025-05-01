import { useAppSelector } from "../store/hooks";
import { selectBreadcrumbs } from "../store/manual";
import { useTranslation } from "react-i18next";

export const Breadcrumbs = (): React.ReactElement => {
  const { t } = useTranslation();
  const breadcrumbs = useAppSelector(selectBreadcrumbs);

  const [topics] = breadcrumbs.reduce(
    (previous, current): [string[], string] => {
      const subtopic = previous[1] + "." + current;
      previous[0].push(t(subtopic + ".title"));
      return [previous[0], subtopic];
    },
    [[] as string[], "help"] as [string[], string]
  );

  return <h1>{"> " + topics.join(" > ")}</h1>;
};
