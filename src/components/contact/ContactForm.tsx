"use client";

import { useId, useState, type FormEvent } from "react";

import { ArrowRight, WhatsAppIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { buildInquiryMessage, whatsappUrl, type Inquiry } from "@/lib/whatsapp";

const sessionTypes = ["Família", "Casal", "Noivado", "Gestante", "Infantil", "Retrato", "Outro"];

/**
 * "Monte sua mensagem": o visitante responde quatro perguntas e o WhatsApp abre
 * com tudo escrito. Menos atrito para quem chama, mais contexto para quem responde.
 * Não depende de servidor — perfeito para hospedagem estática na Vercel.
 */
export function ContactForm() {
  const id = useId();
  const [inquiry, setInquiry] = useState<Inquiry>({ session: "Família" });
  const message = buildInquiryMessage(inquiry);
  const set = (key: keyof Inquiry) => (value: string) => setInquiry((current) => ({ ...current, [key]: value }));

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-16" noValidate>
      <div className="space-y-10">
        <fieldset>
          <legend className="eyebrow mb-5 text-ash">Tipo de ensaio</legend>
          <div className="flex flex-wrap gap-2.5">
            {sessionTypes.map((type) => {
              const checked = inquiry.session === type;
              return (
                <label
                  key={type}
                  className={cn(
                    "cursor-pointer rounded-full border px-5 py-2.5 text-[0.8125rem] transition-colors duration-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terra",
                    checked ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink",
                  )}
                >
                  <input
                    type="radio"
                    name="session"
                    value={type}
                    checked={checked}
                    onChange={() => set("session")(type)}
                    className="sr-only"
                  />
                  {type}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field id={`${id}-name`} label="Seu nome" value={inquiry.name} onChange={set("name")} autoComplete="name" />
        <Field
          id={`${id}-people`}
          label="Quem participa"
          placeholder="Ex.: nós dois e nossa filha de 3 anos"
          value={inquiry.people}
          onChange={set("people")}
        />
        <Field
          id={`${id}-date`}
          label="Período desejado"
          placeholder="Ex.: fim de março, em um fim de semana"
          value={inquiry.date}
          onChange={set("date")}
        />
        <Field
          id={`${id}-message`}
          label="Conte um pouco sobre esta fase"
          placeholder="O que vocês estão vivendo agora e o que gostariam de guardar?"
          value={inquiry.message}
          onChange={set("message")}
          multiline
        />

        <button
          type="submit"
          className="group inline-flex h-14 w-full items-center justify-center gap-4 rounded-full bg-ink px-8 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-paper transition-colors duration-500 hover:bg-graphite sm:w-auto"
        >
          <WhatsAppIcon size={18} />
          Enviar pelo WhatsApp
          <ArrowRight size={16} className="arrow-nudge" />
        </button>
      </div>

      {/* Prévia da mensagem, como um bilhete */}
      <aside aria-label="Prévia da mensagem" className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+2rem)]">
          <p className="eyebrow mb-5 text-ash">Prévia da mensagem</p>
          <div className="relative rounded-sm bg-linen p-7 text-[0.9375rem] leading-relaxed whitespace-pre-line text-graphite shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            {message.split("*").map((part, i) => (i % 2 ? <strong key={i} className="font-medium text-ink">{part}</strong> : part))}
            <span aria-hidden className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-[rec_1.2s_steps(1)_infinite] bg-ink/60" />
          </div>
          <p className="mt-4 text-caption text-ash">Nada é enviado sem a sua confirmação no WhatsApp.</p>
        </div>
      </aside>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoComplete?: string;
};

function Field({ id, label, value = "", onChange, placeholder, multiline, autoComplete }: FieldProps) {
  const classes =
    "peer w-full border-0 border-b border-ink/20 bg-transparent px-0 pt-1 pb-4 text-[1.1875rem] text-ink placeholder:text-ash/50 transition-colors duration-500 focus:border-ink focus:outline-none focus:ring-0";
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-3 block text-ash">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={cn(classes, "resize-none field-sizing-content min-h-24")}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={classes}
        />
      )}
    </div>
  );
}
