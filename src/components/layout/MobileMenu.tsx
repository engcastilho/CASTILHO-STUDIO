"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { mainNav } from "@/config/navigation";
import { site } from "@/config/site";
import { locationLabel } from "@/lib/location";
import { filled, pad } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

type MobileMenuProps = {
  open: boolean;
  onNavigate: () => void;
};

/**
 * Menu em tela cheia para celular e tablet: grandes títulos em serifa,
 * numerados como capítulos, e o WhatsApp sempre à mão.
 */
export function MobileMenu({ open, onNavigate }: MobileMenuProps) {
  const firstLink = useRef<HTMLAnchorElement>(null);
  const location = locationLabel();
  const email = filled(site.email);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => firstLink.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <div
      id="mobile-menu"
      className="menu-panel fixed inset-0 bg-ink text-paper lg:hidden"
      data-open={open}
      inert={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="container-site flex h-full flex-col overflow-y-auto pt-[calc(var(--header-h)+2.5rem)] pb-[max(2rem,env(safe-area-inset-bottom))]">
        <nav aria-label="Menu principal">
          <ol className="flex flex-col gap-1">
            <li className="menu-item" style={{ "--i": 0 } as CSSProperties}>
              <Link ref={firstLink} href="/" onClick={onNavigate} className="group flex items-baseline gap-5 py-1.5">
                <span className="tabular w-6 text-caption text-stone">{pad(0)}</span>
                <span className="heading text-[clamp(2.75rem,11vw,4.5rem)] leading-[1.02]">Início</span>
              </Link>
            </li>
            {mainNav.map((item, index) => (
              <li key={item.href} className="menu-item" style={{ "--i": index + 1 } as CSSProperties}>
                <Link href={item.href} onClick={onNavigate} className="group flex items-baseline gap-5 py-1.5">
                  <span className="tabular w-6 text-caption text-stone">{pad(index + 1)}</span>
                  <span className="heading text-[clamp(2.75rem,11vw,4.5rem)] leading-[1.02] transition-[font-style] group-hover:italic">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="menu-item mt-auto pt-12" style={{ "--i": mainNav.length + 1 } as CSSProperties}>
          <p className="max-w-xs font-serif text-2xl leading-snug italic text-paper/85">
            Vamos guardar esta fase enquanto ela ainda é agora?
          </p>
          <ButtonLink href={whatsappUrl()} variant="light" icon="whatsapp" className="mt-6 w-full sm:w-auto">
            Agendar ensaio
          </ButtonLink>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-paper/15 pt-6 text-caption text-stone">
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="link-draw">
              @{site.instagram.handle}
            </a>
            {email && (
              <a href={`mailto:${email}`} className="link-draw">
                {email}
              </a>
            )}
            {location && <span>{location}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
