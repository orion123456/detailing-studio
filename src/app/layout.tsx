import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Детейлинг автомобилей в Москве — Detailing Studio",
  description:
    "Detailing Studio — профессиональный детейлинг автомобилей в Москве. Полировка кузова, керамическое покрытие, защитная PPF-плёнка и другие услуги.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}
