import { ImageResponse } from "next/og";

import { hero } from "@/config/content";
import { site } from "@/config/site";
import { OgWordmark, ogColors, ogFonts, ogSize, publicImage } from "@/lib/og";

export const alt = `${site.studioName} — fotografia de famílias, casais, gestantes e retratos`;
export const size = ogSize;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [fonts, photo] = await Promise.all([ogFonts(), publicImage(hero.image)]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: ogColors.ink }}>
        <img
          src={photo}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(14,13,12,0.82) 0%, rgba(14,13,12,0.45) 55%, rgba(14,13,12,0.1) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            color: ogColors.paper,
          }}
        >
          <OgWordmark />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Serif", fontSize: 104, lineHeight: 0.95, letterSpacing: -1.5 }}>
              {hero.title[0].text}
            </div>
            <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 104, lineHeight: 1.05, letterSpacing: -1.5 }}>
              {hero.title[1].text}
            </div>
            <div
              style={{
                marginTop: 28,
                fontFamily: "Sans",
                fontSize: 17,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "rgba(244,241,236,0.72)",
              }}
            >
              {site.tagline}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
