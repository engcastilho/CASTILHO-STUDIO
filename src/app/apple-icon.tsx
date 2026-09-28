import { ImageResponse } from "next/og";

import { ogColors, ogFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícone para a tela inicial do iPhone: monograma "C" em itálico + ponto terracota. */
export default async function AppleIcon() {
  const fonts = await ogFonts();
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: ogColors.ink,
          color: ogColors.paper,
          position: "relative",
        }}
      >
        <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 128, lineHeight: 1, marginTop: -8 }}>C</div>
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            width: 10,
            height: 10,
            borderRadius: 999,
            background: ogColors.terra,
          }}
        />
      </div>
    ),
    { ...size, fonts },
  );
}
