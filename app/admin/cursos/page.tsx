"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type {
  CourseCategory,
  CourseModality,
  CourseSession,
  NailCourse,
} from "@/lib/types";

interface Enrollment {
  id: string;
  course_session_id: string;
  customer_id: string;
  status: string;
  price_snapshot: number;
  created_at: string;
}

interface Customer {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
}

export default function AdminCursosPage() {
  const supabase = createClient();

  const [courses, setCourses] = useState<NailCourse[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [courseName, setCourseName] = useState("");
  const [courseCatId, setCourseCatId] = useState("");
  const [coursePrice, setCoursePrice] = useState("290");
  const [courseModality, setCourseModality] =
    useState<CourseModality>("Presencial");
  const [courseDesc, setCourseDesc] = useState("");

  const [sessionCourseId, setSessionCourseId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionCapacity, setSessionCapacity] = useState("6");
  const [sessionLocation, setSessionLocation] = useState(
    "L'Atelier Studio - Sala de Formación"
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    const [
      coursesResult,
      categoriesResult,
      sessionsResult,
      enrollmentsResult,
    ] = await Promise.all([
      supabase.from("courses").select("*").order("created_at", {
        ascending: false,
      }),
      supabase
        .from("course_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("course_sessions")
        .select("*")
        .order("starts_at", { ascending: true }),
      supabase
        .from("course_enrollments")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    const firstError =
      coursesResult.error ||
      categoriesResult.error ||
      sessionsResult.error ||
      enrollmentsResult.error;

    if (firstError) {
      setError(`No se pudieron cargar los datos: ${firstError.message}`);
      setLoading(false);
      return;
    }

    const loadedCourses = (coursesResult.data || []) as NailCourse[];
    const loadedCategories = (categoriesResult.data ||
      []) as CourseCategory[];
    const loadedSessions = (sessionsResult.data || []) as CourseSession[];
    const loadedEnrollments = (enrollmentsResult.data ||
      []) as Enrollment[];

    setCourses(loadedCourses);
    setCategories(loadedCategories);
    setSessions(loadedSessions);
    setEnrollments(loadedEnrollments);

    const customerIds = [
      ...new Set(loadedEnrollments.map((item) => item.customer_id)),
    ];

    if (customerIds.length > 0) {
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("id, full_name, email, phone")
        .in("id", customerIds);

      if (customerError) {
        setError(
          `Los cursos se cargaron, pero no se pudieron cargar las alumnas: ${customerError.message}`
        );
      } else {
        setCustomers((customerData || []) as Customer[]);
      }
    } else {
      setCustomers([]);
    }

    setCourseCatId((current) => current || loadedCategories[0]?.id || "");
    setSessionCourseId(
      (current) => current || loadedCourses[0]?.id || ""
    );

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!courseName.trim() || !coursePrice || Number(coursePrice) <= 0) {
      setError("Introduce un nombre y un precio válido.");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase.from("courses").insert({
      name: courseName.trim(),
      category_id: courseCatId || null,
      price: Number(coursePrice),
      modality: courseModality,
      description: courseDesc.trim() || null,
      image_path: null,
      is_active: true,
    });

    if (insertError) {
      setError(`No se pudo crear el curso: ${insertError.message}`);
    } else {
      setSuccess("Curso creado y guardado correctamente.");
      setCourseName("");
      setCourseDesc("");
      await loadData();
    }

    setSaving(false);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!sessionCourseId || !sessionDate || Number(sessionCapacity) < 1) {
      setError("Completa todos los datos de la convocatoria.");
      return;
    }

    const start = new Date(`${sessionDate}T09:30:00`);
    const end = new Date(`${sessionDate}T18:30:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError("La fecha introducida no es válida.");
      return;
    }

    setSaving(true);

    const { error: insertError } = await supabase
      .from("course_sessions")
      .insert({
        course_id: sessionCourseId,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        capacity: Number(sessionCapacity),
        status: "open",
        location: sessionLocation.trim() || null,
      });

    if (insertError) {
      setError(`No se pudo crear la convocatoria: ${insertError.message}`);
    } else {
      setSuccess("Convocatoria creada correctamente.");
      await loadData();
    }

    setSaving(false);
  };

  const toggleCourseActive = async (course: NailCourse) => {
    setError("");
    setSuccess("");

    const { error: updateError } = await supabase
      .from("courses")
      .update({ is_active: !course.is_active })
      .eq("id", course.id);

    if (updateError) {
      setError(`No se pudo actualizar el curso: ${updateError.message}`);
    } else {
      setSuccess(
        course.is_active ? "Curso ocultado correctamente." : "Curso publicado correctamente."
      );
      await loadData();
    }
  };

  const getEnrolledCount = (sessionId: string) =>
    enrollments.filter(
      (enrollment) =>
        enrollment.course_session_id === sessionId &&
        enrollment.status !== "cancelled"
    ).length;

  const getCustomer = (customerId: string) =>
    customers.find((customer) => customer.id === customerId);

  const getCourseForSession = (sessionId: string) => {
    const session = sessions.find((item) => item.id === sessionId);
    return courses.find((course) => course.id === session?.course_id);
  };

  return (
    <div className="space-y-10">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
          Academia y Formación
        </span>
        <h1 className="font-serif text-3xl font-semibold text-[#2D2C28] mt-1">
          Gestión de Cursos, Fechas y Alumnas
        </h1>
        <p className="text-xs text-[#5B5650] mt-1">
          Crea cursos, abre convocatorias y consulta las alumnas inscritas.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        <form
          onSubmit={handleCreateCourse}
          className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4"
        >
          <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
            1. Crear Nuevo Curso de Uñas
          </h2>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Nombre del curso *
            </label>
            <input
              type="text"
              required
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Ej. Curso Avanzado de Acrílico"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Categoría
              </label>
              <select
                value={courseCatId}
                onChange={(e) => setCourseCatId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              >
                <option value="">Sin categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Modalidad
              </label>
              <select
                value={courseModality}
                onChange={(e) =>
                  setCourseModality(e.target.value as CourseModality)
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              >
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Precio (€)
              </label>
              <input
                type="number"
                min="1"
                required
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
              placeholder="Qué aprenderá la alumna..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Publicar Curso"}
          </button>
        </form>

        <form
          onSubmit={handleCreateSession}
          className="rounded-3xl bg-[#F7F4EF] border border-[#E3DAC9] p-6 space-y-4"
        >
          <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
            2. Abrir Nueva Fecha / Convocatoria
          </h2>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Seleccionar Curso
            </label>
            <select
              required
              value={sessionCourseId}
              onChange={(e) => setSessionCourseId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
            >
              <option value="">Selecciona un curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.price} €)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Fecha de la edición
              </label>
              <input
                type="date"
                required
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Cupo máximo
              </label>
              <input
                type="number"
                min="1"
                required
                value={sessionCapacity}
                onChange={(e) => setSessionCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Lugar o modalidad de impartición
            </label>
            <input
              type="text"
              required
              value={sessionLocation}
              onChange={(e) => setSessionLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
            />
          </div>

          <button
            type="submit"
            disabled={saving || courses.length === 0}
            className="w-full py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Abrir Convocatoria"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
          Cursos y Convocatorias
        </h2>

        {loading ? (
          <p className="text-sm text-[#878378]">Cargando datos...</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-[#878378]">Todavía no hay cursos creados.</p>
        ) : (
          courses.map((course) => {
            const courseSessions = sessions.filter(
              (session) => session.course_id === course.id
            );

            return (
              <div
                key={course.id}
                className="p-6 rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] space-y-4 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-serif text-lg font-semibold text-[#2D2C28]">
                      {course.name}
                    </span>
                    <p className="text-[#878378] mt-0.5">
                      Modalidad: {course.modality} · Precio: {course.price} € ·{" "}
                      {course.is_active ? "Publicado" : "Oculto"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCourseActive(course)}
                    className="px-4 py-2 rounded-xl bg-[#F1EDE4] border border-[#B6AEA1] text-[#2D2C28] font-medium"
                  >
                    {course.is_active ? "Ocultar curso" : "Publicar curso"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#EBE5D9]">
                  {courseSessions.map((session) => {
                    const enrolled = getEnrolledCount(session.id);

                    return (
                      <div
                        key={session.id}
                        className="p-3.5 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] flex items-center justify-between gap-3"
                      >
                        <div>
                          <strong className="text-[#2D2C28]">
                            Fecha:{" "}
                            {new Date(session.starts_at).toLocaleDateString(
                              "es-ES"
                            )}
                          </strong>
                          <span className="block text-[#5B5650]">
                            Inscritas: {enrolled} / {session.capacity ?? "—"} plazas
                          </span>
                          <span className="block text-[#878378]">
                            {session.location}
                          </span>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-[#E3DAC9] text-[#2D2C28] font-medium">
                          {session.status}
                        </span>
                      </div>
                    );
                  })}

                  {courseSessions.length === 0 && (
                    <p className="text-[#878378]">
                      Este curso todavía no tiene convocatorias.
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="rounded-3xl bg-[#F1EDE4] border border-[#E3DAC9] p-6 space-y-4 text-xs">
        <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
          Alumnas Inscritas
        </h2>

        {loading ? (
          <p>Cargando inscripciones...</p>
        ) : enrollments.length === 0 ? (
          <p className="text-[#878378]">Todavía no hay alumnas inscritas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.map((enrollment) => {
              const customer = getCustomer(enrollment.customer_id);
              const course = getCourseForSession(
                enrollment.course_session_id
              );

              return (
                <div
                  key={enrollment.id}
                  className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#E3DAC9] space-y-1"
                >
                  <div className="flex justify-between gap-2">
                    <strong className="text-sm text-[#2D2C28]">
                      {customer?.full_name || "Alumna"}
                    </strong>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2D2C28] text-[#FAF9F7]">
                      {enrollment.status}
                    </span>
                  </div>

                  <p className="text-[#5B5650]">
                    {course?.name || "Curso no disponible"}
                  </p>
                  <p className="text-[#878378]">
                    Importe:{" "}
                    <strong>{enrollment.price_snapshot} €</strong>
                    {customer?.phone && ` · ${customer.phone}`}
                  </p>
                  {customer?.email && (
                    <p className="text-[#878378]">{customer.email}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}