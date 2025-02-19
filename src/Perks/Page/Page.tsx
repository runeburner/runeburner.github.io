import { Pannable } from "../Pannable/Pannable";
import { Node } from "../Node/Node";
import { BoxIcon, FeatherIcon, HeartIcon, SettingsIcon } from "../../icons";
import { NodeStatus } from "../Node/NodeStatus";

export const Page = (): React.ReactElement => {
  return (
    <Pannable startX={window.innerWidth / 2} startY={window.innerHeight / 2}>
      <Node
        x={0}
        y={-0.86602540379 * 150}
        title={"Speed runes"}
        lvl={[1, 1]}
        description="Unlock speed runes"
        icon={FeatherIcon}
        status={NodeStatus.PURCHASED}
      />
      <Node
        x={-0.5 * 150}
        y={0}
        title={"Void runes"}
        lvl={[1, 1]}
        description="Unlock void runes"
        icon={BoxIcon}
        status={NodeStatus.AVAILABLE}
      />
      <Node
        x={0.5 * 150}
        y={0}
        title={"Arcane runes"}
        lvl={[1, 1]}
        description="Unlock arcane runes"
        icon={SettingsIcon}
        status={NodeStatus.UNLOCKED}
      />
      <Node
        x={200}
        y={200}
        title={"Health runes"}
        lvl={[0, 1]}
        description="Unlock health runes"
        icon={HeartIcon}
        status={NodeStatus.LOCKED}
      />
    </Pannable>
  );
};
