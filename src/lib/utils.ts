/** Junta classes condicionalmente (sem dependências). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Um valor de configuração ainda não preenchido, ex.: "[CIDADE]". */
export function isPlaceholder(value: string | undefined | null) {
  if (!value) return true;
  return /^\[.*\]$/.test(value.trim());
}

/** Retorna o valor apenas se ele estiver preenchido. */
export function filled(value: string | undefined | null) {
  return isPlaceholder(value) ? undefined : (value as string);
}

/** 1 → "01" */
export function pad(value: number, size = 2) {
  return String(value).padStart(size, "0");
}
