import { site } from "@/config/site";
import { isPlaceholder } from "@/lib/utils";

/** Somente dígitos, ou vazio enquanto o número não for configurado. */
function whatsappDigits() {
  const raw = site.whatsapp.number;
  if (isPlaceholder(raw)) return "";
  return raw.replace(/\D/g, "");
}

/**
 * Link para iniciar conversa no WhatsApp com mensagem pronta.
 * Sem número configurado, o WhatsApp abre pedindo o contato — o link nunca quebra.
 */
export function whatsappUrl(message: string = site.whatsapp.message) {
  const digits = whatsappDigits();
  const text = encodeURIComponent(message);
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}

/** Mensagem com contexto do ensaio que o visitante estava vendo. */
export function whatsappUrlForEssay(title: string, category: string) {
  return whatsappUrl(
    `Olá! Vi o ensaio "${title}" (${category}) no site da Castilho Produções e gostaria de saber mais sobre um ensaio assim.`,
  );
}

export type Inquiry = {
  name?: string;
  session?: string;
  date?: string;
  people?: string;
  message?: string;
};

/** Monta a mensagem do formulário de contato em formato legível no WhatsApp. */
export function buildInquiryMessage(inquiry: Inquiry) {
  const lines = ["Olá! Conheci a Castilho Produções pelo site e gostaria de saber mais sobre os ensaios.", ""];
  if (inquiry.name) lines.push(`*Nome:* ${inquiry.name}`);
  if (inquiry.session) lines.push(`*Tipo de ensaio:* ${inquiry.session}`);
  if (inquiry.people) lines.push(`*Quem participa:* ${inquiry.people}`);
  if (inquiry.date) lines.push(`*Período desejado:* ${inquiry.date}`);
  if (inquiry.message) lines.push("", inquiry.message);
  return lines.join("\n").trim();
}
