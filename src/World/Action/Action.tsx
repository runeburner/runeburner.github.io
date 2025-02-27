import { useEffect, useState } from "react";
import {
  Action as ActionT,
  ActionType,
  MineAction as MineActionT,
  MoveAction as MoveActionT,
} from "../../types/actions";
import { Channel } from "../channel";
import { UIMessageType } from "../../types/uiMessages";
import { MoveAction } from "./MoveAction/MoveAction";
import { MineAction } from "./MineAction/MineAction";

type ActionProps = {
  id: number;
};

const useAction = (id: number): ActionT | undefined => {
  const [action, setAction] = useState<ActionT>();
  useEffect(() => {
    const unsub = Channel.subAction(id, setAction);
    Channel.send({
      type: UIMessageType.REFRESH_ACTION,
      data: id,
    });
    return unsub;
  }, [id]);
  return action;
};

export const Action = ({ id }: ActionProps): React.ReactElement => {
  const action = useAction(id);
  if (!action) return <></>;
  switch (action.type) {
    case ActionType.GOLEM_MOVE:
      return <MoveAction action={action as MoveActionT} />;
    case ActionType.MINE:
      return <MineAction action={action as MineActionT} />;
    default:
      return <></>;
  }
};
