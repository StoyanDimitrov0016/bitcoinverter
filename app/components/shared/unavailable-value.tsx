import { TbCircleOff } from "react-icons/tb";

export function UnavailableValue() {
  return (
    <span className="inline-flex items-center text-muted">
      <TbCircleOff aria-hidden="true" className="size-4" />
      <span className="sr-only">Unavailable</span>
    </span>
  );
}
