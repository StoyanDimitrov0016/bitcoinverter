type SectionHeadingProps = {
  id: string;
  title: string;
};

export function SectionHeading({ id, title }: SectionHeadingProps) {
  return (
    <h2 id={id} className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
      {title}
    </h2>
  );
}
