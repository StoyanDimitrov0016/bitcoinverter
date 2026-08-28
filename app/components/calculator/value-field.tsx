import { Button, FieldError, Input, Label, TextField } from "@heroui/react";

import { adjustDecimalAmount } from "@/lib/bitcoin-calculator.utils";

type ValueFieldProps = {
  label: string;
  value: string;
  step: number;
  error?: string;
  onChange: (value: string) => void;
};

export function ValueField({ label, value, step, error, onChange }: ValueFieldProps) {
  return (
    <TextField fullWidth isInvalid={!!error} name={label.toLowerCase().replaceAll(" ", "-")}>
      <Label>{label}</Label>
      <div className="flex overflow-hidden rounded-field bg-field shadow focus-within:ring-2 focus-within:ring-slate-300">
        <Button
          isIconOnly
          aria-label={`Decrease ${label}`}
          variant="ghost"
          onPress={() => onChange(adjustDecimalAmount(value, step, -1))}
        >
          −
        </Button>
        <Input
          className="min-w-0 flex-1 rounded-none shadow-none focus:!ring-0 focus-visible:!ring-0"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button
          isIconOnly
          aria-label={`Increase ${label}`}
          variant="ghost"
          onPress={() => onChange(adjustDecimalAmount(value, step, 1))}
        >
          +
        </Button>
      </div>
      <FieldError>{error}</FieldError>
    </TextField>
  );
}
