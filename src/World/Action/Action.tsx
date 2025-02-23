import { useEffect, useState } from "react";
import { Action as ActionT, ActionType } from "../../types/actions";
import { Channel } from "../channel";
import { MessageType } from "../../types/message";
import { MoveAction } from "./MoveAction/MoveAction";

type ActionProps = {
  id: string;
};

const useAction = (id: string): ActionT | undefined => {
  const [action, setAction] = useState<ActionT>();
  useEffect(() => {
    const unsub = Channel.subAction(id, setAction);
    Channel.send({
      type: MessageType.REFRESH_ACTION,
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
      return <MoveAction action={action} />;
    default:
      return <></>;
  }
};
