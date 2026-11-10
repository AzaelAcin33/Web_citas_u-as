"use client";

import { useState } from "react";
import {
  INITIAL_BUSINESS_HOURS,
  INITIAL_BUSINESS_SETTINGS,
} from "@/lib/mock-data";

export default function ContactoPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="rounded-3xl bg-[#E3DAC9]/70 border border-[#B6AEA1]/40 p-8 sm:p-12">
        <span className="text-xs uppercase tracking-[0.2em] text-[#5B5650] font-semibold">
          Ubicación del Nuevo Local y Atención Directa
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#2D2C28] mt-2">
          Contacto, Horarios y Mapa
        </h1>
        <p className="text-sm text-[#5B5650] mt-2 max-w-2xl">
          Escríbenos directamente por WhatsApp para consultas rápidas sobre diseños o formaciones, o visítanos en nuestra nueva ubicación.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              Datos de Contacto
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F4EF] border border-[#EBE5D9]">
                <span className="text-[#878378] block">Dirección del nuevo local</span>
                <strong className="text-[#2D2C28] text-sm">
                  {INITIAL_BUSINESS_SETTINGS.address}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F4EF] border border-[#EBE5D9] flex items-center justify-between">
                <div>
                  <span className="text-[#878378] block">Teléfono y WhatsApp</span>
                  <strong className="text-[#2D2C28] text-sm">
                    {INITIAL_BUSINESS_SETTINGS.phone}
                  </strong>
                </div>
                <a
                  href={INITIAL_BUSINESS_SETTINGS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650]"
                >
                  Abrir WhatsApp
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F4EF] border border-[#EBE5D9]">
                <span className="text-[#878378] block">Correo electrónico</span>
                <strong className="text-[#2D2C28] text-sm">
                  {INITIAL_BUSINESS_SETTINGS.email}
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              Horario Habitual
            </h2>
            <ul className="space-y-2 text-xs">
              {INITIAL_BUSINESS_HOURS.map((bh) => (
                <li
                  key={bh.id}
                  className="flex justify-between py-1.5 border-b border-[#EBE5D9]"
                >
                  <span className="font-medium text-[#2D2C28]">{bh.weekday_label}</span>
                  <span className="text-[#5B5650]">
                    {bh.is_closed
                      ? "Cerrado"
                      : `${bh.opens_at} - ${bh.closes_at}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mapa y Formulario de consulta */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl overflow-hidden border border-[#EBE5D9] bg-[#F1EDE4] h-72">
            <iframe
              title="Mapa de ubicación del nuevo local"
              src={INITIAL_BUSINESS_SETTINGS.maps_url}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              Envíanos una consulta
            </h2>
            {sent ? (
              <div className="p-4 rounded-2xl bg-[#E3DAC9] text-[#2D2C28] text-xs font-medium">
                Hemos recibido tu mensaje. Te responderemos lo antes posible por correo o WhatsApp.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
              >
                <div>
                  <label className="block font-medium text-[#2D2C28] mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2D2C28] mb-1">
                    Teléfono o Email *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+34 600 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#2D2C28] mb-1">
                    Mensaje o consulta sobre servicios / cursos *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Escribe aquí tu consulta..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650]"
                  >
                    Enviar Consulta
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
