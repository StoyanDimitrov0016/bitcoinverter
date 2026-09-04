"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ retry }: ErrorPageProps) {
  const t = useTranslations("ErrorBoundary");

  return (
    <main className="layout-container flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <p className="text-muted">{t("description")}</p>
      <Button variant="secondary" onPress={retry}>
        {t("retry")}
      </Button>
    </main>
  );
}
