import { Card } from "@heroui/react";

import { AccumulationMonths, type AccumulationResults } from "@/lib/bitcoin-calculator.utils";
import { formatNumber } from "@/lib/number-format.utils";

type MonthlyHoldingsProps = { results: AccumulationResults | null };

export function MonthlyHoldings({ results }: MonthlyHoldingsProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Month-by-month holdings</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 font-medium">Month</th>
                <th className="py-3 font-medium">Added BTC</th>
                <th className="py-3 text-right font-medium">Total BTC</th>
              </tr>
            </thead>
            <tbody>
              {AccumulationMonths.map((month) => (
                <tr key={month} className="border-b border-slate-100 last:border-0">
                  <td className="py-3">{month}</td>
                  <td className="py-3 tabular-nums">
                    {results ? formatNumber(results.monthlyBtc * month) : "—"}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {results ? formatNumber(results.currentBtc + results.monthlyBtc * month) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Content>
    </Card>
  );
}
