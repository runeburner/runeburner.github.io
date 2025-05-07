import Markdown from "react-markdown";
import { Content } from "../Content";
import classes from "./Documentation.module.css";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store/hooks";
import { Topic, topicTree } from "../Topic";
import { setBreadcrumbs } from "../../store/manual";

type DocumentationProps = {
  page: string;
};

const recursiveFindBreadcrumbs = (
  tree: Topic | null,
  page: string
): string[] | undefined => {
  if (tree === null) return undefined;
  const keys = Object.keys(tree);
  if (keys.includes(page)) return [page];
  for (const key of keys) {
    const breadcrumbs = recursiveFindBreadcrumbs(tree[key], page);
    if (!breadcrumbs) continue;
    breadcrumbs.unshift(key);
    return breadcrumbs;
  }
  return undefined;
};

const ALink = ({
  href,
  children,
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>): React.ReactElement => {
  const dispatch = useAppDispatch();
  const onClick = (): void => {
    if (!href) return;
    const breadcrumbs = recursiveFindBreadcrumbs(topicTree, href) ?? [];
    dispatch(setBreadcrumbs(breadcrumbs));
  };
  return <span onClick={onClick}>{children}</span>;
};

export const Documentation = ({
  page,
}: DocumentationProps): React.ReactElement => {
  const { i18n } = useTranslation();
  return (
    <div className={classes.documentation}>
      <Markdown
        components={{
          a: ALink,
        }}
      >
        {Content[i18n.language]?.[page] ?? ""}
      </Markdown>
    </div>
  );
};
