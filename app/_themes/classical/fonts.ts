import { Playfair_Display, Source_Sans_3 } from "next/font/google";

// Loaded once and shared, per the next/font "font definitions file" pattern.
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans" });

export const fontVariables = `${playfair.variable} ${sourceSans.variable}`;
