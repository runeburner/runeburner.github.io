import { MOVEProgress } from "../../../types/ACT";
import { ProgressBar } from "../ProgressBar/ProgressBar";

type MoveActionProps = {
  action: MOVEProgress;
};

export const MoveAction = ({ action }: MoveActionProps): React.ReactElement => {
  const p = action.path;
  let x = 1e99;
  let X = -1;
  let y = 1e99;
  let Y = -1;
  for (const point of p) {
    if (point[0] < x) x = point[0];
    if (point[1] < y) y = point[1];
    if (X < point[0]) X = point[0];
    if (Y < point[1]) Y = point[1];
  }

  let svgPath = "M";
  const parts: JSX.Element[] = [];
  for (let i = 0; i < p.length; i++) {
    svgPath += ` ${(p[i][0] - x) * 64 + 32},${(p[i][1] - y) * 64 + 32}`;
    parts.push(
      <circle
        key={i}
        cx={(p[i][0] - x) * 64 + 32}
        cy={(p[i][1] - y) * 64 + 32}
        r={8}
      />
    );
  }
  parts.push(
    <path
      key={"path"}
      fill="none"
      stroke={"#00ff0044"}
      strokeWidth={4}
      d={svgPath}
    />
  );
  return (
    <svg
      className={"flex-center absolute"}
      width={(X - x + 1) * 64}
      height={(Y - y + 1) * 64}
      style={{ top: y * 64, left: x * 64 }}
      fill={"#00ff0044"}
    >
      {parts}
      <ProgressBar
        pos={[p[0][0] - x, p[0][1] - y]}
        progress={action.progress}
        color={"#00ff0044"}
      />
    </svg>
  );
};
