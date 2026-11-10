import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "L'Atelier Nails | Estudio Especializado en Uñas, Reservas y Cursos",
  description:
    "Centro de estética exclusivo de uñas. Reserva tu cita online con confirmación inmediata (anticipo 50%) o inscríbete en nuestras formaciones profesionales de manicura, gel, acrílico y nail art.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F7] text-[#2D2C28]">
        {children}
      </body>
    </html>
  );
}
