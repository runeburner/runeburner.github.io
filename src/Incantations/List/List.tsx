import { useIncantationNames } from "../../store/incantations";
import { Row } from "./Row/Row";

export const List = (): React.ReactElement => {
  const names = useIncantationNames();

  return (
    <table>
      <thead>
        <tr>
          <th>Incantation name</th>
          <th>Rename</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {names.map((n) => (
          <Row key={n} name={n} />
        ))}
      </tbody>
    </table>
  );
};
