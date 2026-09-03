import { Accordion } from "@heroui/react";

import {
  BITCOIN_SUPPLY_CAP,
  EFFECTIVE_BITCOIN_SUPPLY,
  ESTIMATED_LOST_BITCOIN,
  RIVER_CUSTODY_REPORT_URL,
  UN_POPULATION_REPORT_URL,
  UBS_WEALTH_REPORT_URL,
  USD_MILLIONAIRES,
  WORLD_POPULATION,
} from "@/lib/percentile/percentile.constants";

const METHODOLOGY_ITEMS = [
  {
    id: "calculation",
    title: "How this works",
    content:
      "Your holding and monthly contribution are converted to BTC at today's Kraken price. The monthly BTC amount is multiplied by 12 and compared with your current holdings.",
  },
  {
    id: "percentage",
    title: "What net increase means",
    content:
      "Net increase is the additional BTC from 12 equal monthly contributions, shown as a percentage of your current holdings. It measures BTC quantity, not portfolio value or investment return.",
  },
  {
    id: "assumptions",
    title: "Assumptions",
    content:
      "The current price stays fixed for every purchase. Contribution amounts remain equal. Fees, spreads, taxes, inflation, and future Bitcoin price changes are excluded.",
  },
  {
    id: "impact",
    title: "Impact analysis",
    content:
      "Current-plan time estimates assume the same contribution continues. Monthly-plan amounts show what would reach each target in 12 months. These are mathematical scenarios, not predictions.",
  },
  {
    id: "percentile-estimate",
    title: "Bitcoin percentile estimate",
    content: (
      <>
        The percentile converter calculates how many people could each hold at least your amount if
        the estimated effective supply were distributed that way, then divides that maximum by a{" "}
        {WORLD_POPULATION.toLocaleString("en")} global population from the{" "}
        <a
          className="underline underline-offset-2"
          href={UN_POPULATION_REPORT_URL}
          rel="noreferrer"
          target="_blank"
        >
          UN World Population Prospects 2024
        </a>
        . The effective supply is {EFFECTIVE_BITCOIN_SUPPLY.toLocaleString("en")} BTC:
        Bitcoin&apos;s {BITCOIN_SUPPLY_CAP.toLocaleString("en")} BTC cap minus a conservative{" "}
        {ESTIMATED_LOST_BITCOIN.toLocaleString("en")} BTC loss estimate from the{" "}
        <a
          className="underline underline-offset-2"
          href={RIVER_CUSTODY_REPORT_URL}
          rel="noreferrer"
          target="_blank"
        >
          River Bitcoin Custody Report 2025
        </a>
        . No official lost-coin count exists: on-chain inactivity cannot prove that keys are lost.
        The millionaire comparison uses approximately {USD_MILLIONAIRES.toLocaleString("en")} USD
        millionaires reported in the{" "}
        <a
          className="underline underline-offset-2"
          href={UBS_WEALTH_REPORT_URL}
          rel="noreferrer"
          target="_blank"
        >
          UBS Global Wealth Report 2025
        </a>
        . These are scarcity-based averages and upper bounds, not observed ownership rankings;
        addresses are not people, ownership is uneven, and custodians pool customer funds.
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    content:
      "No account is required. Financial inputs are kept only in the current browser session and are not persisted or used to collect portfolio metrics.",
  },
  {
    id: "data-source",
    title: "Price data",
    content: "BTC prices come from Kraken's public market-data API and are cached for 60 seconds.",
  },
] as const;

export function Methodology() {
  return (
    <Accordion variant="surface">
      {METHODOLOGY_ITEMS.map((item) => (
        <Accordion.Item key={item.id} id={item.id}>
          <Accordion.Heading level={3}>
            <Accordion.Trigger>
              {item.title}
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="text-sm leading-6 text-muted">{item.content}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
