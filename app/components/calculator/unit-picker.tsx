import { Button, ButtonGroup } from "@heroui/react";

type UnitPickerProps<TUnit extends string> = {
  label: string;
  value: TUnit;
  values: readonly TUnit[];
  onChange: (value: TUnit) => void;
};

export function UnitPicker<TUnit extends string>({
  label,
  value,
  values,
  onChange,
}: UnitPickerProps<TUnit>) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <ButtonGroup aria-label={label} size="sm" variant="secondary">
        {values.map((item) => (
          <Button
            key={item}
            aria-pressed={value === item}
            className="text-black"
            variant={value === item ? "primary" : "secondary"}
            onPress={() => onChange(item)}
          >
            {item === "SATS" ? "sats" : item}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
