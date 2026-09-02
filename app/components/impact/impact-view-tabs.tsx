"use client";

import { Tabs, Tooltip } from "@heroui/react";
import type { ReactNode } from "react";
import { TbChartLine, TbTable } from "react-icons/tb";

export type ImpactView = "chart" | "table";

type ImpactTabsProps = {
  children: ReactNode;
  value: ImpactView;
  onChange: (value: ImpactView) => void;
};

const VIEW_OPTIONS = [
  { id: "chart", label: "Chart view", icon: TbChartLine },
  { id: "table", label: "Table view", icon: TbTable },
] as const;

export function ImpactTabs({ children, value, onChange }: ImpactTabsProps) {
  return (
    <Tabs
      className="contents"
      selectedKey={value}
      onSelectionChange={(key) => {
        if (key === "chart" || key === "table") {
          onChange(key);
        }
      }}
    >
      {children}
    </Tabs>
  );
}

export function ImpactViewTabList() {
  return (
    <Tabs.ListContainer className="border border-border">
      <Tabs.List aria-label="Calculation view" className="p-0.5">
        {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => (
          <Tabs.Tab key={id} aria-label={label} className="min-w-9 px-2.5" id={id}>
            <Tooltip delay={500}>
              <span className="flex size-4 items-center justify-center">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <Tooltip.Content>{label}</Tooltip.Content>
            </Tooltip>
            <Tabs.Indicator />
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs.ListContainer>
  );
}
