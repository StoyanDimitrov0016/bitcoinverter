import { Button, Modal, Table } from "@heroui/react";
import { TbTable } from "react-icons/tb";

import { AccumulationMonths } from "@/lib/bitcoin-calculator.utils";
import { formatNumber } from "@/lib/number-format.utils";

import { BitcoinSymbol } from "./currency-symbol";
import { useCalculatorData } from "./calculator-data-context";
import { NumericSkeleton } from "./numeric-skeleton";

export function MonthlyHoldingsDialog() {
  const { isPriceLoading, results } = useCalculatorData();
  return (
    <Modal>
      <Button className="px-2" size="sm" variant="ghost">
        Monthly
        <TbTable aria-hidden="true" className="size-4 shrink-0" />
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Month-by-month holdings</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Table variant="secondary">
                <Table.ScrollContainer>
                  <Table.Content aria-label="Month-by-month BTC holdings for the next 12 months">
                    <Table.Header>
                      <Table.Column isRowHeader>Month</Table.Column>
                      <Table.Column>Added</Table.Column>
                      <Table.Column className="text-end">Total</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {AccumulationMonths.map((month) => (
                        <Table.Row key={month} id={month}>
                          <Table.Cell className="font-mono tabular-nums">{month}</Table.Cell>
                          <Table.Cell className="font-mono tabular-nums">
                            {results ? (
                              <span className="flex items-center gap-0.5">
                                <BitcoinSymbol />
                                {formatNumber(results.monthlyBtc * month)}
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5">
                                <BitcoinSymbol />
                                {isPriceLoading ? <NumericSkeleton width="long" /> : "—"}
                              </span>
                            )}
                          </Table.Cell>
                          <Table.Cell className="font-mono tabular-nums">
                            {results ? (
                              <span className="flex items-center justify-end gap-0.5">
                                <BitcoinSymbol />
                                {formatNumber(results.currentBtc + results.monthlyBtc * month)}
                              </span>
                            ) : (
                              <span className="flex items-center justify-end gap-0.5">
                                <BitcoinSymbol />
                                {isPriceLoading ? <NumericSkeleton width="long" /> : "—"}
                              </span>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
