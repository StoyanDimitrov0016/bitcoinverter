import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="layout-container flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <p className="text-muted">{t("description")}</p>
      <Link className="text-accent underline underline-offset-2" href="/">
        {t("backHome")}
      </Link>
    </main>
  );
}
