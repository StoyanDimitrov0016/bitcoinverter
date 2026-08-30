import * as z from "zod";

export function schemaValidationRule(schema: z.ZodType, message: string) {
  return (value: unknown) => (z.validate(schema, value) ? true : message);
}
