import { site } from "@/config/site";
import { filled } from "@/lib/utils";

/** "Campinas, SP" — ou undefined enquanto cidade/UF forem placeholders. */
export function locationLabel() {
  const city = filled(site.city);
  const state = filled(site.state);
  if (city && state) return `${city}, ${state}`;
  return city ?? state;
}
