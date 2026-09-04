import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("SiteFooter");

  return (
    <footer className="border-t border-border bg-surface">
      <div className="layout-container flex flex-col items-center gap-3 py-5 text-center">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4 sm:text-start">
          <p className="text-sm font-medium text-foreground">{t("tagline")}</p>
          <p className="rounded-full bg-surface-secondary px-3 py-1 text-xs text-muted">
            {t("badge")}
          </p>
        </div>
        <p className="w-full text-xs leading-5 text-muted">
          <strong className="font-medium text-foreground">{t("disclaimerStrong")}</strong>{" "}
          {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
