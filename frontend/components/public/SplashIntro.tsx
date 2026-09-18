"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const TAGLINE = "#We_Change_The_Odds";
const TYPE_START_DELAY_MS = 900;
const CHAR_INTERVAL_MS = 55;
const HOLD_AFTER_TYPING_MS = 600;
const EXIT_DURATION_MS = 500;

/**
 * Entrance animation shown every time the home page loads (including
 * refreshes): the yellow origami bird from the Enactus ENSI mark (just the
 * bird, not the full wordmark) bounces into place, then the chapter
 * tagline types itself out in the charter's heading font, before the whole
 * overlay fades to reveal the page. Skipped entirely for visitors who
 * prefer reduced motion.
 */
export default function SplashIntro() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Deliberately synchronizing with matchMedia - external, client-only
      // browser state that isn't knowable during SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }

    let charIndex = 0;
    let typingInterval: ReturnType<typeof setInterval> | undefined;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    const startTypingTimer = setTimeout(() => {
      typingInterval = setInterval(() => {
        charIndex += 1;
        setTyped(TAGLINE.slice(0, charIndex));
        if (charIndex >= TAGLINE.length) {
          clearInterval(typingInterval);
          exitTimer = setTimeout(() => {
            setExiting(true);
            removeTimer = setTimeout(() => setVisible(false), EXIT_DURATION_MS);
          }, HOLD_AFTER_TYPING_MS);
        }
      }, CHAR_INTERVAL_MS);
    }, TYPE_START_DELAY_MS);

    return () => {
      clearTimeout(startTypingTimer);
      if (typingInterval) clearInterval(typingInterval);
      if (exitTimer) clearTimeout(exitTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6 bg-enactus-navy transition-opacity duration-500",
        exiting && "pointer-events-none opacity-0",
      )}
      aria-hidden="true"
    >
      {/* The origami bird from the Enactus ENSI mark - just the bird, not the wordmark. */}
      <Image
        src="/images/bird.png"
        alt=""
        width={1078}
        height={1083}
        priority
        className="h-28 w-28 origin-center object-contain opacity-0 animate-shape-in sm:h-32 sm:w-32"
      />
      <p className="font-tagline max-w-full whitespace-nowrap px-4 text-center text-[8vw] leading-none text-white sm:text-4xl md:text-5xl">
        {typed}
        <span className="ml-1 inline-block w-[2px] animate-pulse bg-enactus-yellow align-middle" style={{ height: "0.7em" }} />
      </p>
    </div>
  );
}
