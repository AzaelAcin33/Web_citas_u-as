"use client";

import { useState } from "react";
import {
  INITIAL_AVAILABILITY_EXCEPTIONS,
  INITIAL_BUSINESS_HOURS,
  INITIAL_BUSINESS_SETTINGS,
} from "@/lib/mock-data";

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState(INITIAL_BUSINESS_SETTINGS);
  const [hours, setHours] = useState(INITIAL_BUSINESS_HOURS);
  const [exceptions, setExceptions] = useState(INITIAL_AVAILABILITY_EXCEPTIONS);
  const [excStart, setExcStart] = useState("2026-12-24");
  const [excEnd, setExcEnd] = useState("2026-12-25");
  const [excReason, setExcReason] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddException = (e: React.FormEvent) => {
    e.preventDefault();
    setExceptions((prev) => [
      ...prev,
      {
        id: `exc-${Date.now()}`,
        starts_at: `${excStart}T00:00:00Z`,
        ends_at: `${excEnd}T23:59:00Z`,
        reason: excReason || "Cierre puntual de agenda",
        created_by: "admin-01",
      },
    ]);
    setExcReason("");
  };

  return (
    <div className="space-y-10 text-xs">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
          Ajustes Generales
        </span>
        <h1 className="font-serif text-3xl font-semibold text-[#2D2C28] mt-1">
          Configuración del Negocio, Horarios y Permisos
        </h1>
        <p className="text-[#5B5650] mt-1">
          Edita la información pública del estudio de uñas, la dirección del nuevo local, los horarios de apertura y los bloqueos por vacaciones o festivos.
        </p>
      </div>

      {/* 1. Datos públicos del negocio */}
      <form
        onSubmit={handleSaveBusiness}
        className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 sm:p-8 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
            1. Información Pública del Estudio
          </h2>
          {savedNotice && (
            <span className="px-3 py-1 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium">
              Cambios guardados correctamente
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Nombre comercial
            </label>
            <input
              type="text"
              value={settings.business_name}
              onChange={(e) =>
                setSettings({ ...settings, business_name: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Teléfono público
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Enlace directo de WhatsApp
            </label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#2D2C28] mb-1">
              Dirección del nuevo local
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-[#2D2C28] mb-1">
              Texto de presentación
            </label>
            <textarea
              rows={2}
              value={settings.description}
              onChange={(e) =>
                setSettings({ ...settings, description: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650]"
          >
            Guardar Datos del Negocio
          </button>
        </div>
      </form>

      {/* 2. Horarios y Excepciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
            2. Horario Habitual Semanal
          </h2>
          <div className="space-y-2.5">
            {hours.map((bh, idx) => (
              <div
                key={bh.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F7F4EF] border border-[#EBE5D9]"
              >
                <span className="font-semibold text-[#2D2C28] w-24">
                  {bh.weekday_label}
                </span>
                {bh.is_closed ? (
                  <span className="text-[#878378]">Cerrado todo el día</span>
                ) : (
                  <span className="text-[#5B5650]">
                    {bh.opens_at} a {bh.closes_at}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setHours((prev) =>
                      prev.map((item, i) =>
                        i === idx
                          ? {
                              ...item,
                              is_closed: !item.is_closed,
                              opens_at: item.is_closed ? "09:30" : null,
                              closes_at: item.is_closed ? "20:00" : null,
                            }
                          : item
                      )
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-[#FAF9F7] border border-[#B6AEA1] text-[#2D2C28]"
                >
                  {bh.is_closed ? "Abrir día" : "Marcar cerrado"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Excepciones */}
        <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
            3. Cierres Puntuales y Festivos
          </h2>
          <form onSubmit={handleAddException} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#2D2C28] mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  required
                  value={excStart}
                  onChange={(e) => setExcStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#2D2C28] mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  required
                  value={excEnd}
                  onChange={(e) => setExcEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Motivo del bloqueo
              </label>
              <input
                type="text"
                required
                value={excReason}
                onChange={(e) => setExcReason(e.target.value)}
                placeholder="Ej. Vacaciones de Navidad o Curso Presencial"
                className="w-full px-3.5 py-2 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium"
            >
              Bloquear Fechas en la Agenda
            </button>
          </form>

          <div className="space-y-2 pt-2 border-t border-[#EBE5D9]">
            {exceptions.map((exc) => (
              <div
                key={exc.id}
                className="p-3 rounded-xl bg-[#F7F4EF] border border-[#EBE5D9] flex justify-between items-center"
              >
                <div>
                  <strong className="text-[#2D2C28] block">{exc.reason}</strong>
                  <span className="text-[#878378]">
                    {new Date(exc.starts_at).toLocaleDateString("es-ES")} -{" "}
                    {new Date(exc.ends_at).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setExceptions((prev) => prev.filter((e) => e.id !== exc.id))
                  }
                  className="text-[#878378] hover:text-[#2D2C28]"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Permisos */}
      <div className="rounded-3xl bg-[#F1EDE4] border border-[#E3DAC9] p-6 space-y-2">
        <h2 className="font-serif text-lg font-semibold text-[#2D2C28]">
          Niveles de Acceso y Seguridad
        </h2>
        <p className="text-[#5B5650] leading-relaxed">
          La cuenta de la <strong>propietaria (admin)</strong> dispone de control completo sobre los servicios, precios, cursos, agenda de citas, galería y datos del local, mientras que la gestión de permisos técnicos del sistema permanece reservada exclusivamente al perfil de <strong>superadministrador</strong>.
        </p>
      </div>
    </div>
  );
}
