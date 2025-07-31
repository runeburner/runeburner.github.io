import { useState } from "react";
import { AddGolemModal } from "../AddGolemModal/AddGolemModal";
import { useTranslation } from "react-i18next";
import { useGameSelector } from "../../store/gameRedux";
import { Game } from "../../Game/game";

const selectLivesRemaining = (game: Game): boolean => game.livesLeft > 0;
const selectHasGolemRoom = (g: Game): boolean =>
  g.resources.golems < g.resources.maxGolems;

export const AddGolem = (): React.ReactElement => {
  const hasLivesLeft = useGameSelector(selectLivesRemaining);
  const hasRoom = useGameSelector(selectHasGolemRoom);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const onClick = (): void => setOpen(true);
  return (
    <>
      <button
        disabled={!hasLivesLeft || !hasRoom}
        className="btn"
        onClick={onClick}
      >
        {t("create_golem_modal.animate")}
      </button>
      {open && <AddGolemModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
};
