import Link from "next/link";
import {
  INITIAL_APPOINTMENTS,
  INITIAL_COURSES,
  INITIAL_COURSE_ENROLLMENTS,
  INITIAL_COURSE_SESSIONS,
  INITIAL_CUSTOMERS,
  INITIAL_PAYMENTS,
  INITIAL_SERVICES,
} from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const totalDeposits = INITIAL_PAYMENTS.filter(
    (p) => p.status === "approved"
  ).reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
            Resumen Operativo
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#2D2C28] mt-1">
            Panel de Administración
          </h1>
          <p className="text-xs text-[#5B5650] mt-1">
            Gestiona tus servicios de uñas, reservas con anticipo del 50%, cursos, galería y clientes desde móvil u ordenador.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/servicios"
            className="px-4 py-2.5 rounded-xl bg-[#E3DAC9] text-[#2D2C28] text-xs font-medium hover:bg-[#B6AEA1]"
          >
            Nuevo Servicio de Uñas
          </Link>
          <Link
            href="/admin/cursos"
            className="px-4 py-2.5 rounded-xl bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650]"
          >
            Nueva Convocatoria de Curso
          </Link>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-1">
          <span className="text-xs text-[#878378]">Citas en Agenda</span>
          <p className="font-serif text-3xl font-semibold text-[#2D2C28]">
            {INITIAL_APPOINTMENTS.length}
          </p>
          <span className="text-[11px] text-[#5B5650] block">
            2 confirmadas con anticipo · 1 pendiente
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#E3DAC9]/60 border border-[#B6AEA1] space-y-1">
          <span className="text-xs text-[#5B5650]">Ingresos Confirmados</span>
          <p className="font-serif text-3xl font-semibold text-[#2D2C28]">
            {totalDeposits.toFixed(2)} €
          </p>
          <span className="text-[11px] text-[#5B5650] block">
            Anticipos del 50% y matrículas de cursos
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-1">
          <span className="text-xs text-[#878378]">Servicios de Uñas Activos</span>
          <p className="font-serif text-3xl font-semibold text-[#2D2C28]">
            {INITIAL_SERVICES.length}
          </p>
          <span className="text-[11px] text-[#5B5650] block">
            Distribuidos en 4 categorías
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-1">
          <span className="text-xs text-[#878378]">Cursos y Alumnas</span>
          <p className="font-serif text-3xl font-semibold text-[#2D2C28]">
            {INITIAL_COURSES.length} cursos · {INITIAL_COURSE_ENROLLMENTS.length} alumnas
          </p>
          <span className="text-[11px] text-[#5B5650] block">
            {INITIAL_COURSE_SESSIONS.length} convocatorias activas
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Próximas citas */}
        <div className="lg:col-span-7 rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              Próximas Reservas en Agenda
            </h2>
            <Link
              href="/admin/reservas"
              className="text-xs font-medium text-[#2D2C28] underline"
            >
              Ver todas las reservas
            </Link>
          </div>

          <div className="space-y-3">
            {INITIAL_APPOINTMENTS.map((apt) => {
              const customer = INITIAL_CUSTOMERS.find(
                (c) => c.id === apt.customer_id
              );
              return (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-[#2D2C28]">
                        {customer?.full_name}
                      </strong>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          apt.status === "confirmed"
                            ? "bg-[#E3DAC9] text-[#2D2C28]"
                            : apt.status === "pending_payment"
                            ? "bg-[#EBE5D9] text-[#878378]"
                            : "bg-[#2D2C28] text-[#FAF9F7]"
                        }`}
                      >
                        {apt.status === "confirmed"
                          ? "Confirmada (50% pagado)"
                          : apt.status === "pending_payment"
                          ? "Pendiente de anticipo"
                          : "Completada"}
                      </span>
                    </div>
                    <p className="text-[#5B5650] font-medium">
                      {apt.service_name_snapshot}
                    </p>
                    <p className="text-[#878378]">
                      Fecha: {new Date(apt.starts_at).toLocaleDateString("es-ES")} · Notas:{" "}
                      {apt.notes || "Sin observaciones"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block font-serif text-base font-semibold text-[#2D2C28]">
                      {apt.price_snapshot} €
                    </span>
                    <span className="text-[11px] text-[#5B5650]">
                      Anticipo: {apt.deposit_required} €
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accesos directos */}
        <div className="lg:col-span-5 rounded-3xl bg-[#F1EDE4] border border-[#E3DAC9] p-6 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
            Gestión Rápida del Estudio
          </h2>
          <div className="grid grid-cols-1 gap-3 text-xs">
            {[
              {
                href: "/admin/servicios",
                title: "Modificar Servicios y Precios",
                desc: "Añade o edita servicios de manicura, gel, acrílico y actualiza sus precios o fotografías.",
              },
              {
                href: "/admin/cursos",
                title: "Modificar Cursos y Convocatorias",
                desc: "Crea nuevos cursos de uñas, ajusta las plazas disponibles y revisa las alumnas inscritas.",
              },
              {
                href: "/admin/galeria",
                title: "Actualizar Galería de Trabajos",
                desc: "Publica nuevas fotografías de uñas realizadas en el estudio y organiza su orden.",
              },
              {
                href: "/admin/clientes",
                title: "Consultar Fichas de Clientas",
                desc: "Revisa todas las citas pasadas, preferencias de diseño y pagos de cada clienta.",
              },
              {
                href: "/admin/configuracion",
                title: "Horarios, Festivos y Datos del Local",
                desc: "Actualiza la dirección del local, teléfono, horario semanal o bloqueos de agenda.",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#E3DAC9] hover:border-[#2D2C28] transition-all block"
              >
                <strong className="font-serif text-sm text-[#2D2C28] block">
                  {card.title}
                </strong>
                <span className="text-[#5B5650] mt-1 block leading-relaxed">
                  {card.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
