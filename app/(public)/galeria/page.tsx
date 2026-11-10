"use client";

import Link from "next/link";
import { useState } from "react";
import { INITIAL_GALLERY_ITEMS, INITIAL_MEDIA } from "@/lib/mock-data";

export default function GaleriaPage() {
  const [selectedStyle, setSelectedStyle] = useState<string>("Todos");
  const [lightboxMediaId, setLightboxMediaId] = useState<string | null>(null);

  const publishedItems = INITIAL_GALLERY_ITEMS.filter((g) => g.is_published)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((g) => ({
      ...g,
      media: INITIAL_MEDIA.find((m) => m.id === g.media_id)!,
    }))
    .filter((item) => Boolean(item.media));

  const styles = [
    "Todos",
    ...Array.from(new Set(publishedItems.map((i) => i.media.style_tag))),
  ];

  const visibleItems = publishedItems.filter(
    (item) => selectedStyle === "Todos" || item.media.style_tag === selectedStyle
  );

  const activeMedia = INITIAL_MEDIA.find((m) => m.id === lightboxMediaId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="rounded-3xl bg-[#E3DAC9]/70 border border-[#B6AEA1]/40 p-8 sm:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5B5650] font-semibold">
            Portfolio del Estudio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#2D2C28]">
            Galería de Trabajos Reales
          </h1>
          <p className="text-sm text-[#5B5650] leading-relaxed">
            Fotografías sin filtros de trabajos realizados en nuestro estudio: manicura rusa bajo cutícula, nivelación con ápice anatómico y diseños en tonos nude, tierra y tendencia.
          </p>
        </div>

        <Link
          href="/reservas"
          className="px-6 py-3.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650] transition-colors shrink-0"
        >
          Reservar Cita Online
        </Link>
      </div>

      {/* Filtros por estilo */}
      <div className="flex flex-wrap gap-2">
        {styles.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedStyle(tag)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              selectedStyle === tag
                ? "bg-[#2D2C28] text-[#FAF9F7]"
                : "bg-[#F7F4EF] text-[#5B5650] border border-[#EBE5D9] hover:bg-[#E3DAC9]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid de fotografías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleItems.map(({ id, media }) => (
          <figure
            key={id}
            onClick={() => setLightboxMediaId(media.id)}
            className="group cursor-pointer rounded-3xl overflow-hidden bg-[#FAF9F7] border border-[#EBE5D9] hover:border-[#B6AEA1] transition-all shadow-2xs flex flex-col"
          >
            <div className="relative aspect-[4/4] bg-[#E3DAC9] overflow-hidden">
              <img
                src={media.storage_path}
                alt={media.alt_text}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FAF9F7]/95 text-[#2D2C28] text-[11px] font-medium border border-[#EBE5D9]">
                {media.style_tag}
              </span>
            </div>
            <figcaption className="p-5 flex-1 flex flex-col justify-between gap-3">
              <p className="text-xs text-[#2D2C28] font-medium leading-relaxed">
                {media.caption}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#878378] pt-2 border-t border-[#EBE5D9]">
                <span>Ampliar imagen</span>
                <span className="font-semibold text-[#2D2C28]">Ver detalle</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightbox modal */}
      {activeMedia && (
        <div
          onClick={() => setLightboxMediaId(null)}
          className="fixed inset-0 z-50 bg-[#2D2C28]/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF9F7] border-2 border-[#E3DAC9] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
          >
            <div className="aspect-[16/11] bg-[#E3DAC9]">
              <img
                src={activeMedia.storage_path}
                alt={activeMedia.alt_text}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#878378] font-semibold">
                  {activeMedia.style_tag}
                </span>
                <p className="font-serif text-lg font-semibold text-[#2D2C28]">
                  {activeMedia.caption}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/reservas"
                  className="px-5 py-2.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium"
                >
                  Reservar este estilo
                </Link>
                <button
                  type="button"
                  onClick={() => setLightboxMediaId(null)}
                  className="px-4 py-2.5 rounded-full bg-[#F1EDE4] text-[#2D2C28] text-xs font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
