import classes from "./TimeControls.module.css";
import { PlayIcon, PauseIcon, SkipForwardIcon } from "../../icons";
import { useGameSelector } from "../../store/gameRedux";
import { game, Game } from "../../Game/game";

const selectIsPaused = (g: Game): boolean => g.framesLeft === 0;

export const TimeControls = (): React.ReactElement => {
  const isPaused = useGameSelector(selectIsPaused);
  const PlayPauseIcon = isPaused ? PauseIcon : PlayIcon;

  const onPlayPauseClick = (): void => {
    game.framesLeft = game.framesLeft > 0 ? 0 : Infinity;
  };

  const advanceFrame = (): void => {
    game.framesLeft++;
  };

  return (
    <div className={"m-4 p-2 fixed flex " + classes.container}>
      <button className={"btn mr-2"}>
        <SkipForwardIcon style={{ width: "24px" }} onClick={advanceFrame} />
      </button>
      <button className={"btn"}>
        <PlayPauseIcon style={{ width: "24px" }} onClick={onPlayPauseClick} />
      </button>
    </div>
  );
};
