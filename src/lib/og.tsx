import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Tamanho padrão das imagens de compartilhamento (WhatsApp, Instagram, Facebook, LinkedIn). */
export const ogSize = { width: 1200, height: 630 };

const fontsDir = join(process.cwd(), "src/assets/fonts");

export async function ogFonts() {
  const [serif, serifItalic, sans] = await Promise.all([
    readFile(join(fontsDir, "InstrumentSerif-Regular.woff")),
    readFile(join(fontsDir, "InstrumentSerif-Italic.woff")),
    readFile(join(fontsDir, "InstrumentSans-Medium.woff")),
  ]);
  return [
    { name: "Serif", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Serif", data: serifItalic, weight: 400 as const, style: "italic" as const },
    { name: "Sans", data: sans, weight: 500 as const, style: "normal" as const },
  ];
}

/** Lê uma imagem de /public como data URL (para usar dentro do ImageResponse). */
export async function publicImage(src: string) {
  const file = await readFile(join(process.cwd(), "public", src));
  const ext = src.split(".").pop()?.toLowerCase();
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${file.toString("base64")}`;
}

export const ogColors = {
  ink: "#161412",
  paper: "#f4f1ec",
  stone: "#a0978b",
  terra: "#8e4b37",
};

/** Assinatura CASTILHO / Produções no padrão da marca. */
export function OgWordmark({ color = ogColors.paper }: { color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, color }}>
      <span style={{ fontFamily: "Sans", fontSize: 20, letterSpacing: 7, textTransform: "uppercase" }}>Castilho</span>
      <span style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 26, opacity: 0.8 }}>Produções</span>
    </div>
  );
}
