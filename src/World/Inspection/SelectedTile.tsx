import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";

const selectInspectionTile = (s: RootState): Vec => s.inspection.pos;

export const SelectedTile = (): React.ReactElement => {
  const pos = useAppSelector(selectInspectionTile);

  return (
    <p>
      ({pos[0]}, {pos[1]})
    </p>
  );
};
