import classes from "./AttuneAction.module.css";
import { AttuneAction as AttuneActionT } from "../../../types/actions";

type AttuneActionProps = {
  action: AttuneActionT;
};

export const AttuneAction = ({
  action,
}: AttuneActionProps): React.ReactElement => {
  const x = Math.min(action.pos[0], action.heartPos[0]);
  const y = Math.min(action.pos[1], action.heartPos[1]);
  const X = Math.max(action.pos[0], action.heartPos[0]);
  const Y = Math.max(action.pos[1], action.heartPos[1]);
  return (
    <svg
      className={"flex-center " + classes.container}
      width={(X - x + 1) * 64}
      height={(Y - y + 1) * 64}
      style={{ top: y * 64, left: x * 64 }}
      fill={"#44000044"}
    >
      <path
        stroke={"#44000044"}
        strokeWidth={4}
        d={`M${32},${32} ${(X - x) * 64 + 32},${(Y - y) * 64 + 32}`}
      />
      <path
        stroke={"#44000044"}
        strokeWidth={8}
        d={`M ${(action.pos[0] - x) * 64},${(action.pos[1] - y) * 64 + 60} ${
          (action.pos[0] - x) * 64 +
          64 * (action.progress[0] / action.progress[1])
        },${(action.pos[1] - y) * 64 + 60}`}
      />
    </svg>
  );
  return <></>;
};
