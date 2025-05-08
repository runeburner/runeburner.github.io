import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectBreadcrumbs, setBreadcrumbs } from "../../store/manual";
import { useTranslation } from "react-i18next";
import classes from "./Breadcrumbs.module.css";

type RecursiveBreadCrumbProps = {
  breadcrumbs: string[];
  index: number;
};

const RecursiveBreadCrumb = ({
  breadcrumbs,
  index,
}: RecursiveBreadCrumbProps): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  if (breadcrumbs.length === 0) return <></>;
  return (
    <>
      {" > "}
      <span
        className={`cursor-pointer ${classes.breadcrumb}`}
        onClick={() =>
          dispatch(setBreadcrumbs(breadcrumbs.slice(0, index + 1)))
        }
      >
        {t(`manual.${breadcrumbs[index]}`)}
      </span>
      {index + 1 < breadcrumbs.length ? (
        <>
          <RecursiveBreadCrumb breadcrumbs={breadcrumbs} index={index + 1} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export const Breadcrumbs = (): React.ReactElement => {
  const { t } = useTranslation();
  const breadcrumbs = useAppSelector(selectBreadcrumbs);
  const dispatch = useAppDispatch();

  return (
    <h1>
      <span
        className={`cursor-pointer ${classes.breadcrumb}`}
        onClick={() => dispatch(setBreadcrumbs([]))}
      >
        {t("manual.root")}
      </span>
      <RecursiveBreadCrumb breadcrumbs={breadcrumbs} index={0} />
    </h1>
  );
};
