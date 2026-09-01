import { Card, Form } from "@heroui/react";
import { Controller, type Control, type FieldErrors, useWatch } from "react-hook-form";

import { getAmountStep } from "@/lib/bitcoin-calculator.utils";
import { schemaValidationRule } from "@/lib/react-hook-form.utils";
import {
  DecimalAmountInputSchema,
  type AccumulationFormValues,
  type ContributionUnit,
} from "@/lib/schemas/calculator.schemas";

import { UnitPicker } from "../shared/unit-picker";
import { ValueField } from "../shared/value-field";

type AccumulationFormProps = {
  control: Control<AccumulationFormValues>;
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
  const amountRule = schemaValidationRule(
    DecimalAmountInputSchema,
    "Enter a valid, non-negative amount."
  );
  const holdingUnit = useWatch({ control, name: "holdingUnit" });
  const contributionUnit = useWatch({ control, name: "contributionUnit" });
  return (
    <Card className="py-3">
      <Card.Content className="h-full">
        <Form className="flex h-full flex-col justify-center gap-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <Controller
              control={control}
              name="holding"
              rules={{ validate: amountRule }}
              render={({ field }) => (
                <ValueField
                  error={errors.holding?.message}
                  label="Current holdings"
                  step={getAmountStep(holdingUnit)}
                  value={field.value}
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
                  label="Current holdings unit"
                  value={field.value}
                  values={["USD", "EUR", "BTC"]}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <Controller
              control={control}
              name="contribution"
              rules={{ validate: amountRule }}
              render={({ field }) => (
                <ValueField
                  error={errors.contribution?.message}
                  label="Monthly contribution"
                  step={getAmountStep(contributionUnit)}
                  value={field.value}
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
                  label="Monthly contribution unit"
                  value={field.value}
                  values={["USD", "EUR", "BTC"]}
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
