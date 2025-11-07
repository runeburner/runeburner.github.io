import { Pannable } from "../Pannable/Pannable";
import { Node } from "../Node/Node";
import { melodies } from "../../Game/Melodies/Melodies";
import { Links } from "../Links/Links";

export const Page = (): React.ReactElement => {
  return (
    <Pannable startX={window.innerWidth / 2} startY={window.innerHeight / 2}>
      <Links />
      {melodies.map((m) => (
        <Node key={m.id} melody={m} />
      ))}
    </Pannable>
  );
};
