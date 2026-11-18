import { Inter_Tight, IBM_Plex_Mono } from "next/font/google";

export const sans = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-inter-tight", display: "swap" });
export const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
export const fontVars = `${sans.variable} ${mono.variable}`;
