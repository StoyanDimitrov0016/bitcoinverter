export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-5 text-center sm:px-5">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4 sm:text-start">
          <p className="text-sm font-medium text-foreground">
            Bitcoin is the second most limited asset. The first one is your life.
          </p>
          <p className="rounded-full bg-surface-secondary px-3 py-1 text-xs text-muted">
            No login, no storage, open source
          </p>
        </div>
        <p className="w-full text-xs leading-5 text-muted">
          <strong className="font-medium text-foreground">
            A quantity calculator, not financial advice.
          </strong>{" "}
          Results describe a simplified accumulation scenario and do not forecast prices, estimate
          returns, or recommend buying Bitcoin.
        </p>
      </div>
    </footer>
  );
}
