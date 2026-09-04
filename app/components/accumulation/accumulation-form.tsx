import { Card, Form } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Controller, type Control, type FieldErrors, useWatch } from "react-hook-form";

import { getAmountStep } from "@/lib/calculator/calculator.calculations";
import { HOLDING_UNITS } from "@/lib/calculator/calculator.constants";
import type {
  AccumulationFormValues,
  AccumulationInput,
  ContributionUnit,
} from "@/lib/calculator/calculator.schemas";

import { UnitPicker } from "../shared/unit-picker";
import { ValueField } from "../shared/value-field";

type AccumulationFormProps = {
  control: Control<AccumulationFormValues, unknown, AccumulationInput>;
  errors: FieldErrors<AccumulationFormValues>;
  onContributionEdit: () => void;
  onContributionUnitChange: (value: ContributionUnit) => void;
};

export function AccumulationForm({
  control,
  errors,
  onContributionEdit,
  onContributionUnitChange,
}: AccumulationFormProps) {
  const t = useTranslations("AccumulationForm");
  const tValueField = useTranslations("ValueField");
  const holdingUnit = useWatch({ control, name: "holdingUnit" });
  const contributionUnit = useWatch({ control, name: "contributionUnit" });
  return (
    <Card className="py-3">
      <Card.Content className="h-full">
        <Form aria-label={t("ariaLabel")} className="flex h-full flex-col justify-center gap-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
            <Controller
              control={control}
              name="holding"
              render={({ field }) => (
                <ValueField
                  error={errors.holding ? tValueField("invalidAmount") : undefined}
                  label={t("currentHoldings")}
                  step={getAmountStep(holdingUnit)}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="holdingUnit"
              render={({ field }) => (
                <UnitPicker
                  isLabelHidden
                  label={t("currentHoldingsUnit")}
                  value={field.value}
                  values={HOLDING_UNITS}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
            <Controller
              control={control}
              name="contribution"
              render={({ field }) => (
                <ValueField
                  error={errors.contribution ? tValueField("invalidAmount") : undefined}
                  label={t("monthlyContribution")}
                  step={getAmountStep(contributionUnit)}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(value) => {
                    onContributionEdit();
                    field.onChange(value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="contributionUnit"
              render={({ field }) => (
                <UnitPicker
                  isLabelHidden
                  label={t("monthlyContributionUnit")}
                  value={field.value}
                  values={HOLDING_UNITS}
                  onChange={onContributionUnitChange}
                />
              )}
            />
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
}
