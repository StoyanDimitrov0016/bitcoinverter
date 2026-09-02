import { Accordion } from "@heroui/react";

const METHODOLOGY_ITEMS = [
  {
    id: "calculation",
    title: "How the calculation works",
    content:
      "Your holdings and monthly contribution are converted to BTC using the current Kraken price. The monthly BTC amount is multiplied by 12, then compared with the BTC you own today.",
  },
  {
    id: "percentage",
    title: "What the percentage means",
    content:
      "The net increase shows how much additional Bitcoin one year of equal contributions would add relative to your current holdings. It measures BTC quantity, not portfolio value or investment return.",
  },
  {
    id: "assumptions",
    title: "Assumptions",
    content:
      "The current price stays fixed for every purchase. Contribution amounts remain equal. Fees, spreads, taxes, inflation, and future Bitcoin price changes are excluded.",
  },
  {
    id: "impact",
    title: "Impact and price levels",
    content:
      "Time estimates assume the same contribution continues indefinitely. Price levels are mathematical thresholds showing where the plan reaches each impact percentage; they are not price predictions.",
  },
  {
    id: "privacy",
    title: "Privacy",
    content:
      "No account is required. Financial inputs are kept only in the current browser session and are not persisted or used to collect portfolio metrics.",
  },
  {
    id: "data-source",
    title: "Data source",
    content:
      "BTC prices come from Kraken's free public market-data API and are cached for 60 seconds to reduce unnecessary requests.",
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
