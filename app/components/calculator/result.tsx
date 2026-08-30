import type { ReactNode } from "react";

type ResultProps = { label: string; value: ReactNode };

export function Result({ label, value }: ResultProps) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="m-0 mt-1 flex items-center gap-0.5 font-mono text-xl font-semibold text-foreground tabular-nums">
        {value}
      </dd>
    </div>
  );
}

type ResultRowProps = { label: string; value: ReactNode };

export function ResultRow({ label, value }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-separator py-3 last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="m-0 flex items-center gap-0.5 font-mono text-foreground tabular-nums">
        {value}
      </dd>
    </div>
  );
}
