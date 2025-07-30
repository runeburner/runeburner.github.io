import { useCallback } from "react";
import { useAppSelector } from "../store/hooks";
import { Page } from "../store/sidebar";
import { RootState } from "../store/store";

type PageProps = React.PropsWithChildren<{
  page: Page;
}>;

export const PageWrapper = ({
  page,
  children,
}: PageProps): React.ReactElement => {
  const is = useAppSelector(
    useCallback((s: RootState) => s.sidebar.selected === page, [page])
  );
  if (!is) return <></>;
  return <>{children}</>;
};
