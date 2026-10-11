import { Alegreya_Sans, Ma_Shan_Zheng, Permanent_Marker } from "next/font/google";

// Loaded once and shared, per the next/font "font definitions file" pattern.
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker" });
const brush = Ma_Shan_Zheng({ subsets: ["latin"], weight: "400", variable: "--font-brush" });
const sans = Alegreya_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-alegreya-sans" });

export const fontVariables = `${marker.variable} ${brush.variable} ${sans.variable}`;
