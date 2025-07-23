import classes from "./Tooltip.module.css";

type TooltipProps = React.PropsWithChildren<object>;

export const Tooltip = ({ children }: TooltipProps): React.ReactElement => {
  return <span className={classes.tooltip}>{children}</span>;
};

type HasTooltipProps = React.PropsWithChildren<object>;

export const HasTooltip = ({
  children,
}: HasTooltipProps): React.ReactElement => {
  return <div className={classes.hasTooltip}>{children}</div>;
};
