"use client";

import { ToggleButton, ToggleButtonGroup, Tooltip } from "@heroui/react";
import { TbPercentage } from "react-icons/tb";

import { BitcoinSymbol } from "../shared/currency-symbol";
import type { GrowthMetric } from "@/lib/impact-chart.utils";

type GrowthMetricToggleProps = {
  value: GrowthMetric;
  onChange: (value: GrowthMetric) => void;
};

const METRICS = [
  { id: "btc", label: "BTC amount" },
  { id: "percent", label: "Percentage increase" },
] as const;

export function GrowthMetricToggle({ value, onChange }: GrowthMetricToggleProps) {
  return (
    <ToggleButtonGroup
      aria-label="Growth value"
      className="rounded-3xl border border-border"
      disallowEmptySelection
      selectedKeys={[value]}
      selectionMode="single"
      size="sm"
      onSelectionChange={(keys) => {
        const next = METRICS.find((metric) => keys.has(metric.id));
        if (next) {
          onChange(next.id);
        }
      }}
    >
      {METRICS.map((metric) => (
        <Tooltip key={metric.id} delay={500}>
          <ToggleButton
            aria-label={metric.label}
            className="min-w-9 px-2.5 [--toggle-button-fg-selected:var(--foreground)]"
            id={metric.id}
          >
            {metric.id === "btc" ? (
              <span className="flex size-4 items-center justify-center text-xl">
                <BitcoinSymbol />
              </span>
            ) : (
              <TbPercentage aria-hidden="true" className="size-4" />
            )}
          </ToggleButton>
          <Tooltip.Content>{metric.label}</Tooltip.Content>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  );
}
