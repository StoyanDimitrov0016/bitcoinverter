"use client";

import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { TbPercentage } from "react-icons/tb";

import { BitcoinSymbol } from "../shared/currency-symbol";
import type { GrowthMetric } from "@/lib/impact/impact.constants";

type GrowthMetricToggleProps = {
  ariaLabel: string;
  value: GrowthMetric;
  onChange: (value: GrowthMetric) => void;
};

const METRICS = [
  { id: "btc", label: "BTC amount" },
  { id: "percent", label: "Percentage increase" },
] as const;

export function GrowthMetricToggle({ ariaLabel, value, onChange }: GrowthMetricToggleProps) {
  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      className="border border-border"
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
        <ToggleButton
          key={metric.id}
          aria-label={metric.label}
          className="min-w-9 px-2.5"
          id={metric.id}
        >
          {metric.id === "btc" ? (
            <span className="flex size-4 items-center justify-center text-xl">
              <BitcoinSymbol isActive={value === "btc"} />
            </span>
          ) : (
            <TbPercentage aria-hidden="true" className="size-4" />
          )}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
