type SectionHeadingProps = {
  id: string;
  title: string;
};

export function SectionHeading({ id, title }: SectionHeadingProps) {
  return (
    <h2 id={id} className="text-2xl font-semibold tracking-tight text-slate-950">
      {title}
    </h2>
  );
}
