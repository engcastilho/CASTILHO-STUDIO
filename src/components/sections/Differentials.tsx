import type { CSSProperties } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealText } from "@/components/ui/RevealText";
import { differentials } from "@/config/content";
import { pad } from "@/lib/utils";

/**
 * Diferenciais em formato de índice editorial — réguas finas, numeração discreta,
 * frases curtas. Nada de ícones, selos ou caixas.
 */
export function Differentials({ tone = "paper" }: { tone?: "paper" | "ink" }) {
  const dark = tone === "ink";
  return (
    <section
      aria-labelledby="differentials-title"
      className={dark ? "bg-ink py-section text-paper" : "bg-paper py-section"}
    >
      <div className="container-site">
        <div className="grid-editorial gap-y-8">
          <Eyebrow className={`col-span-4 md:col-span-8 lg:col-span-3 ${dark ? "text-stone" : "text-ash"}`}>
            {differentials.eyebrow}
          </Eyebrow>
          <RevealText
            id="differentials-title"
            lines={differentials.title}
            className="col-span-4 text-h2 md:col-span-8 lg:col-span-9"
          />
        </div>

        <ul className="mt-16 grid grid-cols-1 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
          {differentials.items.map((item, index) => (
            <li
              key={item.title}
              className={`relative border-t py-8 sm:py-10 sm:pr-8 lg:min-h-64 ${
                dark ? "border-paper/15" : "border-ink/15"
              } ${index % 4 !== 0 ? "lg:border-l lg:pl-8" : ""} ${index % 2 === 1 ? "sm:max-lg:border-l sm:max-lg:pl-8" : ""}`}
              data-reveal
              style={{ "--reveal-delay": `${(index % 4) * 90}ms` } as CSSProperties}
            >
              <span className={`tabular text-[0.6875rem] tracking-[0.16em] ${dark ? "text-stone" : "text-ash"}`}>
                {pad(index + 1)}
              </span>
              <h3 className="heading mt-6 text-h4">{item.title}</h3>
              <p className={`mt-4 max-w-[30ch] text-[0.9375rem] leading-relaxed ${dark ? "text-paper/65" : "text-ash"}`}>
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
