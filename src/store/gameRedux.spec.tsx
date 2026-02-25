import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { game, Game, resetGame } from "../Game/game";
import {
  arrayShallowEquals,
  runGameSelectors,
  useGameSelector,
} from "./gameRedux";

describe("gameRedux", () => {
  const selectRealmId = (g: Game): string => g.realmId;
  const RealmIdElem = (): React.ReactElement => {
    const realmId = useGameSelector(selectRealmId);
    return <>{realmId}</>;
  };

  it("should handle changing values", async () => {
    resetGame();
    game.realmId = "realm_01";
    const doc = await render(<RealmIdElem />);
    await expect.element(doc.getByText("realm_01")).toBeInTheDocument();

    game.realmId = "realm_02";

    runGameSelectors();
    await expect.element(doc.getByText("realm_02")).toBeInTheDocument();
  });

  const selectResourceTuple = (g: Game): [number, number] => [
    g.resources.leafs,
    g.resources.musicalNotes,
  ];
  const ResourceTupleElem = (): React.ReactElement => {
    const tuple = useGameSelector(selectResourceTuple, arrayShallowEquals);
    return (
      <>
        {tuple[0]}, {tuple[1]}
      </>
    );
  };

  it("should handle arrayShallowEquals", async () => {
    resetGame();
    game.resources.leafs = 4;
    game.resources.musicalNotes = 6;
    const doc = await render(<ResourceTupleElem />);
    await expect.element(doc.getByText("4, 6")).toBeInTheDocument();

    // Check that it doesn't change if we do nothing.
    runGameSelectors();
    await expect.element(doc.getByText("4, 6")).toBeInTheDocument();

    game.resources.leafs++;
    game.resources.musicalNotes++;
    runGameSelectors();
    await expect.element(doc.getByText("5, 7")).toBeInTheDocument();
  });

  it("arrayShallowEquals should check equality correctly", () => {
    expect(arrayShallowEquals([0, 0, 0], [0, 0])).toBeFalsy();
    expect(arrayShallowEquals([0, 0], [0, 0, 0])).toBeFalsy();
    expect(arrayShallowEquals([0, 0], [0, 0])).toBeTruthy();
    expect(arrayShallowEquals([0, 0], [0, 1])).toBeFalsy();
    expect(arrayShallowEquals([0, 0], [0, "1"])).toBeFalsy();
    expect(arrayShallowEquals([1, 2, 3], [1, 2, 3])).toBeTruthy();
  });
});
