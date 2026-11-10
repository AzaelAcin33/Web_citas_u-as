"use client";

import { useState } from "react";
import {
  INITIAL_COURSES,
  INITIAL_COURSE_CATEGORIES,
  INITIAL_COURSE_ENROLLMENTS,
  INITIAL_COURSE_SESSIONS,
  INITIAL_CUSTOMERS,
} from "@/lib/mock-data";
import { CourseModality, CourseSession, NailCourse } from "@/lib/types";

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<NailCourse[]>(INITIAL_COURSES);
  const [sessions, setSessions] = useState<CourseSession[]>(
    INITIAL_COURSE_SESSIONS
  );

  const [courseName, setCourseName] = useState("");
  const [courseCatId, setCourseCatId] = useState(
    INITIAL_COURSE_CATEGORIES[0].id
  );
  const [coursePrice, setCoursePrice] = useState("290");
  const [courseModality, setCourseModality] =
    useState<CourseModality>("Presencial");
  const [courseDesc, setCourseDesc] = useState("");

  const [sessionCourseId, setSessionCourseId] = useState(INITIAL_COURSES[0].id);
  const [sessionDate, setSessionDate] = useState("2026-12-20");
  const [sessionCapacity, setSessionCapacity] = useState("6");
  const [sessionLocation, setSessionLocation] = useState(
    "L'Atelier Studio - Sala de Formación (Calle Serrano 48)"
  );

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: NailCourse = {
      id: `crs-${Date.now()}`,
      category_id: courseCatId,
      name: courseName,
      description: courseDesc,
      price: Number(coursePrice),
      modality: courseModality,
      image_path:
        "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85",
      is_active: true,
      duration_hours: 16,
      level: "Todos los niveles",
      includes_kit: true,
      syllabus: [
        "Teoría anatómica y química de productos",
        "Práctica supervisada paso a paso",
        "Certificado acreditativo L'Atelier Academy",
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCourses((prev) => [newCourse, ...prev]);
    setCourseName("");
    setCourseDesc("");
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: CourseSession = {
      id: `ses-${Date.now()}`,
      course_id: sessionCourseId,
      starts_at: `${sessionDate}T09:30:00Z`,
      ends_at: `${sessionDate}T18:30:00Z`,
      capacity: Number(sessionCapacity),
      enrolled_count: 0,
      status: "open",
      location: sessionLocation,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const toggleCourseActive = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
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
          Crea o modifica los cursos de formación de uñas, abre nuevas convocatorias con límite de plazas y revisa las alumnas inscritas.
        </p>
      </div>

      {/* Formularios */}
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
              placeholder="Ej. Curso Avanzado de Estructuras en Acrílico"
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
                {INITIAL_COURSE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
              Descripción y contenido *
            </label>
            <textarea
              rows={2}
              required
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
              placeholder="Qué aprenderá la alumna en este curso..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650]"
          >
            Publicar Curso
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
              value={sessionCourseId}
              onChange={(e) => setSessionCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.price} €)
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
                Cupo máximo de alumnas
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
            className="w-full py-3 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650]"
          >
            Abrir Convocatoria
          </button>
        </form>
      </div>

      {/* Listado */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
          Cursos Activos y sus Convocatorias
        </h2>
        {courses.map((course) => {
          const courseSessions = sessions.filter(
            (s) => s.course_id === course.id
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
                  onClick={() => toggleCourseActive(course.id)}
                  className="px-4 py-2 rounded-xl bg-[#F1EDE4] border border-[#B6AEA1] text-[#2D2C28] font-medium"
                >
                  {course.is_active ? "Ocultar curso" : "Publicar curso"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#EBE5D9]">
                {courseSessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="p-3.5 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-[#2D2C28]">
                        Fecha: {new Date(ses.starts_at).toLocaleDateString("es-ES")}
                      </strong>
                      <span className="block text-[#5B5650]">
                        Inscritas: {ses.enrolled_count} / {ses.capacity} plazas
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#E3DAC9] text-[#2D2C28] font-medium">
                      {ses.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alumnas inscritas */}
      <div className="rounded-3xl bg-[#F1EDE4] border border-[#E3DAC9] p-6 space-y-4 text-xs">
        <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
          Alumnas Inscritas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_COURSE_ENROLLMENTS.map((enr) => {
            const customer = INITIAL_CUSTOMERS.find(
              (c) => c.id === enr.customer_id
            );
            const session = sessions.find(
              (s) => s.id === enr.course_session_id
            );
            const course = courses.find((c) => c.id === session?.course_id);
            return (
              <div
                key={enr.id}
                className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#E3DAC9] space-y-1"
              >
                <div className="flex justify-between">
                  <strong className="text-sm text-[#2D2C28]">
                    {customer?.full_name}
                  </strong>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2D2C28] text-[#FAF9F7]">
                    {enr.status}
                  </span>
                </div>
                <p className="text-[#5B5650]">{course?.name}</p>
                <p className="text-[#878378]">
                  Importe abonado: <strong>{enr.price_snapshot} €</strong> ·{" "}
                  {customer?.phone}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
