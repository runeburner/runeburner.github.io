import { MINEProgress } from "../../../types/ACT";
import { ProgressBar } from "../ProgressBar/ProgressBar";

type MineActionProps = {
  action: MINEProgress;
};

export const MineAction = ({ action }: MineActionProps): React.ReactElement => {
  const x = Math.min(action.pos[0], action.tile[0]);
  const y = Math.min(action.pos[1], action.tile[1]);
  const X = Math.max(action.pos[0], action.tile[0]);
  const Y = Math.max(action.pos[1], action.tile[1]);
  return (
    <svg
      className={"flex-center absolute"}
      width={(X - x + 1) * 64}
      height={(Y - y + 1) * 64}
      style={{ top: y * 64, left: x * 64 }}
      fill={"#0000ff44"}
    >
      <path
        stroke={"#0000ff44"}
        strokeWidth={4}
        d={`M${32},${32} ${(X - x) * 64 + 32},${(Y - y) * 64 + 32}`}
      />
      <ProgressBar
        pos={[action.pos[0] - x, action.pos[1] - y]}
        progress={action.progress}
        color={"#0000ff44"}
      />
    </svg>
  );
  return <></>;
};
