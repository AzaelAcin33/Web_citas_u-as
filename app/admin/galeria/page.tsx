"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { GalleryItem, MediaItem } from "@/lib/types";

export default function AdminGaleriaPage() {
  const supabase = createClient();

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newAlt, setNewAlt] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newTag, setNewTag] = useState("Clean Nails & Nude");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;

    const { data } = supabase.storage
      .from("business-media")
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const loadGallery = async () => {
    setLoading(true);

    const { data: gallery, error: galleryError } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (galleryError) {
      setMessage("Error al cargar la galería: " + galleryError.message);
      setLoading(false);
      return;
    }

    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("*");

    if (mediaError) {
      setMessage("Error al cargar las fotografías: " + mediaError.message);
      setLoading(false);
      return;
    }

    setGalleryItems(gallery ?? []);
    setMediaList(media ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleUploadMedia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage("Selecciona una fotografía.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setMessage("La imagen no puede superar los 10 MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Formato no permitido.");
      return;
    }

    setUploading(true);
    setMessage("");

    const fileExtension = selectedFile.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("business-media")
      .upload(filePath, selectedFile);

    if (uploadError) {
      setMessage("Error al subir la imagen: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: mediaData, error: mediaError } = await supabase
      .from("media")
      .insert({
        storage_path: filePath,
        alt_text: newAlt,
        caption: newCaption,
        media_type: "image",
        style_tag: newTag,
      })
      .select()
      .single();

    if (mediaError) {
      setMessage("Error al guardar la fotografía: " + mediaError.message);
      setUploading(false);
      return;
    }

    const nextOrder =
      galleryItems.length > 0
        ? Math.max(...galleryItems.map((item) => item.sort_order)) + 1
        : 1;

    const { error: galleryError } = await supabase
      .from("gallery_items")
      .insert({
        media_id: mediaData.id,
        sort_order: nextOrder,
        is_published: true,
      });

    if (galleryError) {
      setMessage("La imagen se subió, pero no se pudo añadir a la galería: " + galleryError.message);
      setUploading(false);
      return;
    }

    setSelectedFile(null);
    setNewAlt("");
    setNewCaption("");

    await loadGallery();

    setMessage("¡Fotografía subida y publicada correctamente!");
    setUploading(false);
  };

  const togglePublish = async (galId: string) => {
    const item = galleryItems.find((g) => g.id === galId);
    if (!item) return;

    const { error } = await supabase
      .from("gallery_items")
      .update({ is_published: !item.is_published })
      .eq("id", galId);

    if (error) {
      setMessage("Error al actualizar: " + error.message);
      return;
    }

    await loadGallery();
  };

  const deletePhoto = async (galId: string) => {
    const galleryItem = galleryItems.find((item) => item.id === galId);

    if (!galleryItem) return;

    const media = mediaList.find(
      (item) => item.id === galleryItem.media_id
    );

    if (!media) {
      setMessage("No se ha encontrado la fotografía.");
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta fotografía? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    setDeletingId(galId);
    setMessage("");

    // Eliminar primero la entrada de la galería
    const { error: galleryError } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", galId);

    if (galleryError) {
      setMessage("Error al eliminar de la galería: " + galleryError.message);
      setDeletingId(null);
      return;
    }

    // Comprobar si otra entrada utiliza todavía esta imagen
    const { data: remainingItems, error: checkError } = await supabase
      .from("gallery_items")
      .select("id")
      .eq("media_id", media.id);

    if (checkError) {
      setMessage(
        "La fotografía se ha quitado de la galería, pero no se pudo comprobar si sigue utilizándose."
      );
      setDeletingId(null);
      await loadGallery();
      return;
    }

    // Solo borrar el archivo y el registro si ya no tiene referencias
    if (!remainingItems || remainingItems.length === 0) {
      const { error: mediaError } = await supabase
        .from("media")
        .delete()
        .eq("id", media.id);

      if (mediaError) {
        setMessage("Se quitó de la galería, pero no se pudo eliminar su registro: " + mediaError.message);
        setDeletingId(null);
        await loadGallery();
        return;
      }

      if (!media.storage_path.startsWith("http")) {
        const { error: storageError } = await supabase.storage
          .from("business-media")
          .remove([media.storage_path]);

        if (storageError) {
          setMessage("Se eliminó el registro, pero no se pudo borrar el archivo: " + storageError.message);
          setDeletingId(null);
          await loadGallery();
          return;
        }
      }
    }

    await loadGallery();

    setMessage("Fotografía eliminada correctamente.");
    setDeletingId(null);
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
            Seleccionar fotografía *
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
          />

          <p className="text-[10px] text-[#878378] mt-1">
            JPEG, PNG, WEBP o AVIF. Máximo 10 MB.
          </p>
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
            disabled={uploading}
            className="px-6 py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650]"
          >
            {uploading ? "Subiendo fotografía..." : "Subir y Publicar en la Galería"}
          </button>
        </div>
      </form>

      {message && (
        <p className="rounded-xl bg-[#F1EDE4] p-4 text-sm text-[#2D2C28]">
          {message}
        </p>
      )}

      {loading && (
        <p className="text-sm text-[#5B5650]">
          Cargando fotografías...
        </p>
      )}

      {!loading && galleryItems.length === 0 && (
        <p className="text-sm text-[#5B5650]">
          Todavía no hay fotografías en la galería.
        </p>
      )}

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
                  src={getImageUrl(media.storage_path)}
                  alt={media.alt_text ?? ""}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full font-medium ${gal.is_published
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
                <button
                  type="button"
                  disabled={deletingId === gal.id}
                  onClick={() => deletePhoto(gal.id)}
                  className="w-full py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium hover:bg-red-100 disabled:opacity-50"
                >
                  {deletingId === gal.id ? "Eliminando..." : "Eliminar fotografía"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
