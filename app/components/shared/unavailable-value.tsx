import { useTranslations } from "next-intl";
import { TbCircleOff } from "react-icons/tb";

export function UnavailableValue() {
  const t = useTranslations("Common");

  return (
    <span className="inline-flex items-center text-muted">
      <TbCircleOff aria-hidden="true" className="size-4" />
      <span className="sr-only">{t("unavailable")}</span>
    </span>
  );
}
