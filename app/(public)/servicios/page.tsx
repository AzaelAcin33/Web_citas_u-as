"use client";

import Link from "next/link";
import { useState } from "react";
import {
  INITIAL_SERVICES,
  INITIAL_SERVICE_CATEGORIES,
} from "@/lib/mock-data";

export default function ServiciosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const activeCategories = INITIAL_SERVICE_CATEGORIES.filter((c) => c.is_active).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const filteredServices = INITIAL_SERVICES.filter((srv) => {
    if (!srv.is_active) return false;
    const matchesCat =
      selectedCategory === "all" || srv.category_id === selectedCategory;
    const matchesQuery =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Cabecera */}
      <div className="rounded-3xl bg-[#E3DAC9]/70 border border-[#B6AEA1]/40 p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5B5650] font-semibold">
            Carta de Tratamientos
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#2D2C28]">
            Servicios de Manicura, Nivelación y Uñas Esculpidas
          </h1>
          <p className="text-sm sm:text-base text-[#5B5650] leading-relaxed">
            Todos nuestros servicios incluyen diagnóstico previo de la lámina natural y esterilización en autoclave. Para confirmar tu cita online se abona únicamente el{" "}
            <strong className="text-[#2D2C28]">50% de anticipo</strong>; el resto se abona en el salón.
          </p>
        </div>
      </div>

      {/* Filtros de categoría y buscador */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#F7F4EF] p-4 rounded-2xl border border-[#EBE5D9]">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-[#2D2C28] text-[#FAF9F7]"
                : "bg-[#FAF9F7] text-[#5B5650] border border-[#EBE5D9] hover:bg-[#E3DAC9]"
            }`}
          >
            Todos los servicios ({INITIAL_SERVICES.length})
          </button>
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#2D2C28] text-[#FAF9F7]"
                  : "bg-[#FAF9F7] text-[#5B5650] border border-[#EBE5D9] hover:bg-[#E3DAC9]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar servicio (rusa, gel, acrílico, french...)"
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1] text-xs text-[#2D2C28] placeholder:text-[#878378] focus:outline-none focus:ring-2 focus:ring-[#2D2C28]"
          />
        </div>
      </div>

      {/* Listado de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredServices.map((service) => {
          const category = activeCategories.find(
            (c) => c.id === service.category_id
          );
          const deposit = (service.price / 2).toFixed(2);

          return (
            <article
              key={service.id}
              className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] overflow-hidden flex flex-col sm:flex-row hover:border-[#B6AEA1] transition-all shadow-2xs"
            >
              <div className="sm:w-56 h-60 sm:h-auto relative bg-[#E3DAC9] shrink-0">
                <img
                  src={service.image_path}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                {service.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-[11px] font-medium">
                    {service.badge}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#878378]">
                    <span className="font-medium text-[#5B5650]">
                      {category?.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F1EDE4] text-[#2D2C28] font-medium">
                      {service.duration_minutes} min
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
                    {service.name}
                  </h2>

                  <p className="text-xs text-[#5B5650] leading-relaxed">
                    {service.description}
                  </p>

                  {service.includes && (
                    <ul className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {service.includes.map((inc) => (
                        <li
                          key={inc}
                          className="text-[11px] text-[#5B5650] flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2D2C28] shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-[#EBE5D9] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[11px] text-[#878378] block">
                        Precio del servicio
                      </span>
                      <span className="font-serif text-2xl font-semibold text-[#2D2C28]">
                        {service.price.toFixed(2)} €
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-[#F1EDE4] border border-[#E3DAC9]">
                      <span className="text-[10px] uppercase tracking-wider text-[#878378] block">
                        Anticipo 50%
                      </span>
                      <span className="text-xs font-semibold text-[#2D2C28]">
                        {deposit} € al reservar
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/reservas?service=${service.id}`}
                    className="px-5 py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650] transition-colors"
                  >
                    Reservar Cita
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Información práctica */}
      <div className="rounded-2xl bg-[#F1EDE4] border border-[#E3DAC9] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#5B5650]">
        <div>
          <strong className="text-[#2D2C28] block text-sm font-serif mb-1">
            Asesoramiento en Cabina
          </strong>
          Si tienes dudas sobre qué estructura necesita tu uña natural, selecciona el servicio que más se acerque y te asesoraremos personalmente antes de empezar.
        </div>
        <div>
          <strong className="text-[#2D2C28] block text-sm font-serif mb-1">
            Retirada de Otro Centro
          </strong>
          Durante el proceso de reserva podrás indicar si llevas material de otro salón para que reservemos el tiempo necesario de retirada segura.
        </div>
        <div>
          <strong className="text-[#2D2C28] block text-sm font-serif mb-1">
            Condiciones del Anticipo (50%)
          </strong>
          El anticipo del 50% se descuenta íntegramente del total de tu servicio. Puedes modificar tu cita avisando con al menos 24 horas de antelación.
        </div>
      </div>
    </div>
  );
}
