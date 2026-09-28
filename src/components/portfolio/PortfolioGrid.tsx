import { PortfolioCard, type CardEssay } from "@/components/portfolio/PortfolioCard";
import { cn } from "@/lib/utils";

/**
 * Ritmo editorial que se repete a cada seis ensaios:
 * grande + pequeno deslocado → horizontal cinematográfico → par desalinhado → horizontal largo.
 * Cada breakpoint tem sua própria coreografia (o celular não é só "uma coluna").
 */
const rhythm: Array<{ className: string; aspect: string; sizes: string; size?: "md" | "lg"; excerpt?: boolean }> = [
  {
    className: "col-span-4 md:col-span-5 lg:col-span-7",
    aspect: "4 / 5",
    sizes: "(min-width: 1024px) 58vw, (min-width: 768px) 62vw, 100vw",
    size: "lg",
  },
  {
    className: "col-span-3 col-start-2 md:col-span-3 md:col-start-6 md:mt-40 lg:col-span-4 lg:col-start-9 lg:mt-56",
    aspect: "3 / 4",
    sizes: "(min-width: 1024px) 32vw, (min-width: 768px) 38vw, 75vw",
  },
  {
    className: "col-span-4 md:col-span-8 lg:col-span-10 lg:col-start-2",
    aspect: "16 / 9",
    sizes: "(min-width: 1024px) 82vw, 100vw",
    size: "lg",
    excerpt: true,
  },
  {
    className: "col-span-3 md:col-span-4 lg:col-span-5",
    aspect: "4 / 5",
    sizes: "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 75vw",
  },
  {
    className: "col-span-3 col-start-2 md:col-span-4 md:col-start-5 md:mt-32 lg:col-span-5 lg:col-start-8 lg:mt-48",
    aspect: "4 / 5",
    sizes: "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 75vw",
  },
  {
    className: "col-span-4 md:col-span-6 md:col-start-2 lg:col-span-8 lg:col-start-3",
    aspect: "3 / 2",
    sizes: "(min-width: 1024px) 66vw, (min-width: 768px) 75vw, 100vw",
    size: "lg",
    excerpt: true,
  },
];

export function PortfolioGrid({ essays, eagerFirst }: { essays: CardEssay[]; eagerFirst?: boolean }) {
  if (!essays.length) {
    return <p className="py-24 text-center font-serif text-h4 italic text-ash">Novos ensaios em breve.</p>;
  }
  return (
    <div className="grid-editorial gap-y-[clamp(4rem,9vw,9rem)]">
      {essays.map((essay, index) => {
        const slot = rhythm[index % rhythm.length];
        return (
          <PortfolioCard
            key={essay.slug}
            essay={essay}
            aspect={slot.aspect}
            sizes={slot.sizes}
            size={slot.size}
            showExcerpt={slot.excerpt}
            eager={eagerFirst && index < 2}
            className={cn(slot.className)}
          />
        );
      })}
    </div>
  );
}
