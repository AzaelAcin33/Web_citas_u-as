"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type {
  CourseCategory,
  CourseModality,
  CourseSession,
  NailCourse,
} from "@/lib/types";

interface EnrollmentForm {
  name: string;
  email: string;
  phone: string;
}

export default function CursosPage() {
  const supabase = createClient();

  const [courses, setCourses] = useState<NailCourse[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [enrolledCounts, setEnrolledCounts] = useState<Record<string, number>>(
    {}
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  const [student, setStudent] = useState<EnrollmentForm>({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    const [coursesResult, categoriesResult, sessionsResult, enrollmentsResult] =
      await Promise.all([
        supabase
          .from("courses")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),

        supabase
          .from("course_categories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),

        supabase
          .from("course_sessions")
          .select("*")
          .eq("status", "open")
          .order("starts_at"),

        supabase
          .from("course_enrollments")
          .select("course_session_id, status")
          .in("status", ["pending", "confirmed"]),
      ]);

    const loadError =
      coursesResult.error ||
      categoriesResult.error ||
      sessionsResult.error ||
      enrollmentsResult.error;

    if (loadError) {
      setError("No se pudieron cargar los cursos. Inténtalo de nuevo.");
      setLoading(false);
      return;
    }

    setCourses((coursesResult.data || []) as NailCourse[]);
    setCategories((categoriesResult.data || []) as CourseCategory[]);
    setSessions((sessionsResult.data || []) as CourseSession[]);

    const counts: Record<string, number> = {};

    (enrollmentsResult.data || []).forEach((enrollment) => {
      counts[enrollment.course_session_id] =
        (counts[enrollment.course_session_id] || 0) + 1;
    });

    setEnrolledCounts(counts);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("payment") === "cancelled") {
      setError("El pago se ha cancelado. Puedes intentarlo de nuevo.");
    }

    if (params.get("payment") === "success") {
      setError(
        "Hemos recibido la vuelta de Stripe. Estamos verificando tu pago; la inscripción solo quedará confirmada cuando recibamos la confirmación del servidor."
      );
    }
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      selectedCategoryId === "all" ||
      course.category_id === selectedCategoryId
  );

  const activeSession = sessions.find(
    (session) => session.id === selectedSessionId
  );

  const activeCourse = activeSession
    ? courses.find((course) => course.id === activeSession.course_id)
    : null;

  const handleEnrollmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSessionId) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/courses/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          fullName: student.name,
          email: student.email,
          phone: student.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "No se pudo iniciar el pago.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ha ocurrido un error al procesar la inscripción."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="rounded-3xl bg-[#E3DAC9]/70 border border-[#B6AEA1]/40 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5B5650] font-semibold">
            Formación Profesional Certificada
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#2D2C28]">
            Cursos de Uñas e Inscripción Online
          </h1>

          <p className="text-sm sm:text-base text-[#5B5650] leading-relaxed">
            Grupos reducidos para garantizar seguimiento técnico personalizado.
            Elige tu curso y reserva tu plaza.
          </p>
        </div>

        <div className="lg:col-span-4 bg-[#FAF9F7] p-6 rounded-2xl border border-[#E3DAC9] space-y-3 text-xs">
          <h2 className="font-serif text-base font-semibold text-[#2D2C28]">
            Qué incluyen nuestras formaciones
          </h2>

          <ul className="space-y-2 text-[#5B5650]">
            <li>· Dossier teórico-técnico</li>
            <li>· Material de trabajo en clase</li>
            <li>· Práctica supervisada</li>
            <li>· Seguimiento personalizado</li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategoryId("all")}
          className={`px-4 py-2 rounded-full text-xs font-medium ${
            selectedCategoryId === "all"
              ? "bg-[#2D2C28] text-[#FAF9F7]"
              : "bg-[#F7F4EF] text-[#5B5650] border border-[#EBE5D9]"
          }`}
        >
          Todos los Cursos
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategoryId(category.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium ${
              selectedCategoryId === category.id
                ? "bg-[#2D2C28] text-[#FAF9F7]"
                : "bg-[#F7F4EF] text-[#5B5650] border border-[#EBE5D9]"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {loading ? (
          <p className="text-sm text-[#878378]">Cargando cursos...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-sm text-[#878378]">
            No hay cursos publicados en este momento.
          </p>
        ) : (
          filteredCourses.map((course) => {
            const courseSessions = sessions.filter(
              (session) => session.course_id === course.id
            );

            return (
              <article
                key={course.id}
                className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xs"
              >
                <div className="lg:col-span-4 bg-[#E3DAC9] relative min-h-[260px]">
                  {course.image_path ? (
                    <img
                      src={course.image_path}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[260px] flex items-center justify-center text-[#878378] text-sm">
                      L'Atelier Academy
                    </div>
                  )}

                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs">
                    {course.modality}
                  </span>
                </div>

                <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center gap-3">
                      <h2 className="font-serif text-2xl font-semibold text-[#2D2C28]">
                        {course.name}
                      </h2>

                      <span className="font-serif text-2xl font-semibold text-[#2D2C28] shrink-0">
                        {course.price} €
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5B5650] leading-relaxed">
                      {course.description || "Formación profesional de uñas."}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#EBE5D9] space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2D2C28]">
                      Próximas convocatorias disponibles
                    </h3>

                    {courseSessions.length === 0 ? (
                      <p className="text-xs text-[#878378]">
                        Próximamente anunciaremos nuevas fechas.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {courseSessions.map((session) => {
                          const enrolled = enrolledCounts[session.id] || 0;

                          const available =
                            session.capacity === null
                              ? null
                              : Math.max(0, session.capacity - enrolled);

                          const isFull = available === 0;

                          return (
                            <div
                              key={session.id}
                              className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] flex items-center justify-between gap-3"
                            >
                              <div className="text-xs space-y-1">
                                <p className="font-semibold text-[#2D2C28]">
                                  {new Date(
                                    session.starts_at
                                  ).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>

                                <p className="text-[#878378]">
                                  {session.location}
                                </p>

                                <p className="text-[#5B5650]">
                                  {isFull
                                    ? "Plazas agotadas"
                                    : available === null
                                      ? "Plazas disponibles"
                                      : `Plazas libres: ${available}`}
                                </p>
                              </div>

                              <button
                                type="button"
                                disabled={isFull}
                                onClick={() => {
                                  setSelectedSessionId(session.id);
                                  setError("");
                                }}
                                className="px-4 py-2.5 rounded-xl text-xs font-medium bg-[#2D2C28] text-[#FAF9F7] disabled:bg-[#EBE5D9] disabled:text-[#878378]"
                              >
                                {isFull ? "Completo" : "Inscribirme"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

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
                className="px-3 py-1.5 rounded-full bg-[#F1EDE4] text-[#2D2C28] text-xs"
              >
                Cerrar
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F1EDE4] border border-[#E3DAC9] text-xs space-y-1">
              <p>
                <strong>Convocatoria:</strong>{" "}
                {new Date(activeSession.starts_at).toLocaleDateString("es-ES")}
              </p>

              <p>
                <strong>Modalidad:</strong> {activeCourse.modality}
              </p>

              <p>
                <strong>Importe total:</strong> {activeCourse.price} €
              </p>
            </div>

            <form onSubmit={handleEnrollmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#2D2C28] mb-1">
                  Nombre completo *
                </label>

                <input
                  type="text"
                  required
                  value={student.name}
                  onChange={(e) =>
                    setStudent({ ...student, name: e.target.value })
                  }
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
                  value={student.email}
                  onChange={(e) =>
                    setStudent({ ...student, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#2D2C28] mb-1">
                  Teléfono móvil *
                </label>

                <input
                  type="tel"
                  required
                  value={student.phone}
                  onChange={(e) =>
                    setStudent({ ...student, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSessionId(null)}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl border border-[#B6AEA1] text-[#5B5650] font-medium"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium disabled:opacity-50"
                >
                  {submitting
                    ? "Preparando pago..."
                    : `Pagar ${activeCourse.price} €`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}