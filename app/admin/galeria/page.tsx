"use client";

import { useState } from "react";
import { INITIAL_GALLERY_ITEMS, INITIAL_MEDIA } from "@/lib/mock-data";
import { GalleryItem, MediaItem } from "@/lib/types";

export default function AdminGaleriaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    INITIAL_GALLERY_ITEMS
  );

  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newTag, setNewTag] = useState("Clean Nails & Nude");

  const handleUploadMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const mediaId = `med-${Date.now()}`;
    const newMedia: MediaItem = {
      id: mediaId,
      storage_path:
        newUrl ||
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85",
      alt_text: newAlt,
      caption: newCaption,
      media_type: "image",
      style_tag: newTag,
      created_by: "admin-01",
      created_at: new Date().toISOString(),
    };
    setMediaList((prev) => [newMedia, ...prev]);
    setGalleryItems((prev) => [
      {
        id: `gal-${Date.now()}`,
        media_id: mediaId,
        sort_order: prev.length + 1,
        is_published: true,
      },
      ...prev,
    ]);
    setNewUrl("");
    setNewAlt("");
    setNewCaption("");
  };

  const togglePublish = (galId: string) => {
    setGalleryItems((prev) =>
      prev.map((g) =>
        g.id === galId ? { ...g, is_published: !g.is_published } : g
      )
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
          Multimedia y Portfolio
        </span>
        <h1 className="font-serif text-3xl font-semibold text-[#2D2C28] mt-1">
          Gestión de Fotografías y Galería
        </h1>
        <p className="text-xs text-[#5B5650] mt-1">
          Sube fotografías de los trabajos realizados en el estudio (máximo 10 MB, formatos JPEG, PNG, WEBP o AVIF) y selecciona cuáles se muestran en la galería pública.
        </p>
      </div>

      {/* Formulario de subida */}
      <form
        onSubmit={handleUploadMedia}
        className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
      >
        <div className="md:col-span-2">
          <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
            Subir Nueva Fotografía a la Galería
          </h2>
        </div>

        <div>
          <label className="block font-medium text-[#2D2C28] mb-1">
            URL o ruta de archivo
          </label>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://... o ruta de imagen"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
          />
        </div>

        <div>
          <label className="block font-medium text-[#2D2C28] mb-1">
            Estilo / Categoría Visual
          </label>
          <select
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
          >
            <option value="Clean Nails & Nude">Clean Nails &amp; Nude</option>
            <option value="French & Baby Boomer">French &amp; Baby Boomer</option>
            <option value="Esculpidas Gel & Acrílico">Esculpidas Gel &amp; Acrílico</option>
            <option value="Nail Art de Autor">Nail Art de Autor</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-[#2D2C28] mb-1">
            Texto alternativo descriptivo *
          </label>
          <input
            type="text"
            required
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            placeholder="Ej. Manicura rusa con nivelación en tono arena"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
          />
        </div>

        <div>
          <label className="block font-medium text-[#2D2C28] mb-1">
            Descripción / Pie de foto *
          </label>
          <input
            type="text"
            required
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            placeholder="Descripción que verá la clienta al abrir la foto"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650]"
          >
            Subir y Publicar en la Galería
          </button>
        </div>
      </form>

      {/* Grid de administración de fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((gal) => {
          const media = mediaList.find((m) => m.id === gal.media_id);
          if (!media) return null;
          return (
            <div
              key={gal.id}
              className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] overflow-hidden flex flex-col justify-between text-xs"
            >
              <div className="relative aspect-square bg-[#E3DAC9]">
                <img
                  src={media.storage_path}
                  alt={media.alt_text}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full font-medium ${
                    gal.is_published
                      ? "bg-[#2D2C28] text-[#FAF9F7]"
                      : "bg-[#EBE5D9] text-[#878378]"
                  }`}
                >
                  {gal.is_published ? "Publicada" : "Oculta"}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#878378]">
                    Orden #{gal.sort_order} · {media.style_tag}
                  </span>
                  <p className="font-medium text-[#2D2C28] mt-1">
                    {media.caption}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePublish(gal.id)}
                  className="w-full py-2 rounded-xl bg-[#F1EDE4] border border-[#B6AEA1] text-[#2D2C28] font-medium hover:bg-[#E3DAC9]"
                >
                  {gal.is_published
                    ? "Ocultar de la galería pública"
                    : "Publicar en la galería"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
