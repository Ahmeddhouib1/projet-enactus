import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function CTASection({ eyebrow, title, description, ctaLabel, ctaHref }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-enactus-navy py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rotate-12 bg-enactus-yellow/10" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rotate-45 bg-white/5" />
      <div className="relative mx-auto flex max-w-content flex-col items-center gap-6 px-6 text-center lg:px-8">
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-enactus-yellow">{eyebrow}</p>
        )}
        <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        {description && <p className="max-w-xl text-enactus-light-gray">{description}</p>}
        <Link
          href={ctaHref}
          className="group mt-2 inline-flex items-center gap-2 rounded-full bg-enactus-yellow px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-enactus-navy transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          {ctaLabel}
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
