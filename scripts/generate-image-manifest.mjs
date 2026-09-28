#!/usr/bin/env node
/**
 * Gera src/lib/generated/image-manifest.json a partir de /public/images.
 *
 * Para cada fotografia registra:
 *   - width / height reais (respeitando a orientação EXIF)
 *   - blurDataURL (miniatura desfocada exibida enquanto a foto carrega)
 *   - color (tom médio, usado como fundo antes do carregamento)
 *
 * Roda automaticamente antes de `npm run dev` e `npm run build` (inclusive na Vercel).
 * Ou seja: basta trocar/adicionar arquivos em /public/images — o resto é automático.
 */
import { createHash } from "node:crypto";
import { readdir, writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(root, "public", "images");
const outFile = path.join(root, "src", "lib", "generated", "image-manifest.json");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [full] : [];
    }),
  );
  return files.flat();
}

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("[images] sharp indisponível — mantendo o manifesto existente.");
    return;
  }

  let previous = {};
  try {
    previous = JSON.parse(await readFile(outFile, "utf8"));
  } catch {
    previous = {};
  }

  const files = (await walk(imagesDir)).sort();
  const manifest = {};

  await Promise.all(
    files.map(async (file) => {
      const key = "/" + path.relative(path.join(root, "public"), file).split(path.sep).join("/");
      const buffer = await readFile(file);
      const fingerprint = createHash("sha1").update(buffer).digest("hex").slice(0, 12);
      const cached = previous[key];
      if (cached && cached.fingerprint === fingerprint) {
        manifest[key] = cached;
        return;
      }
      try {
        const image = sharp(buffer);
        const meta = await image.metadata();
        const rotated = (meta.orientation ?? 1) >= 5;
        const width = rotated ? meta.height : meta.width;
        const height = rotated ? meta.width : meta.height;
        const blur = await sharp(buffer)
          .rotate()
          .resize(16, 16, { fit: "inside" })
          .webp({ quality: 45 })
          .toBuffer();
        const { dominant } = await sharp(buffer).rotate().resize(32, 32, { fit: "inside" }).stats();
        manifest[key] = {
          width,
          height,
          blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
          color: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
          fingerprint,
        };
      } catch (error) {
        console.warn(`[images] não foi possível ler ${key}: ${error.message}`);
      }
    }),
  );

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`[images] ${Object.keys(sorted).length} imagens indexadas.`);
}

main().catch((error) => {
  // Nunca derruba o build por causa do manifesto: o site funciona sem blur.
  console.warn("[images] falha ao gerar manifesto:", error);
});
