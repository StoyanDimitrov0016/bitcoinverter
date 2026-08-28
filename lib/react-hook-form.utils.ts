import type { TSchema } from "typebox";
import { Value } from "typebox/value";

export function schemaValidationRule(schemaName: string, schema: TSchema) {
  return (value: unknown) => {
    const validation = Value.Errors(schema, value)[0];
    return validation ? `${schemaName}: ${validation.message}` : true;
  };
}
