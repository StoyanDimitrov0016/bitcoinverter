import { Accordion } from "@heroui/react";

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
