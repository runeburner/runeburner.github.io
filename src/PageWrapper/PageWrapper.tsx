import { Page, useIsPageSelected } from "../store/sidebar";

type PageProps = React.PropsWithChildren<{
  page: Page;
}>;

export const PageWrapper = ({
  page,
  children,
}: PageProps): React.ReactElement => {
  const is = useIsPageSelected(page);
  if (!is) return <></>;
  return <>{children}</>;
};
