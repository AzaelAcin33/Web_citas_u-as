"use client";

import { useState } from "react";
import {
  INITIAL_APPOINTMENTS,
  INITIAL_COURSES,
  INITIAL_COURSE_ENROLLMENTS,
  INITIAL_COURSE_SESSIONS,
  INITIAL_CUSTOMERS,
} from "@/lib/mock-data";

export default function AdminClientesPage() {
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    INITIAL_CUSTOMERS[0].id
  );

  const filteredCustomers = INITIAL_CUSTOMERS.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const activeCustomer =
    INITIAL_CUSTOMERS.find((c) => c.id === selectedCustomerId) ||
    INITIAL_CUSTOMERS[0];

  const customerAppointments = INITIAL_APPOINTMENTS.filter(
    (a) => a.customer_id === activeCustomer.id
  );

  const customerEnrollments = INITIAL_COURSE_ENROLLMENTS.filter(
    (e) => e.customer_id === activeCustomer.id
  );

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
          Base de Clientas
        </span>
        <h1 className="font-serif text-3xl font-semibold text-[#2D2C28] mt-1">
          Directorio de Clientas e Historial
        </h1>
        <p className="text-xs text-[#5B5650] mt-1">
          Consulta las fichas de clientas (tanto con cuenta registrada como reservas sin registro) y revisa su historial completo de uñas y cursos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista de clientes */}
        <div className="lg:col-span-5 rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-5 space-y-4 text-xs">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar clienta por nombre, teléfono o email..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
          />

          <div className="space-y-2">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === activeCustomer.id;
              return (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-[#E3DAC9] border-[#2D2C28]"
                      : "bg-[#F7F4EF] border-[#EBE5D9] hover:border-[#B6AEA1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-serif text-sm text-[#2D2C28]">
                      {cust.full_name}
                    </strong>
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF9F7] text-[10px] text-[#5B5650]">
                      {cust.profile_id ? "Con cuenta web" : "Sin cuenta"}
                    </span>
                  </div>
                  <p className="text-[#5B5650] mt-1">
                    {cust.phone} · {cust.email}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Historial detallado */}
        <div className="lg:col-span-7 rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-6 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EBE5D9] pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#878378]">
                Ficha de Clienta
              </span>
              <h2 className="font-serif text-2xl font-semibold text-[#2D2C28] mt-0.5">
                {activeCustomer.full_name}
              </h2>
              <p className="text-[#5B5650]">
                Tel: {activeCustomer.phone} · Email: {activeCustomer.email}
              </p>
            </div>
            <a
              href={`https://wa.me/${activeCustomer.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium"
            >
              Contactar por WhatsApp
            </a>
          </div>

          {/* Historial de citas */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
              Historial de Reservas de Uñas ({customerAppointments.length})
            </h3>
            {customerAppointments.length === 0 ? (
              <p className="text-[#878378]">No tiene citas registradas todavía.</p>
            ) : (
              customerAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-1.5"
                >
                  <div className="flex justify-between">
                    <strong className="text-[#2D2C28] text-sm">
                      {apt.service_name_snapshot}
                    </strong>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E3DAC9] text-[#2D2C28] font-medium">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-[#5B5650]">
                    Fecha: {new Date(apt.starts_at).toLocaleDateString("es-ES")} · Precio:{" "}
                    <strong>{apt.price_snapshot} €</strong> (Anticipo 50%:{" "}
                    {apt.deposit_required} €)
                  </p>
                  <p className="text-[#878378]">
                    Preferencias / Notas: {apt.notes || "Sin notas"}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Historial de cursos */}
          <div className="space-y-3 pt-2 border-t border-[#EBE5D9]">
            <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
              Inscripciones a Cursos ({customerEnrollments.length})
            </h3>
            {customerEnrollments.length === 0 ? (
              <p className="text-[#878378]">
                No se ha inscrito en ningún curso todavía.
              </p>
            ) : (
              customerEnrollments.map((enr) => {
                const session = INITIAL_COURSE_SESSIONS.find(
                  (s) => s.id === enr.course_session_id
                );
                const course = INITIAL_COURSES.find(
                  (c) => c.id === session?.course_id
                );
                return (
                  <div
                    key={enr.id}
                    className="p-4 rounded-2xl bg-[#F1EDE4] border border-[#E3DAC9] flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-[#2D2C28] block">
                        {course?.name}
                      </strong>
                      <span className="text-[#5B5650]">
                        Importe abonado: {enr.price_snapshot} €
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#2D2C28] text-[#FAF9F7]">
                      {enr.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
