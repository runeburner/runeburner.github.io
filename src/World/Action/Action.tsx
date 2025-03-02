import { MoveAction } from "./MoveAction/MoveAction";
import { MineAction } from "./MineAction/MineAction";
import { AttuneAction } from "./AttuneAction/AttuneAction";
import {
  ACTProgress,
  ACTType,
  ATTUNEProgress,
  MINEProgress,
  MOVEProgress,
} from "../../types/ACT";

type ActionProps = {
  p: ACTProgress;
};

export const Action = ({ p }: ActionProps): React.ReactElement => {
  if (!p) return <></>;
  switch (p.type) {
    case ACTType.MOVE:
      return <MoveAction action={p as MOVEProgress} />;
    case ACTType.MINE:
      return <MineAction action={p as MINEProgress} />;
    case ACTType.ATTUNE:
      return <AttuneAction action={p as ATTUNEProgress} />;
    default:
      return <></>;
  }
};
