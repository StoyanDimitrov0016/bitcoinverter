import type { ReactElement, ReactNode } from "react";

import type { FiatCurrency } from "@/lib/schemas/calculator.schemas";

const WIDTH_CLASSES = {
  short: "w-10",
  medium: "w-16",
  long: "w-24",
} as const;

type NumericSkeletonProps = {
  width?: keyof typeof WIDTH_CLASSES;
};

export function NumericSkeleton({ width = "medium" }: NumericSkeletonProps) {
  return (
    <span aria-label="Loading value" className="inline-flex items-center">
      <span
        aria-hidden="true"
        className={`${WIDTH_CLASSES[width]} inline-block h-[0.8em] animate-pulse rounded-sm bg-muted/20`}
      />
    </span>
  );
}

type FiatSkeletonProps = NumericSkeletonProps & {
  currency: FiatCurrency;
};

export function FiatSkeleton({ currency, width }: FiatSkeletonProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span aria-hidden="true">{currency === "EUR" ? "€" : "$"}</span>
      <NumericSkeleton width={width} />
    </span>
  );
}

type PendingValueProps = {
  children: ReactNode | null;
  fallback: ReactNode;
  isLoading: boolean;
};

export function PendingValue({ children, fallback, isLoading }: PendingValueProps): ReactElement {
  if (children !== null) {
    return <>{children}</>;
  }
  if (isLoading) {
    return <>{fallback}</>;
  }
  return <span>—</span>;
}
