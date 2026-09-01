import { Card, Table } from "@heroui/react";

import { SATS_PER_BTC } from "@/lib/bitcoin-calculator.utils";
import { formatBitcoin, formatNumber, formatRateFiat } from "@/lib/number-format.utils";
import { useCalculatorData } from "../calculator/calculator-data-context";
import { ConverterBitcoinSymbol, SatoshiSymbol } from "../shared/currency-symbol";
import { FiatSkeleton, PendingValue } from "../shared/numeric-skeleton";

const SATOSHI_AMOUNTS = [
  1, 10, 100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000,
] as const;

export function SatoshiRatesTable() {
  const { isPriceLoading, prices } = useCalculatorData();
  return (
    <Card className="pb-2">
      <Card.Content>
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content aria-label="Common satoshi amounts and their live Bitcoin, USD, and euro equivalents">
              <Table.Header>
                <Table.Column isRowHeader>Satoshis</Table.Column>
                <Table.Column>Bitcoin</Table.Column>
                <Table.Column>USD</Table.Column>
                <Table.Column>Euro</Table.Column>
              </Table.Header>
              <Table.Body>
                {SATOSHI_AMOUNTS.map((satoshis) => {
                  const bitcoin = satoshis / SATS_PER_BTC;
                  return (
                    <Table.Row
                      key={satoshis}
                      className="last:[&_.table__cell]:border-b-0"
                      id={satoshis}
                    >
                      <Table.Cell className="font-mono tabular-nums">
                        <span className="flex items-center gap-0.5">
                          <SatoshiSymbol />
                          {formatNumber(satoshis, 0)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        <span className="flex items-center gap-0.5">
                          <ConverterBitcoinSymbol />
                          {formatBitcoin(bitcoin)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        <PendingValue
                          fallback={<FiatSkeleton currency="USD" width="long" />}
                          isLoading={isPriceLoading}
                        >
                          {prices ? formatRateFiat(bitcoin * prices.USD, "USD") : null}
                        </PendingValue>
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        <PendingValue
                          fallback={<FiatSkeleton currency="EUR" width="long" />}
                          isLoading={isPriceLoading}
                        >
                          {prices ? formatRateFiat(bitcoin * prices.EUR, "EUR") : null}
                        </PendingValue>
                      </Table.Cell>
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
