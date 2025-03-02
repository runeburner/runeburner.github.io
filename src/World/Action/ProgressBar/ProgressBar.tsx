import { Vec } from "../../../types/vec";

type ProgressBarProps = {
  pos: Vec;
  progress: Vec;
  color: string;
};

export const ProgressBar = ({
  pos,
  progress,
  color,
}: ProgressBarProps): React.ReactElement => {
  return (
    <path
      stroke={color}
      strokeWidth={8}
      d={`M ${pos[0] * 64},${pos[1] * 64 + 60} ${
        pos[0] * 64 + 64 * (progress[0] / progress[1])
      },${pos[1] * 64 + 60}`}
    />
  );
};
