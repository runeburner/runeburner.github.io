import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { StatsPage } from "./Page";
import "../i18n/i18n";

test("renders yggdrasil leaves", async () => {
  const { getByText } = await render(<StatsPage />);
  await expect.element(getByText("boosting")).toBeInTheDocument();
});
