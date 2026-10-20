import type { Metadata, Viewport } from "next";
import { Cinzel, Inter_Tight, JetBrains_Mono, Shippori_Mincho_B1, Space_Grotesk, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/motion/SmoothScroll";
import { Cursor } from "@/motion/Cursor";
import { RulerScrollbar } from "@/motion/RulerScrollbar";
import { TransitionProvider } from "@/motion/Transition";
import { StyleController } from "@/motion/StyleController";
import { GlyphField } from "@/gl/GlyphField";
import { Nav } from "@/components/Nav";
import { HudFrame } from "@/components/HudFrame";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";

const inter = Inter_Tight({ variable: "--nf-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--nf-mono", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--nf-grotesk", subsets: ["latin"] });
const jp = Shippori_Mincho_B1({ variable: "--nf-jp", weight: ["400", "800"], subsets: ["latin"], preload: false });
const fraktur = UnifrakturMaguntia({ variable: "--nf-fraktur", weight: "400", subsets: ["latin"] });
const cinzel = Cinzel({ variable: "--nf-cinzel", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s — ${SITE.name}` },
  description: SITE.description,
  openGraph: { type: "website", siteName: SITE.name, title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#050505" };

// Sets the starting style before first paint (mirrors routeStyle in lib/styles.ts).
const bootStyle = `(function(){var p=location.pathname,s="ascii";if(p.indexOf("/archive")===0)s="med";else if(p.indexOf("/systems")===0||p.indexOf("/unit")===0)s="cyber";else if(p.indexOf("/origin")===0)s="jp";document.documentElement.dataset.style=s;})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-style="ascii"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} ${grotesk.variable} ${jp.variable} ${fraktur.variable} ${cinzel.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootStyle }} />
      </head>
      <body>
        <a href="#main" className="label fixed left-4 top-4 z-[100] -translate-y-20 bg-accent px-3 py-2 text-bone focus:translate-y-0">
          Skip to content
        </a>
        <svg width="0" height="0" className="absolute" aria-hidden>
          <filter id="hanko-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
        </svg>
        <TransitionProvider>
          <SmoothScroll />
          <StyleController />
          <GlyphField />
          <div className="grain" aria-hidden />
          <HudFrame />
          <Nav />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <Footer />
          <RulerScrollbar />
          <Cursor />
        </TransitionProvider>
      </body>
    </html>
  );
}
