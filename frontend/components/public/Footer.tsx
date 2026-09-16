import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/partners", label: "Partners" },
];

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
];

const CONTACT_EMAIL = "contact@enactus-ensi.org";

export default function Footer() {
  return (
    <footer className="bg-enactus-navy text-white">
      <div className="mx-auto grid max-w-content gap-12 px-6 py-16 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" aria-label="Enactus ENSI home">
            <Image
              src="/images/logo-enactus-ensi-white.svg"
              alt="Enactus ENSI"
              width={160}
              height={48}
              className="h-11 w-auto"
            />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-enactus-light-gray">
            Entrepreneurial action for a better world. Students at ENSI designing and running
            social entrepreneurship projects with real, measurable impact.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-enactus-yellow hover:text-enactus-yellow"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-enactus-yellow">
            Quick Links
          </h3>
          <ul className="mt-5 space-y-3">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-enactus-light-gray transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-enactus-yellow">
            Get In Touch
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-enactus-light-gray">
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-enactus-yellow" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-enactus-yellow" />
              <span>Ecole Nationale des Sciences de l&apos;Informatique, Manouba, Tunisia</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-enactus-light-gray lg:flex-row lg:px-8">
          <p>&copy; {new Date().getFullYear()} Enactus ENSI. All rights reserved.</p>
          <p>Entrepreneurial Action for a Better World.</p>
        </div>
      </div>
    </footer>
  );
}
