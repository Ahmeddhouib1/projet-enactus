"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-enactus-yellow">Error</p>
      <h1 className="mt-4 text-3xl font-bold text-enactus-navy sm:text-4xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-enactus-dark-gray">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-enactus-navy px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5"
      >
        Try again
      </button>
    </div>
  );
}
