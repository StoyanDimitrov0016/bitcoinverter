import { Card, Form } from "@heroui/react";
import { Controller, type Control, type FieldErrors, useWatch } from "react-hook-form";

import { getAmountStep } from "@/lib/bitcoin-calculator.utils";
import { schemaValidationRule } from "@/lib/react-hook-form.utils";
import {
  DecimalAmountInputSchema,
  type AccumulationFormValues,
  type ContributionUnit,
} from "@/lib/schemas/calculator.schemas";

import { UnitPicker } from "./unit-picker";
import { ValueField } from "./value-field";

type AccumulationFormProps = {
  control: Control<AccumulationFormValues>;
  errors: FieldErrors<AccumulationFormValues>;
  onContributionUnitChange: (value: ContributionUnit) => void;
};

export function AccumulationForm({
  control,
  errors,
  onContributionUnitChange,
}: AccumulationFormProps) {
  const amountRule = schemaValidationRule("DecimalAmountInputSchema", DecimalAmountInputSchema);
  const holdingUnit = useWatch({ control, name: "holdingUnit" });
  const contributionUnit = useWatch({ control, name: "contributionUnit" });
  return (
    <Card>
      <Card.Content>
        <Form className="space-y-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
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
                  label="Unit"
                  value={field.value}
                  values={["USD", "EUR", "BTC"]}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
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
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="contributionUnit"
              render={({ field }) => (
                <UnitPicker
                  label="Currency"
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
