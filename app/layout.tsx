import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, JetBrains_Mono, Literata } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--f-display", weight: ["500", "700"] });
const body = Literata({ subsets: ["latin", "vietnamese"], variable: "--f-body", weight: ["400", "600"] });
const hand = Caveat({ subsets: ["latin"], variable: "--f-hand", weight: ["500", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "Aka's Journal · Phan Quang Huy, AI & Automation Engineer",
  description:
    "The portfolio of Phan Quang Huy (Aka), AI & Automation Engineer, told as a journal you can open and read page by page.",
  openGraph: {
    title: "Aka's Journal",
    description: "Phan Quang Huy, AI & Automation Engineer. Open the journal.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#E6F2FC" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Mark JS before paint so the no-JS fallback never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
