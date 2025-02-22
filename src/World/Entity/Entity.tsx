import classes from "./Entity.module.css";

type EntityProps = React.PropsWithChildren<{
  x: number;
  y: number;
}>;

export const EntityTile = ({
  x,
  y,
  children,
}: EntityProps): React.ReactElement => {
  return (
    <div
      className={classes.container}
      style={{
        top: y * 64,
        left: x * 64,
      }}
    >
      {children}
    </div>
  );
};
