import { ToggleButton, ToggleButtonGroup } from "@heroui/react";

type UnitPickerProps<TUnit extends string> = {
  isLabelHidden?: boolean;
  label: string;
  value: TUnit;
  values: readonly TUnit[];
  onChange: (value: TUnit) => void;
};

export function UnitPicker<TUnit extends string>({
  isLabelHidden = false,
  label,
  value,
  values,
  onChange,
}: UnitPickerProps<TUnit>) {
  return (
    <div className="space-y-2">
      <p className={isLabelHidden ? "sr-only" : "text-sm font-medium text-foreground"}>{label}</p>
      <ToggleButtonGroup
        aria-label={label}
        className="border border-border"
        disallowEmptySelection
        selectedKeys={[value]}
        selectionMode="single"
        size="sm"
        onSelectionChange={(keys) => {
          const next = values.find((candidate) => keys.has(candidate));
          if (next) {
            onChange(next);
          }
        }}
      >
        {values.map((item) => (
          <ToggleButton key={item} className="px-2 font-mono" id={item}>
            {item === "SATS" ? "sats" : item}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
