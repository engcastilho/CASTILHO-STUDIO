import Link from "next/link";

import { ArrowUp } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { mainNav } from "@/config/navigation";
import { site } from "@/config/site";
import { filled } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

export function Footer() {
  const email = site.email;
  const emailFilled = filled(email);
  const city = `${site.city} / ${site.state}`;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-night text-paper" data-hide-fab>
      <div className="container-site pt-20 pb-8 sm:pt-28">
        <div className="grid-editorial gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <Logo variant="stacked" />
            <p className="eyebrow mt-8 text-stone">{site.tagline}</p>
            <p className="mt-8 max-w-sm font-serif text-2xl leading-snug text-paper/80 italic">
              Imagens feitas para serem vistas daqui a muitos anos.
            </p>
          </div>

          <nav aria-label="Rodapé" className="col-span-2 md:col-span-2 lg:col-span-2 lg:col-start-7">
            <p className="eyebrow mb-6 text-stone">Navegue</p>
            <ul className="space-y-3 text-[0.9375rem]">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <p className="eyebrow mb-6 text-stone">Contato</p>
            <ul className="space-y-3 text-[0.9375rem]">
              <li>
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="link-draw">
                  Instagram
                </a>
              </li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="link-draw">
                  WhatsApp
                </a>
              </li>
              <li>
                {emailFilled ? (
                  <a href={`mailto:${emailFilled}`} className="link-draw">
                    E-mail
                  </a>
                ) : (
                  <span title={email}>E-mail</span>
                )}
              </li>
            </ul>
          </div>

          <div className="col-span-4 md:col-span-3 lg:col-span-2">
            <p className="eyebrow mb-6 text-stone">Estúdio</p>
            <p className="text-[0.9375rem]">{city}</p>
            <p className="mt-3 text-[0.9375rem] text-stone">{site.serviceArea}</p>
          </div>
        </div>

        {/* Assinatura monumental */}
        <svg
          aria-hidden
          viewBox="0 0 1000 168"
          className="mt-20 mb-4 block w-full select-none text-paper/[0.07] sm:mt-28"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="0"
            y="142"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="currentColor"
            style={{ fontFamily: "var(--font-sans)", fontSize: 190, fontWeight: 500, letterSpacing: "0.02em" }}
          >
            CASTILHO
          </text>
        </svg>

        <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-paper/10 pt-6 text-caption text-stone sm:flex-row sm:items-center">
          <p>
            © {year} {site.studioName}. Todos os direitos reservados.
          </p>
          <a href="#top" className="group inline-flex items-center gap-3 uppercase tracking-[0.2em] text-[0.6875rem]">
            <span className="link-draw">Voltar ao topo</span>
            <ArrowUp size={14} className="transition-transform duration-500 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}
