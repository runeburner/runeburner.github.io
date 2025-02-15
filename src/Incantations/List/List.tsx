import { useIncantationNames } from "../../store/incantations";
import { Row } from "./Row/Row";

export const List = (): React.ReactElement => {
  const names = useIncantationNames();

  return (
    <table>
      <thead>
        <td>Incantation name</td>
        <td>Rename</td>
        <td>Edit</td>
        <td>Delete</td>
      </thead>
      <tbody>
        {names.map((n) => (
          <Row name={n} />
        ))}
      </tbody>
    </table>
  );
};
