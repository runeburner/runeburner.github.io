import classes from "./Tooltip.module.css";

type TooltipProps = React.PropsWithChildren<object>;

export const Tooltip = ({ children }: TooltipProps): React.ReactElement => {
  return <span className={classes.tooltip + " p-2"}>{children}</span>;
};

type HasTooltipProps = React.PropsWithChildren<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >
>;

export const HasTooltip = (props: HasTooltipProps): React.ReactElement => {
  return (
    <span
      className={classes.hasTooltip + " " + props.className}
      style={props.style}
    >
      {props.children}
    </span>
  );
};
