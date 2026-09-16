import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-enactus-yellow">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold leading-tight sm:text-4xl",
          light ? "text-white" : "text-enactus-navy",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            light ? "text-enactus-light-gray" : "text-enactus-dark-gray",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
