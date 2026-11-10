"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { loginUser } from "@/actions/auth/auth";
import {
  INITIAL_APPOINTMENTS,
  INITIAL_COURSES,
  INITIAL_COURSE_ENROLLMENTS,
  INITIAL_COURSE_SESSIONS,
  INITIAL_PAYMENTS,
} from "@/lib/mock-data";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"customer" | "admin">("customer");
  const [loggedAsCustomer, setLoggedAsCustomer] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const myAppointments = INITIAL_APPOINTMENTS.filter(
    (a) => a.customer_id === "cust-01"
  );
  const myEnrollments = INITIAL_COURSE_ENROLLMENTS.filter(
    (e) => e.customer_id === "cust-01"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    // Si están configuradas las variables de entorno de Supabase, ejecuta el Server Action de Azael
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        await loginUser(formData);
        return;
      } catch {
        // Next.js redirect lanza una excepción interna que el router maneja
      }
    }

    // Modo interactivo local: redirige a /admin si accede con cuenta de administración
    const normalizedEmail = email.trim().toLowerCase();
    if (
      accountType === "admin" ||
      normalizedEmail.includes("admin") ||
      normalizedEmail === "hola@lateliernails.es"
    ) {
      router.push("/admin");
      return;
    }

    setLoggedAsCustomer(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#2D2C28]">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {!loggedAsCustomer ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Formulario de Inicio de Sesión */}
            <div className="lg:col-span-6 bg-[#FAF9F7] border border-[#EBE5D9] rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xs">
              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
                  Área Privada
                </span>
                <h1 className="font-serif text-3xl font-semibold text-[#2D2C28]">
                  Iniciar Sesión
                </h1>
                <p className="text-xs text-[#5B5650] leading-relaxed">
                  Accede con tus credenciales para gestionar tus citas y cursos, o entra con tu cuenta de administración para gestionar el estudio.
                </p>
              </div>

              {/* Selector de tipo de acceso */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#F1EDE4] border border-[#E3DAC9]">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("customer");
                    setEmail("claudia.morales@email.com");
                    setPassword("Cliente2026!");
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-colors ${
                    accountType === "customer"
                      ? "bg-[#FAF9F7] text-[#2D2C28] shadow-2xs"
                      : "text-[#5B5650] hover:text-[#2D2C28]"
                  }`}
                >
                  Acceso Clientas
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("admin");
                    setEmail("admin@lateliernails.es");
                    setPassword("AdminAtelier2026!");
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-colors ${
                    accountType === "admin"
                      ? "bg-[#2D2C28] text-[#FAF9F7] shadow-2xs"
                      : "text-[#5B5650] hover:text-[#2D2C28]"
                  }`}
                >
                  Acceso Administración
                </button>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-[#F1EDE4] border border-[#B6AEA1] text-xs text-[#2D2C28]">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block font-medium text-[#2D2C28] mb-1.5"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      accountType === "admin"
                        ? "admin@lateliernails.es"
                        : "tu@email.com"
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-[#2D2C28] focus:outline-none focus:border-[#2D2C28]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block font-medium text-[#2D2C28] mb-1.5"
                  >
                    Contraseña
                  </label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduce tu contraseña"
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-[#2D2C28] focus:outline-none focus:border-[#2D2C28]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] transition-colors"
                >
                  {accountType === "admin"
                    ? "Acceder al Panel de Administración"
                    : "Iniciar Sesión"}
                </button>
              </form>

              <div className="pt-4 border-t border-[#EBE5D9] text-xs text-center text-[#5B5650]">
                ¿Todavía no tienes cuenta de clienta?{" "}
                <Link
                  href="/registro"
                  className="font-semibold text-[#2D2C28] underline underline-offset-4"
                >
                  Crear cuenta ahora
                </Link>
              </div>
            </div>

            {/* Información lateral */}
            <div className="lg:col-span-6 rounded-3xl bg-[#F1EDE4] border border-[#E3DAC9] p-8 sm:p-10 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
                Ventajas de tu cuenta
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D2C28]">
                Gestiona tus reservas y formaciones con total comodidad
              </h2>
              <div className="space-y-4 text-xs text-[#5B5650] leading-relaxed">
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EBE5D9]">
                  <strong className="block text-[#2D2C28] text-sm mb-1">
                    Reservas más rápidas
                  </strong>
                  Tus datos de contacto quedan guardados para que puedas elegir servicio, fecha y hora en pocos segundos.
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EBE5D9]">
                  <strong className="block text-[#2D2C28] text-sm mb-1">
                    Seguimiento de anticipos y citas
                  </strong>
                  Consulta en cualquier momento el estado de tus próximas citas, el justificante del anticipo del 50% y el importe pendiente en salón.
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EBE5D9]">
                  <strong className="block text-[#2D2C28] text-sm mb-1">
                    Inscripciones a cursos
                  </strong>
                  Revisa las fechas, horarios y plazas confirmadas en nuestras convocatorias presenciales y online.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Panel Privado de Clienta */
          <div className="space-y-8">
            <div className="rounded-3xl bg-[#E3DAC9] border border-[#B6AEA1] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#5B5650] font-semibold">
                  Área de Clienta
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D2C28] mt-1">
                  Claudia Morales Vega
                </h1>
                <p className="text-xs text-[#5B5650]">
                  {email || "claudia.morales@email.com"} · +34 655 12 34 90
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/reservas"
                  className="px-5 py-2.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium"
                >
                  Nueva Cita
                </Link>
                <button
                  type="button"
                  onClick={() => setLoggedAsCustomer(false)}
                  className="px-4 py-2.5 rounded-full bg-[#FAF9F7] border border-[#B6AEA1] text-xs text-[#5B5650]"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mis Citas */}
              <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4">
                <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
                  Mis Citas Reservadas
                </h2>
                {myAppointments.map((apt) => {
                  const payment = INITIAL_PAYMENTS.find(
                    (p) => p.appointment_id === apt.id
                  );
                  return (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="font-serif text-base text-[#2D2C28]">
                          {apt.service_name_snapshot}
                        </strong>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E3DAC9] text-[#2D2C28] font-medium">
                          Confirmada
                        </span>
                      </div>
                      <p className="text-[#5B5650]">
                        Fecha:{" "}
                        {new Date(apt.starts_at).toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                        })}{" "}
                        a las 10:30 h
                      </p>
                      <div className="flex justify-between pt-2 border-t border-[#EBE5D9] text-[#5B5650]">
                        <span>
                          Total: <strong>{apt.price_snapshot} €</strong>
                        </span>
                        <span>
                          Anticipo ({payment?.provider}):{" "}
                          <strong className="text-[#2D2C28]">
                            {apt.deposit_required} €
                          </strong>
                        </span>
                        <span>
                          Restante en salón:{" "}
                          <strong>
                            {apt.price_snapshot - apt.deposit_required} €
                          </strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mis Cursos */}
              <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4">
                <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
                  Mis Cursos Inscritos
                </h2>
                {myEnrollments.map((enr) => {
                  const session = INITIAL_COURSE_SESSIONS.find(
                    (s) => s.id === enr.course_session_id
                  );
                  const course = INITIAL_COURSES.find(
                    (c) => c.id === session?.course_id
                  );
                  return (
                    <div
                      key={enr.id}
                      className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="font-serif text-base text-[#2D2C28]">
                          {course?.name}
                        </strong>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium">
                          Plaza Confirmada
                        </span>
                      </div>
                      <p className="text-[#5B5650]">
                        Ubicación: {session?.location}
                      </p>
                      <p className="text-[#5B5650]">
                        Convocatoria:{" "}
                        {session &&
                          new Date(session.starts_at).toLocaleDateString(
                            "es-ES"
                          )}{" "}
                        · Importe abonado: <strong>{enr.price_snapshot} €</strong>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
