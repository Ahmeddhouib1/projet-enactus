import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-enactus-navy px-6 text-center text-white">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-enactus-yellow">404</p>
      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-enactus-light-gray">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-enactus-yellow px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-enactus-navy transition-transform hover:-translate-y-0.5"
      >
        Back to home
      </Link>
    </div>
  );
}
