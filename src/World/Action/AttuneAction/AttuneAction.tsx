import { ATTUNEProgress } from "../../../types/ACT";
import { ProgressBar } from "../ProgressBar/ProgressBar";

type AttuneActionProps = {
  action: ATTUNEProgress;
};

export const AttuneAction = ({
  action,
}: AttuneActionProps): React.ReactElement => {
  const x = Math.min(action.pos[0], action.heart[0]);
  const y = Math.min(action.pos[1], action.heart[1]);
  const X = Math.max(action.pos[0], action.heart[0]);
  const Y = Math.max(action.pos[1], action.heart[1]);
  return (
    <svg
      className={"flex-center absolute"}
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
      <ProgressBar
        pos={[action.pos[0] - x, action.pos[1] - y]}
        progress={action.progress}
        color={"#44000044"}
      />
    </svg>
  );
  return <></>;
};
