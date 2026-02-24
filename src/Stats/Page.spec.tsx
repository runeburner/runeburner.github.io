import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { StatsPage } from "./Page";
import { GameContext } from "../App/GameContext";
import { freshGame } from "../Game/game";
import "../i18n/i18n";

test("renders yggdrasil leaves", async () => {
  const { getByText } = await render(
    <GameContext.Provider value={freshGame()}>
      <StatsPage />
    </GameContext.Provider>,
  );
  await expect.element(getByText("boosting")).toBeInTheDocument();
});
