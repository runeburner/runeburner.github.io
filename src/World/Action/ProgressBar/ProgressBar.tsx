import { useActionProgress, useActionProgressPos } from "../Progress";

type ProgressBarProps = {
  id: number;
  color: string;
  min: Vec;
};

export const ProgressBar = ({
  id,
  min,
  color,
}: ProgressBarProps): React.ReactElement => {
  const v = useActionProgress(id);
  const p = useActionProgressPos(id);
  return (
    <path
      stroke={color}
      strokeWidth={8}
      d={`M ${(p[0] - min[0]) * 64},${(p[1] - min[1]) * 64 + 60} ${
        (p[0] - min[0]) * 64 + 64 * (v[0] / v[1])
      },${(p[1] - min[1]) * 64 + 60}`}
    />
  );
};
