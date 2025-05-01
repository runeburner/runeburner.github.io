import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../store/hooks";
import { appendBreadcrumbs } from "../store/manual";

type LineProps = {
  path: string;
  topic: string;
  hasMore: boolean;
};

export const Line = ({
  path,
  topic,
  hasMore,
}: LineProps): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const str = t(path + (hasMore ? ".title" : ""));

  const onClick = (): void => {
    dispatch(appendBreadcrumbs(topic));
  };
  return (
    <li onClick={onClick}>
      <h3 className="cursor-pointer">{str}</h3>
    </li>
  );
};
