"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { mainNav, overlayRoutes } from "@/config/navigation";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Navegação fixa.
 * - Sobre fotografias de abertura: transparente e clara.
 * - Ao rolar: fundo papel translúcido com desfoque.
 * - Rolando para baixo, recolhe; ao subir, volta — a fotografia ganha a tela.
 */
export function Navbar() {
  const pathname = usePathname();
  const overlayRoute = overlayRoutes.some((pattern) => pattern.test(pathname));
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // O menu fica aberto apenas na rota em que foi aberto: navegar fecha automaticamente.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const threshold = overlayRoute ? window.innerHeight * 0.82 - 72 : 16;
      setScrolled(y > threshold);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 240);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [overlayRoute]);

  // Elementos fixos abaixo do cabeçalho (ex.: filtros do portfólio) sobem quando ele se recolhe.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", hidden && !open);
  }, [hidden, open]);

  // Menu aberto: trava a rolagem e torna o restante da página inerte.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const content = document.getElementById("content");
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    content?.setAttribute("inert", "");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      content?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const light = open || (overlayRoute && !scrolled);
  const solid = !open && (scrolled || !overlayRoute);

  return (
    <header
      className={cn("site-header fixed inset-x-0 top-0 z-50", light ? "text-white" : "text-ink")}
      data-hidden={hidden && !open}
    >
      <MobileMenu open={open} onNavigate={() => setMenuPath(null)} />

      <div
        aria-hidden
        className={cn(
          "absolute inset-0 border-b border-ink/[0.06] bg-paper/85 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500",
          solid ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="container-site relative flex h-(--header-h) items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Castilho Produções — página inicial"
          className="-my-2 py-2"
          onClick={() => setMenuPath(null)}
        >
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="group relative flex items-center gap-2 py-2 text-[0.75rem] font-medium uppercase tracking-[0.2em]"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-1 w-1 rounded-full bg-terra transition-all duration-500",
                        active ? "scale-100 opacity-100" : "scale-0 opacity-0",
                      )}
                    />
                    <span className="link-draw">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ButtonLink href={whatsappUrl()} variant={light ? "outline-light" : "outline"} size="md" icon="none">
              Agendar ensaio
            </ButtonLink>
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="group -mr-2 flex h-11 items-center gap-3 px-2 text-[0.75rem] font-medium uppercase tracking-[0.2em] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            <span className="w-12 text-right">{open ? "Fechar" : "Menu"}</span>
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-(--ease-cinema)",
                  open ? "top-1/2 rotate-45" : "top-0.5",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px bg-current transition-all duration-500 ease-(--ease-cinema)",
                  open ? "top-1/2 w-full -rotate-45" : "bottom-0.5 w-2/3",
                )}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
