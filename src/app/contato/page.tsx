import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/contact/ContactForm";
import { PageTransition } from "@/components/layout/PageTransition";
import { FAQ } from "@/components/sections/FAQ";
import { PageHeader } from "@/components/sections/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, MailIcon } from "@/components/ui/Icons";
import { site } from "@/config/site";
import { breadcrumbJsonLd, locationLabel } from "@/lib/seo";
import { filled } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Agende seu ensaio com a Castilho Produções. Conte o que vocês estão vivendo agora — respondemos pelo WhatsApp, Instagram ou e-mail.",
  alternates: { canonical: "/contato" },
  openGraph: { url: "/contato" },
};

export default function ContactPage() {
  const email = filled(site.email);
  const location = locationLabel() ?? `${site.city} / ${site.state}`;

  return (
    <PageTransition>
      <main id="main">
        <PageHeader
          eyebrow="Contato"
          title={[{ text: "Vamos" }, { text: "conversar?", emphasis: true }]}
          intro="Conte o que vocês estão vivendo agora e o que gostariam de guardar. O caminho mais rápido é o WhatsApp."
        />

        <section aria-label="Formas de contato" className="container-site pb-section">
          <div className="grid-editorial gap-y-20 border-t border-ink/15 pt-14 sm:pt-20">
            <div className="col-span-4 md:col-span-8 lg:col-span-4">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <p className="eyebrow text-ash">Direto ao ponto</p>
                <ButtonLink href={whatsappUrl()} icon="whatsapp" className="mt-6 w-full sm:w-auto">
                  Chamar no WhatsApp
                </ButtonLink>

                <dl className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
                  <Channel label="Instagram">
                    <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3">
                      <InstagramIcon size={18} />
                      <span className="link-draw">@{site.instagram.handle}</span>
                    </a>
                  </Channel>
                  <Channel label="E-mail">
                    {email ? (
                      <a href={`mailto:${email}`} className="group inline-flex items-center gap-3">
                        <MailIcon size={18} />
                        <span className="link-draw">{email}</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-3">
                        <MailIcon size={18} />
                        {site.email}
                      </span>
                    )}
                  </Channel>
                  <Channel label="Estúdio">
                    <span>{location}</span>
                    <span className="mt-1 block text-ash">{site.serviceArea}</span>
                  </Channel>
                  <Channel label="Atendimento">{site.hours}</Channel>
                </dl>
              </div>
            </div>

            <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
              <h2 className="heading text-h3">
                Ou monte sua mensagem <em className="italic">aqui.</em>
              </h2>
              <p className="mt-4 max-w-md text-ash">
                Preencha o que quiser — ao enviar, o WhatsApp abre com tudo escrito. Você revisa antes de mandar.
              </p>
              <div className="mt-12">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        <div className="bg-linen">
          <FAQ />
        </div>

        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Contato", path: "/contato" },
          ])}
        />
      </main>
    </PageTransition>
  );
}

function Channel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 py-5 text-[0.9375rem]">
      <dt className="eyebrow pt-1 text-ash">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
