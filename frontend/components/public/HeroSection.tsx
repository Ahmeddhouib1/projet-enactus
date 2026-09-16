import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-enactus-navy">
      {/* Decorative geometry inspired by the Enactus mark - purely ornamental, not the logo itself */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-40 h-[420px] w-[420px] rotate-12 bg-enactus-yellow/10" />
        <div className="absolute -right-10 top-24 h-64 w-64 rotate-45 border border-white/10" />
        <div className="absolute bottom-[-140px] left-[-100px] h-96 w-96 rotate-[30deg] bg-white/5" />
        <svg
          className="absolute bottom-0 right-0 h-2/3 w-1/2 opacity-90 sm:w-2/5"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <polygon points="400,400 180,400 400,80" fill="#FFC220" fillOpacity="0.14" />
          <polygon points="400,400 260,400 400,180" fill="#FFC220" fillOpacity="0.22" />
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-[85vh] max-w-content flex-col justify-center px-6 py-28 lg:px-8">
        <p className="animate-fade-in text-sm font-bold uppercase tracking-[0.3em] text-enactus-yellow">
          Enactus ENSI
        </p>
        <h1
          className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] text-white sm:text-6xl"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="animate-fade-in block" style={{ animationDelay: "0.05s" }}>
            Entrepreneurial Action
          </span>
          <span className="animate-fade-in block text-enactus-yellow" style={{ animationDelay: "0.2s" }}>
            for a Better World
          </span>
        </h1>
        <p
          className="animate-fade-in mt-6 max-w-xl text-lg leading-relaxed text-enactus-light-gray"
          style={{ animationDelay: "0.3s" }}
        >
          We are the Enactus ENSI chapter - students building social entrepreneurship projects
          that create real, measurable impact on communities across Tunisia.
        </p>
        <div
          className="animate-fade-in mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href="/about"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-enactus-yellow px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-enactus-navy transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Discover Enactus ENSI
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white/10"
          >
            Explore our projects
          </Link>
        </div>
      </div>
    </section>
  );
}
