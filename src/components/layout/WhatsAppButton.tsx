"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { WhatsAppIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Atalho flutuante para o WhatsApp — sem o verde chamativo.
 * Pílula grafite translúcida com um ponto terracota "gravando".
 * Aparece depois da primeira dobra e se recolhe onde já existe um CTA ([data-hide-fab]).
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let pastFold = false;
    const blockers = new Set<Element>();
    let frame = 0;

    const update = () => {
      frame = 0;
      pastFold = window.scrollY > window.innerHeight * 0.55;
      setVisible(pastFold && blockers.size === 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) blockers.add(entry.target);
          else blockers.delete(entry.target);
        }
        onScroll();
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll("[data-hide-fab]").forEach((element) => io.observe(element));

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar ensaio pelo WhatsApp"
      inert={!visible}
      className={cn(
        "group fixed right-4 z-40 flex h-12 items-center gap-3 rounded-full bg-ink/88 pr-5 pl-4 text-paper",
        "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-md",
        "bottom-[max(1rem,env(safe-area-inset-bottom))] sm:right-6 sm:bottom-6",
        "transition-[opacity,transform,background-color] duration-700 ease-(--ease-cinema) hover:bg-ink",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <span aria-hidden className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-[rec_2.6s_ease-in-out_infinite] rounded-full bg-terra" />
      </span>
      <WhatsAppIcon size={18} />
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em]">
        <span className="sm:hidden">Agendar</span>
        <span className="hidden sm:inline">Agendar ensaio</span>
      </span>
    </a>
  );
}
