import { game } from "../../Game/game";
import { XOctagonIcon } from "../../icons";

type GolemFaderProps = {
  entityID: number;
};

export const GolemFader = ({
  entityID,
}: GolemFaderProps): React.ReactElement => {
  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.stopPropagation();
    game.fadeWorker(entityID);
  };
  return <XOctagonIcon style={{ width: "24px" }} onClick={onClick} />;
};
