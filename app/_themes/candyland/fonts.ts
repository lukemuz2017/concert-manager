import { Fredoka, Nunito } from "next/font/google";

// Loaded once and shared, per the next/font "font definitions file" pattern.
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const fontVariables = `${fredoka.variable} ${nunito.variable}`;
