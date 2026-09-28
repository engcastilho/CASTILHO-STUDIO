#!/usr/bin/env node
/**
 * Prepara as fotografias de /public/images para a web — rode depois de copiar suas fotos:
 *
 *   npm run images:optimize
 *
 * - Limita o lado maior a 2560 px (o next/image gera as versões menores sozinho).
 * - Aplica a orientação EXIF e remove metadados (GPS, câmera) por privacidade.
 * - Recomprime JPEG com mozjpeg (qualidade 82). Só substitui se o arquivo ficar menor.
 *
 * Os arquivos originais são sobrescritos: mantenha uma cópia dos seus originais fora do projeto.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.resolve(root, process.argv[2] ?? "public/images");
const MAX = 2560;
const QUALITY = 82;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.(jpe?g|png|webp)$/i.test(entry.name) ? [full] : [];
    }),
  );
  return nested.flat();
}

let saved = 0;
for (const file of await walk(target)) {
  const input = await readFile(file);
  const ext = path.extname(file).toLowerCase();
  let pipeline = sharp(input).rotate().resize(MAX, MAX, { fit: "inside", withoutEnlargement: true });
  pipeline =
    ext === ".png"
      ? pipeline.png({ compressionLevel: 9, palette: false })
      : ext === ".webp"
        ? pipeline.webp({ quality: QUALITY })
        : pipeline.jpeg({ quality: QUALITY, mozjpeg: true, progressive: true });
  const output = await pipeline.toBuffer();
  const rel = path.relative(root, file);
  if (output.length < input.length) {
    await writeFile(file, output);
    saved += input.length - output.length;
    console.log(`✓ ${rel}  ${Math.round(input.length / 1024)} → ${Math.round(output.length / 1024)} KB`);
  } else {
    console.log(`· ${rel}  já otimizada`);
  }
}
console.log(`\nEconomia total: ${(saved / 1024 / 1024).toFixed(1)} MB. Rode "npm run images" para atualizar o manifesto.`);
