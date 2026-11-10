import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { INITIAL_BUSINESS_SETTINGS } from "@/lib/mock-data";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#2D2C28]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Botón flotante de contacto rápido por WhatsApp */}
      <a
        href={INITIAL_BUSINESS_SETTINGS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#2D2C28] text-[#FAF9F7] shadow-lg border border-[#B6AEA1] hover:bg-[#5B5650] transition-all group"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#2AD4A5] animate-pulse" />
        <span className="text-xs font-medium tracking-wide">
          ¿Dudas con tu diseño? WhatsApp
        </span>
      </a>
    </div>
  );
}
