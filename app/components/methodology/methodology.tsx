import { Accordion } from "@heroui/react";
import { useTranslations } from "next-intl";

import { formatInteger } from "@/lib/number-format.utils";

import {
  BITCOIN_SUPPLY_CAP,
  EFFECTIVE_BITCOIN_SUPPLY,
  ESTIMATED_LOST_BITCOIN,
  USD_MILLIONAIRES,
  WORLD_POPULATION,
} from "@/lib/percentile/percentile.constants";

import { riverReportLink, unReportLink, ubsReportLink } from "../shared/report-links";

const METHODOLOGY_ITEM_IDS = [
  "calculation",
  "percentage",
  "assumptions",
  "impact",
  "percentileEstimate",
  "privacy",
  "dataSource",
] as const;

export function Methodology() {
  const t = useTranslations("Methodology");

  return (
    <Accordion variant="surface">
      {METHODOLOGY_ITEM_IDS.map((id) => (
        <Accordion.Item key={id} id={id}>
          <Accordion.Heading level={3}>
            <Accordion.Trigger>
              {t(`${id}.title`)}
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="text-sm leading-6 text-muted">
              {id === "percentileEstimate"
                ? t.rich(`${id}.content`, {
                    population: formatInteger(WORLD_POPULATION),
                    effectiveSupply: formatInteger(EFFECTIVE_BITCOIN_SUPPLY),
                    supplyCap: formatInteger(BITCOIN_SUPPLY_CAP),
                    lostBitcoin: formatInteger(ESTIMATED_LOST_BITCOIN),
                    millionaires: formatInteger(USD_MILLIONAIRES),
                    un: unReportLink,
                    river: riverReportLink,
                    ubs: ubsReportLink,
                  })
                : t(`${id}.content`)}
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
