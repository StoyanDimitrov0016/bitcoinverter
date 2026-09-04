"use client";

type InlineScriptProps = {
  children: string;
};

export function InlineScript({ children }: InlineScriptProps) {
  return (
    <script
      // oxlint-disable-next-line react/no-danger -- This renders only the static, module-owned theme bootstrap.
      dangerouslySetInnerHTML={{ __html: children }}
      suppressHydrationWarning
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
    />
  );
}
