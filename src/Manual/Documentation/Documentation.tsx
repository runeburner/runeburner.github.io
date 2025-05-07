import Markdown from "react-markdown";
import { Content } from "../Content";
import classes from "./Documentation.module.css";
import { useTranslation } from "react-i18next";

type DocumentationProps = {
  page: string;
};

export const Documentation = ({
  page,
}: DocumentationProps): React.ReactElement => {
  const { i18n } = useTranslation();
  return (
    <div className={classes.documentation}>
      <Markdown>{Content[i18n.language]?.[page] ?? ""}</Markdown>
    </div>
  );
};
