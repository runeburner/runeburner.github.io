import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hooks";
import { selectBreadcrumbs } from "../store/manual";
import { Breadcrumbs } from "./Breadcrumbs";
import { Line } from "./Line";
import { getTopic } from "./Topic";
import Markdown from "react-markdown";

export const HelpPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const breadcrumbs = useAppSelector(selectBreadcrumbs);

  const topic = getTopic(breadcrumbs);

  const prefix =
    "help" + (breadcrumbs.length > 0 ? "." + breadcrumbs.join(".") : "") + ".";
  return (
    <div className="m-4 flex flex-col flex-wrap">
      <Breadcrumbs />
      {topic !== null ? (
        <ul className="p-3">
          {Object.keys(topic).map((subtopic) => (
            <Line
              key={subtopic}
              path={prefix + subtopic}
              topic={subtopic}
              hasMore={typeof topic[subtopic] === "object"}
            />
          ))}
        </ul>
      ) : (
        <Markdown>{t(prefix + "content")}</Markdown>
      )}
    </div>
  );
};
