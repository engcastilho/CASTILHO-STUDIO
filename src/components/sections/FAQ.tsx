import { Plus } from "@/components/ui/Icons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { faq } from "@/config/content";

/**
 * Perguntas frequentes com <details> nativo: acessível, indexável e sem JavaScript.
 */
export function FAQ() {
  return (
    <section aria-labelledby="faq-title" className="py-section">
      <div className="container-site grid-editorial gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <Eyebrow className="text-ash">Perguntas frequentes</Eyebrow>
          <h2 id="faq-title" className="heading mt-8 text-h2" data-reveal>
            Antes de <em className="italic">marcar.</em>
          </h2>
        </div>
        <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
          {faq.map((item) => (
            <details key={item.question} className="faq group border-t border-ink/15 last:border-b" data-reveal="fade">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 [&::-webkit-details-marker]:hidden">
                <span className="heading text-h4">{item.question}</span>
                <Plus
                  size={18}
                  className="shrink-0 text-ash transition-transform duration-500 ease-(--ease-cinema) group-open:rotate-45"
                />
              </summary>
              <p className="max-w-xl pb-8 text-ash">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
