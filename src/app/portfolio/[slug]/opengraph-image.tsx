import { ImageResponse } from "next/og";

import { essays } from "@/config/portfolio";
import { site } from "@/config/site";
import { OgWordmark, ogColors, ogFonts, ogSize, publicImage } from "@/lib/og";
import { getEssay } from "@/lib/portfolio";

export const alt = `Ensaio fotográfico — ${site.studioName}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return essays.map((essay) => ({ slug: essay.slug }));
}

/** Prévia de compartilhamento de cada ensaio: ficha editorial à esquerda, capa à direita. */
export default async function EssayOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getEssay(slug);
  const fonts = await ogFonts();
  if (!found) {
    return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: ogColors.ink }} />, {
      ...size,
      fonts,
    });
  }
  const { essay } = found;
  const photo = await publicImage(essay.cover.src);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: ogColors.ink, color: ogColors.paper }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 690,
            padding: "60px 64px",
          }}
        >
          <OgWordmark />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Sans",
                fontSize: 16,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: ogColors.stone,
              }}
            >
              {`N.º ${essay.number} — ${essay.categoryLabel}`}
            </div>
            <div style={{ marginTop: 22, fontFamily: "Serif", fontSize: 84, lineHeight: 0.98, letterSpacing: -1 }}>
              {essay.title}
            </div>
            <div
              style={{
                marginTop: 26,
                fontFamily: "Serif",
                fontStyle: "italic",
                fontSize: 28,
                lineHeight: 1.3,
                color: "rgba(244,241,236,0.78)",
              }}
            >
              {essay.excerpt.length > 110 ? `${essay.excerpt.slice(0, 107)}…` : essay.excerpt}
            </div>
          </div>
        </div>
        <img src={photo} alt="" width={510} height={630} style={{ width: 510, height: 630, objectFit: "cover" }} />
      </div>
    ),
    { ...size, fonts },
  );
}
