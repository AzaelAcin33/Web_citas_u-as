"use client";

import { useState } from "react";
import {
  INITIAL_COURSES,
  INITIAL_COURSE_CATEGORIES,
  INITIAL_COURSE_SESSIONS,
} from "@/lib/mock-data";

export default function CursosPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [studentPhone, setStudentPhone] = useState<string>("");
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<boolean>(false);

  const filteredCourses = INITIAL_COURSES.filter(
    (c) =>
      c.is_active &&
      (selectedCategoryId === "all" || c.category_id === selectedCategoryId)
  );

  const activeSession = INITIAL_COURSE_SESSIONS.find(
    (s) => s.id === selectedSessionId
  );
  const activeCourse = activeSession
    ? INITIAL_COURSES.find((c) => c.id === activeSession.course_id)
    : null;

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollmentSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Cabecera */}
      <div className="rounded-3xl bg-[#E3DAC9]/70 border border-[#B6AEA1]/40 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5B5650] font-semibold">
            Formación Profesional Certificada
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#2D2C28]">
            Cursos de Uñas e Inscripción Online
          </h1>
          <p className="text-sm sm:text-base text-[#5B5650] leading-relaxed">
            Grupos reducidos de 4 a 8 alumnas por edición para garantizar corrección postural y seguimiento técnico personalizado en cada práctica. Elige tu curso y reserva plaza directamente en la convocatoria que prefieras.
          </p>
        </div>
        <div className="lg:col-span-4 bg-[#FAF9F7] p-6 rounded-2xl border border-[#E3DAC9] space-y-3 text-xs">
          <h2 className="font-serif text-base font-semibold text-[#2D2C28]">
            Qué incluyen nuestras formaciones
          </h2>
          <ul className="space-y-2 text-[#5B5650]">
            <li>- Dossier teórico-técnico impreso y digital</li>
            <li>- Todo el material y aparatología de trabajo en clase</li>
            <li>- Práctica real supervisada y certificado acreditativo</li>
            <li>- Seguimiento y resolución de dudas tras finalizar</li>
          </ul>
        </div>
      </div>

      {/* Filtro por categoría */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategoryId("all")}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
            selectedCategoryId === "all"
              ? "bg-[#2D2C28] text-[#FAF9F7]"
              : "bg-[#F7F4EF] text-[#5B5650] border border-[#EBE5D9] hover:bg-[#E3DAC9]"
          }`}
        >
          Todos los Cursos
        </button>
        {INITIAL_COURSE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              selectedCategoryId === cat.id
                ? "bg-[#2D2C28] text-[#FAF9F7]"
                : "bg-[#F7F4EF] text-[#5B5650] border border-[#EBE5D9] hover:bg-[#E3DAC9]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Listado de Cursos y Convocatorias */}
      <div className="space-y-8">
        {filteredCourses.map((course) => {
          const sessions = INITIAL_COURSE_SESSIONS.filter(
            (s) => s.course_id === course.id
          );
          return (
            <article
              key={course.id}
              className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xs"
            >
              <div className="lg:col-span-4 bg-[#E3DAC9] relative min-h-[260px]">
                <img
                  src={course.image_path}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium">
                    {course.modality}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF9F7]/95 text-[#2D2C28] text-xs font-medium">
                    {course.duration_hours} horas
                  </span>
                </div>
              </div>

              <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-wider text-[#878378] font-semibold">
                      Nivel: {course.level} {course.includes_kit ? "· Kit profesional incluido" : ""}
                    </span>
                    <span className="font-serif text-2xl font-semibold text-[#2D2C28]">
                      {course.price} €
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-semibold text-[#2D2C28]">
                    {course.name}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5B5650] leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2D2C28] mb-2">
                      Contenidos del programa:
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.syllabus.map((item) => (
                        <li
                          key={item}
                          className="text-xs text-[#5B5650] flex items-start gap-2"
                        >
                          <span className="text-[#2D2C28] font-bold">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Convocatorias */}
                <div className="pt-5 border-t border-[#EBE5D9] space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2D2C28]">
                    Próximas convocatorias disponibles:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sessions.map((session) => {
                      const available = session.capacity - session.enrolled_count;
                      const isFull = session.status === "full" || available <= 0;

                      return (
                        <div
                          key={session.id}
                          className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] flex items-center justify-between gap-3"
                        >
                          <div className="text-xs space-y-0.5">
                            <p className="font-semibold text-[#2D2C28]">
                              {new Date(session.starts_at).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-[#878378] text-[11px]">
                              {session.location}
                            </p>
                            <p className="text-[11px] font-medium text-[#5B5650]">
                              {isFull
                                ? "Plazas agotadas"
                                : `Plazas libres: ${available} de ${session.capacity}`}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={isFull}
                            onClick={() => {
                              setSelectedSessionId(session.id);
                              setEnrollmentSuccess(false);
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                              isFull
                                ? "bg-[#EBE5D9] text-[#878378] cursor-not-allowed"
                                : "bg-[#2D2C28] text-[#FAF9F7] hover:bg-[#5B5650]"
                            }`}
                          >
                            {isFull ? "Completo" : "Inscribirme"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal de Inscripción */}
      {activeSession && activeCourse && (
        <div className="fixed inset-0 z-50 bg-[#2D2C28]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F7] border-2 border-[#E3DAC9] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#878378] font-semibold">
                  Reserva de Plaza
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#2D2C28] mt-1">
                  {activeCourse.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSessionId(null)}
                className="px-3 py-1.5 rounded-full bg-[#F1EDE4] text-[#2D2C28] hover:bg-[#E3DAC9] text-xs font-medium"
              >
                Cerrar
              </button>
            </div>

            {enrollmentSuccess ? (
              <div className="p-6 rounded-2xl bg-[#F1EDE4] border border-[#B6AEA1] space-y-4 text-xs">
                <p className="text-sm font-serif font-semibold text-[#2D2C28]">
                  Inscripción confirmada para {studentName}
                </p>
                <p className="text-[#5B5650] leading-relaxed">
                  Hemos registrado tu plaza en la convocatoria del{" "}
                  <strong>
                    {new Date(activeSession.starts_at).toLocaleDateString("es-ES")}
                  </strong>{" "}
                  y enviado el comprobante a tu correo electrónico.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedSessionId(null)}
                  className="w-full py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium"
                >
                  Finalizar
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnrollmentSubmit} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F1EDE4] border border-[#E3DAC9] space-y-1">
                  <p>
                    <strong>Convocatoria:</strong>{" "}
                    {new Date(activeSession.starts_at).toLocaleDateString("es-ES")} ·{" "}
                    {activeCourse.modality}
                  </p>
                  <p>
                    <strong>Importe de inscripción:</strong>{" "}
                    {activeCourse.price} €
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-[#2D2C28] mb-1">
                    Nombre completo de la alumna *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Nombre y apellidos para el certificado"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#2D2C28] mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="alumna@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#2D2C28] mb-1">
                    Teléfono móvil (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+34 600 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSessionId(null)}
                    className="flex-1 py-3 rounded-xl border border-[#B6AEA1] text-[#5B5650] font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650]"
                  >
                    Confirmar Plaza ({activeCourse.price} €)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
