import { Card, Table } from "@heroui/react";

import { SATS_PER_BTC } from "@/lib/bitcoin-calculator.utils";
import { formatBitcoin, formatNumber, formatRateFiat } from "@/lib/number-format.utils";
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";

const SatoshiAmounts = [
  1, 10, 100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000,
] as const;

type SatoshiRatesTableProps = { prices: BitcoinPrices };

export function SatoshiRatesTable({ prices }: SatoshiRatesTableProps) {
  return (
    <Card>
      <Card.Content>
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content aria-label="Common satoshi amounts and their live Bitcoin, US dollar, and euro equivalents">
              <Table.Header>
                <Table.Column isRowHeader>Satoshis</Table.Column>
                <Table.Column>Bitcoin</Table.Column>
                <Table.Column>US dollar</Table.Column>
                <Table.Column>Euro</Table.Column>
              </Table.Header>
              <Table.Body>
                {SatoshiAmounts.map((satoshis) => {
                  const bitcoin = satoshis / SATS_PER_BTC;
                  return (
                    <Table.Row key={satoshis} id={satoshis}>
                      <Table.Cell>{formatNumber(satoshis, 0)} sats</Table.Cell>
                      <Table.Cell>{formatBitcoin(bitcoin)} BTC</Table.Cell>
                      <Table.Cell>{formatRateFiat(bitcoin * prices.USD, "USD")}</Table.Cell>
                      <Table.Cell>{formatRateFiat(bitcoin * prices.EUR, "EUR")}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card.Content>
    </Card>
  );
}
