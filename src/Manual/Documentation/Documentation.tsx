import Markdown from "react-markdown";
import { Content } from "../Content";
import classes from "./Documentation.module.css";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store/hooks";
import { Topic, topicTree } from "../Topic";
import { setBreadcrumbs } from "../../store/manual";
import { HasTooltip, Tooltip } from "../../Tooltip/Tooltip";
import { Fragment } from "react/jsx-runtime";

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

type TooltipPreviewProps = {
  page: string;
};

const previewSize = 128;

const TooltipPreview = ({ page }: TooltipPreviewProps): React.ReactElement => {
  const { i18n } = useTranslation();
  const contentLong = Content[i18n.language]?.[page] ?? "";
  const firstLine = contentLong.indexOf("\n");
  const content =
    contentLong.slice(firstLine, firstLine + previewSize) +
    (contentLong.length > firstLine + previewSize ? "..." : "");
  return (
    <Tooltip>
      <Markdown components={{ a: "span", p: "span" }}>{content}</Markdown>
    </Tooltip>
  );
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

  return href ? (
    <HasTooltip>
      <span className={classes.link} onClick={onClick}>
        {children}
      </span>
      <TooltipPreview page={href} />
    </HasTooltip>
  ) : (
    <span className={classes.link} onClick={onClick}>
      {children}
    </span>
  );
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
