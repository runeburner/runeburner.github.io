import { AutoLoadRealm } from "./AutoLoadRealm";
import { GlobalSpeedUp } from "./GlobalSpeedUp";

export const CheatPage = (): React.ReactElement => {
  return (
    <div className="m-4">
      <table>
        <tbody>
          <GlobalSpeedUp />
          <AutoLoadRealm />
        </tbody>
      </table>
    </div>
  );
};
