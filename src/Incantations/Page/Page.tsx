import { Create } from "../Create/Create";
import { List } from "../List/List";

export const Page = (): React.ReactElement => {
  return (
    <div className={"p-3"}>
      <List />
      <Create />
    </div>
  );
};
