import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";

import { CursorLabel } from "@/components/effects/CursorLabel";
import { RevealObserver } from "@/components/effects/RevealObserver";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Preloader } from "@/components/layout/Preloader";
import { SkipLink } from "@/components/layout/SkipLink";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { businessJsonLd, defaultDescription, defaultTitle, siteUrl, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const title = defaultTitle();
const description = defaultDescription();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${site.studioName}` },
  description,
  keywords: [...site.seo.keywords],
  applicationName: site.studioName,
  authors: [{ name: site.studioName, url: siteUrl }],
  creator: site.studioName,
  publisher: site.studioName,
  category: "photography",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.studioName,
    title,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f1ec",
  colorScheme: "light",
};

/**
 * Executa antes da primeira pintura:
 * - marca `html.js` (as animações de revelação só se aplicam com JavaScript ativo);
 * - decide se a abertura CASTILHO aparece: só na primeira visita da sessão, entrando pela home,
 *   e nunca com "reduzir movimento". Nas demais, `intro-seen` a esconde imediatamente.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var s=window.sessionStorage;var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(s.getItem("cp-intro")||location.pathname!=="/"||r){d.classList.add("intro-seen")}s.setItem("cp-intro","1")}catch(e){d.classList.add("intro-seen")}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body id="top">
        <Preloader />
        <SkipLink />
        <Navbar />
        <div id="content">
          {children}
          <Footer />
          <WhatsAppButton />
        </div>
        <RevealObserver />
        <CursorLabel />
        <JsonLd data={[businessJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
