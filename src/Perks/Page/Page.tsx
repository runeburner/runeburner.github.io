import { useIsTabSelected } from "../../store/sidebar";
import { Pannable } from "../Pannable/Pannable";
import { Node } from "../Node/Node";
import { BoxIcon, FeatherIcon, SettingsIcon } from "../../icons";

export const Page = (): React.ReactElement => {
  const is = useIsTabSelected("PERKS");
  if (!is) return <></>;

  return (
    <Pannable>
      <Node
        x={0}
        y={0}
        title={"Speed runes"}
        lvl={[1, 1]}
        description="Unlock speed runes"
        icon={FeatherIcon}
      />
      <Node
        x={0}
        y={0}
        title={"Void runes"}
        lvl={[1, 1]}
        description="Unlock void runes"
        icon={BoxIcon}
      />
      <Node
        x={0}
        y={0}
        title={"Arcane runes"}
        lvl={[1, 1]}
        description="Unlock speed runes"
        icon={SettingsIcon}
      />
    </Pannable>
  );
};
