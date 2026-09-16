import { Compass, Handshake, Heart, Lightbulb, Leaf, Rocket, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Value } from "@/types/content";

const ICON_MAP: Record<string, LucideIcon> = {
  compass: Compass,
  lightbulb: Lightbulb,
  rocket: Rocket,
  "heart-handshake": Handshake,
  heart: Heart,
  users: Users,
  leaf: Leaf,
};

export default function ValueCard({ value }: { value: Value }) {
  const Icon = (value.icon && ICON_MAP[value.icon]) || Sparkles;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-enactus-light-gray/30 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -right-6 -top-6 h-20 w-20 rotate-12 bg-enactus-yellow/10 transition-transform duration-300 group-hover:scale-125" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-enactus-navy text-enactus-yellow">
        <Icon size={22} />
      </div>
      <h3 className="relative mt-6 text-xl font-bold text-enactus-navy">{value.title}</h3>
      {value.description && (
        <p className="relative mt-3 text-sm leading-relaxed text-enactus-dark-gray">{value.description}</p>
      )}
    </div>
  );
}
