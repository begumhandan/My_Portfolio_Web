import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ id, index, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="max-w-2xl">
      <p className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase">
        <span className="text-accent-blue">{index}</span>
        <span className="mx-2 text-zinc-700">/</span>
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-4 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl"
      >
        {title}
      </h2>
      {description && <p className="mt-4 text-base text-pretty text-zinc-400">{description}</p>}
    </Reveal>
  );
}
