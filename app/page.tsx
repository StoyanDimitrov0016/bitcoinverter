import { Button } from "@heroui/react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <>
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">{eyebrow}</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="text-lg leading-8 text-slate-600">{description}</p>
    </>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="flex max-w-lg flex-col items-center gap-6 text-center">
        <PageIntro
          eyebrow="BitCoinverter"
          title="A fresh start with Next.js and HeroUI."
          description="The repository is ready for the next chapter."
        />
        <Button variant="primary">Hello HeroUI</Button>
      </div>
    </main>
  );
}
