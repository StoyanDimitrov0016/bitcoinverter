import { EFFECTIVE_BITCOIN_SUPPLY, WORLD_POPULATION } from "./percentile.constants";

export function calculateGlobalPercentile(bitcoin: number) {
  if (bitcoin === 0) {
    return { bitcoin, topPercentile: 100, maximumPeers: WORLD_POPULATION };
  }

  const maximumPeers = Math.min(WORLD_POPULATION, EFFECTIVE_BITCOIN_SUPPLY / bitcoin);
  const topPercentile = (maximumPeers / WORLD_POPULATION) * 100;

  return { bitcoin, topPercentile, maximumPeers };
}

export function bitcoinForPercentile(percentile: number) {
  return EFFECTIVE_BITCOIN_SUPPLY / (WORLD_POPULATION * (percentile / 100));
}
