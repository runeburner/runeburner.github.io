import { MoveAction } from "./MoveAction/MoveAction";
import { MineAction } from "./MineAction/MineAction";
import { AttuneAction } from "./AttuneAction/AttuneAction";
import {
  ActionType,
  ATTUNEProgress,
  MINEProgress,
  MOVE_NEXT_TOProgress,
} from "../../types/actions";
import { useAction } from "./Progress";

type ActionProps = {
  id: number;
};

export const Action = ({ id }: ActionProps): React.ReactElement => {
  const p = useAction(id);
  if (!p) return <></>;
  switch (p.__type) {
    case ActionType.MOVE_NEXT_TO:
      return <MoveAction id={id} action={p as MOVE_NEXT_TOProgress} />;
    case ActionType.MINE:
      return <MineAction id={id} action={p as MINEProgress} />;
    case ActionType.ATTUNE:
      return <AttuneAction id={id} action={p as ATTUNEProgress} />;
    default:
      return <></>;
  }
};
