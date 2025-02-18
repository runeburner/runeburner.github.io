import { Page as PageEnum, useIsPageSelected } from "../store/sidebar";

type PageProps = React.PropsWithChildren<{
  page: PageEnum;
}>;

export const Page = ({ page, children }: PageProps): React.ReactElement => {
  const is = useIsPageSelected(page);
  if (!is) return <></>;
  return <>{children}</>;
};
