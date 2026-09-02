import { Button, FieldError, Input, Label, TextField } from "@heroui/react";
import { TbMinus, TbPlus } from "react-icons/tb";

import { adjustDecimalAmount } from "@/lib/calculator/calculator.calculations";

type ValueFieldProps = {
  label: string;
  value: string;
  step: number;
  error?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
};

export function ValueField({ label, value, step, error, onBlur, onChange }: ValueFieldProps) {
  return (
    <TextField
      fullWidth
      className="relative"
      isInvalid={!!error}
      name={label.toLowerCase().replaceAll(" ", "-")}
    >
      <Label>{label}</Label>
      <div className="flex items-center overflow-hidden rounded-field bg-field shadow-field focus-within:focus-field-ring">
        <Button
          isIconOnly
          aria-label={`Decrease ${label}`}
          variant="ghost"
          onPress={() => onChange(adjustDecimalAmount(value, step, -1))}
        >
          <TbMinus aria-hidden="true" className="size-4" />
        </Button>
        <Input
          className="min-w-0 flex-1 rounded-none px-0 font-mono shadow-none focus:ring-0! focus-visible:ring-0!"
          inputMode="decimal"
          value={value}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button
          isIconOnly
          aria-label={`Increase ${label}`}
          variant="ghost"
          onPress={() => onChange(adjustDecimalAmount(value, step, 1))}
        >
          <TbPlus aria-hidden="true" className="size-4" />
        </Button>
      </div>
      <FieldError className="absolute start-0 top-full mt-1 text-xs whitespace-nowrap">
        {error}
      </FieldError>
    </TextField>
  );
}
