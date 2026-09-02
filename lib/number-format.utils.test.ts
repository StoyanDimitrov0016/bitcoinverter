import { describe, expect, it } from "vitest";

import { formatImpactHorizon } from "./number-format.utils";

describe("formatImpactHorizon", () => {
  it.each([
    [8, "8mo"],
    [12, "1y"],
    [13, "1y 1mo"],
    [24, "2y"],
    [27, "2y 3mo"],
  ])("formats %i months as %s", (months, expected) => {
    expect(formatImpactHorizon(months)).toBe(expected);
  });
});
