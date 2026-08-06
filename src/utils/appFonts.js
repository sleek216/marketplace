import { Plus_Jakarta_Sans, Rubik } from "next/font/google";

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
  preload: true,
});

export const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-rubik",
  preload: false,
});

export const marketplaceFontClassName = `${plusJakartaSans.variable} ${rubik.variable} ${plusJakartaSans.className}`;
