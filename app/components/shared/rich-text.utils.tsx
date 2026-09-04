import type { ReactElement, ReactNode } from "react";

export function renderStrong(chunks: ReactNode) {
  return <strong>{chunks}</strong>;
}

export function reportLink(href: string) {
  return function ReportLink(chunks: ReactNode) {
    return (
      <a className="underline underline-offset-2" href={href} rel="noreferrer" target="_blank">
        {chunks}
      </a>
    );
  };
}

export function renderNode(node: ReactElement) {
  return function RenderNode() {
    return node;
  };
}
