"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { NailService, ServiceCategory } from "@/lib/types";

export default function AdminServiciosPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<NailService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("40");
  const [duration, setDuration] = useState("75");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState(
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85"
  );

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      setLoading(true);
      setError(null);

      const [categoriesResult, servicesResult] = await Promise.all([
        supabase
          .from("service_categories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),

        supabase
          .from("services")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (categoriesResult.error || servicesResult.error) {
        console.error(
          "Error cargando catálogo:",
          categoriesResult.error || servicesResult.error
        );
        setError("No se pudieron cargar los servicios.");
        setLoading(false);
        return;
      }

      setCategories(categoriesResult.data ?? []);
      setServices(servicesResult.data ?? []);

      if (categoriesResult.data?.length) {
        setCategoryId(categoriesResult.data[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    if (!name.trim() || !categoryId || !description.trim()) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const serviceData = {
      name: name.trim(),
      category_id: categoryId,
      price: Number(price),
      duration_minutes: Number(duration),
      description: description.trim(),
      image_path: imagePath.trim() || null,
    };

    if (
      !Number.isFinite(serviceData.price) ||
      serviceData.price <= 0 ||
      !Number.isInteger(serviceData.duration_minutes) ||
      serviceData.duration_minutes < 15
    ) {
      alert("Comprueba el precio y la duración.");
      return;
    }

    let result;

    if (editingId) {
      result = await supabase
        .from("services")
        .update(serviceData)
        .eq("id", editingId)
        .select()
        .single();
    } else {
      result = await supabase
        .from("services")
        .insert(serviceData)
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error guardando servicio:", result.error);
      alert("No se pudo guardar el servicio. Comprueba los permisos.");
      return;
    }

    if (editingId) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingId ? result.data as NailService : service
        )
      );
    } else {
      setServices((prev) => [result.data as NailService, ...prev]);
    }

    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("40");
    setDuration("75");
    setImagePath("");
  };

  const handleEditClick = (srv: NailService) => {
    setEditingId(srv.id);
    setName(srv.name);
    setCategoryId(srv.category_id);
    setPrice(String(srv.price));
    setDuration(String(srv.duration_minutes));
    setDescription(srv.description);
    setImagePath(srv.image_path);
  };

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategories((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        name: newCatName,
        description: newCatDesc,
        sort_order: prev.length + 1,
        is_active: true,
      },
    ]);
    setNewCatName("");
    setNewCatDesc("");
  };

  if (loading) {
    return <p className="p-6">Cargando servicios...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
          Catálogo del Estudio
        </span>
        <h1 className="font-serif text-3xl font-semibold text-[#2D2C28] mt-1">
          Gestión de Servicios y Tarifas
        </h1>
        <p className="text-xs text-[#5B5650] mt-1">
          Añade nuevos servicios de uñas, modifica precios (el anticipo del 50% se calcula automáticamente), ajusta la duración o activa y oculta tratamientos en la web.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulario */}
        <form
          onSubmit={handleSaveService}
          className="lg:col-span-5 rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4 text-xs"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              {editingId ? "Editar Servicio" : "Añadir Nuevo Servicio"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setDescription("");
                }}
                className="text-[#878378] underline"
              >
                Cancelar edición
              </button>
            )}
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Nombre del servicio *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Nivelación Builder Gel + Francesa"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Categoría *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Precio Total (€) *
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              />
              <span className="text-[10px] text-[#878378] mt-1 block">
                Anticipo 50%: {(Number(price || 0) / 2).toFixed(2)} €
              </span>
            </div>

            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Duración (minutos) *
              </label>
              <input
                type="number"
                min="15"
                step="5"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Descripción del servicio *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica en qué consiste el tratamiento..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              URL o ruta de fotografía
            </label>
            <input
              type="text"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] transition-colors"
          >
            {editingId ? "Guardar Cambios" : "Publicar Servicio"}
          </button>
        </form>

        {/* Listado */}
        <div className="lg:col-span-7 space-y-4">
          {services.map((srv) => {
            const cat = categories.find((c) => c.id === srv.category_id);
            return (
              <div
                key={srv.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${srv.is_active
                  ? "bg-[#FAF9F7] border-[#EBE5D9]"
                  : "bg-[#F1EDE4]/60 border-[#EBE5D9] opacity-70"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={srv.image_path}
                    alt={srv.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#B6AEA1] shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-semibold text-[#2D2C28]">
                        {srv.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${srv.is_active
                          ? "bg-[#E3DAC9] text-[#2D2C28]"
                          : "bg-[#EBE5D9] text-[#878378]"
                          }`}
                      >
                        {srv.is_active ? "Visible en web" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-[#878378]">
                      Categoría: {cat?.name} · {srv.duration_minutes} min
                    </p>
                    <p className="text-[#5B5650] line-clamp-2">{srv.description}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0 text-xs">
                  <div className="text-right">
                    <strong className="font-serif text-lg text-[#2D2C28] block">
                      {srv.price} €
                    </strong>
                    <span className="text-[10px] text-[#878378]">
                      Anticipo 50%: {(srv.price / 2).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(srv)}
                      className="px-3 py-1.5 rounded-lg bg-[#F1EDE4] border border-[#B6AEA1] text-[#2D2C28] font-medium hover:bg-[#E3DAC9]"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleServiceActive(srv.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF9F7] border border-[#EBE5D9] text-[#5B5650] hover:text-[#2D2C28]"
                    >
                      {srv.is_active ? "Ocultar" : "Activar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categorías */}
      <div className="rounded-3xl bg-[#F7F4EF] border border-[#EBE5D9] p-6 space-y-4">
        <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
          Categorías de Servicios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EBE5D9] text-xs space-y-1"
            >
              <span className="text-[10px] font-mono text-[#878378]">
                Orden #{cat.sort_order}
              </span>
              <strong className="block text-[#2D2C28] font-serif text-sm">
                {cat.name}
              </strong>
              <p className="text-[#5B5650]">{cat.description}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleAddCategory}
          className="pt-3 border-t border-[#EBE5D9] flex flex-col sm:flex-row gap-3 text-xs"
        >
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Nueva categoría (ej. Pedicura Rusa Estética)"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
          />
          <input
            type="text"
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
            placeholder="Descripción breve de la categoría"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium shrink-0"
          >
            Añadir Categoría
          </button>
        </form>
      </div>
    </div>
  );
}
