import { MoveAction } from "./MoveAction/MoveAction";
import { MineAction } from "./MineAction/MineAction";
import { AttuneAction } from "./AttuneAction/AttuneAction";
import {
  ActionProgress,
  ActionType,
  ATTUNEProgress,
  MINEProgress,
  MOVE_NEXT_TOProgress,
} from "../../types/actions";

type ActionProps = {
  p: ActionProgress;
};

export const Action = ({ p }: ActionProps): React.ReactElement => {
  switch (p.__type) {
    case ActionType.MOVE_NEXT_TO:
      return <MoveAction action={p as MOVE_NEXT_TOProgress} />;
    case ActionType.MINE:
      return <MineAction action={p as MINEProgress} />;
    case ActionType.ATTUNE:
      return <AttuneAction action={p as ATTUNEProgress} />;
    default:
      return <></>;
  }
};
