type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
      <div className="space-y-2">
        <h2 className="section-title text-2xl md:text-3xl">{title}</h2>
        {description ? <p className="max-w-3xl text-sm/7 text-[var(--muted)]">{description}</p> : null}
      </div>
    </div>
  );
}
