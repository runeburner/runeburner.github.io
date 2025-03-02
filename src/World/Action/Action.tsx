import { MoveAction } from "./MoveAction/MoveAction";
import { MineAction } from "./MineAction/MineAction";
import { AttuneAction } from "./AttuneAction/AttuneAction";
import {
  ActionProgress,
  ActionType,
  ATTUNEProgress,
  MINEProgress,
  MOVEProgress,
} from "../../types/actions";

type ActionProps = {
  p: ActionProgress;
};

export const Action = ({ p }: ActionProps): React.ReactElement => {
  if (!p) return <></>;
  switch (p.type) {
    case ActionType.MOVE:
      return <MoveAction action={p as MOVEProgress} />;
    case ActionType.MINE:
      return <MineAction action={p as MINEProgress} />;
    case ActionType.ATTUNE:
      return <AttuneAction action={p as ATTUNEProgress} />;
    default:
      return <></>;
  }
};
