export type RelativeImpact =
  | { status: "available"; percent: number }
  | { status: "unavailable"; reason: "zero-current-holdings" };

export type AccumulationResults = {
  currentBtc: number;
  monthlyBtc: number;
  addedBtc: number;
  relativeImpact: RelativeImpact;
};
