import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";

/** Uma família condensada pesada para título, uma mono técnica, uma sans neutra. */
const condensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-condensed",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-tech",
  display: "swap",
});

const neutral = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-neutral",
  display: "swap",
});

export const classesDeFonte = `${condensed.variable} ${mono.variable} ${neutral.variable}`;
