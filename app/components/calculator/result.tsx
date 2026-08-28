type ResultProps = { label: string; value: string };

export function Result({ label, value }: ResultProps) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-slate-950">{value}</p>
    </div>
  );
}

type ResultRowProps = { label: string; value: string };

export function ResultRow({ label, value }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-slate-600">{label}</span>
      <strong className="text-right tabular-nums text-slate-950">{value}</strong>
    </div>
  );
}
