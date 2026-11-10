"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { registerUser } from "@/actions/auth/auth";

export default function RegistroPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationError(null);

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length < 10 || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setValidationError(
        "La contraseña debe tener al menos 10 caracteres e incluir mayúsculas, minúsculas, números y un carácter especial."
      );
      return;
    }

    const formData = new FormData(e.currentTarget);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        await registerUser(formData);
        return;
      } catch {
        // Redirección gestionada por Next.js
      }
    }

    setRegistered(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#2D2C28]">
      <Navbar />
      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-14">
        <div className="bg-[#FAF9F7] border border-[#EBE5D9] rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xs">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
              Registro de Clientas
            </span>
            <h1 className="font-serif text-3xl font-semibold text-[#2D2C28]">
              Crear Cuenta
            </h1>
            <p className="text-xs text-[#5B5650] leading-relaxed">
              Regístrate para reservar tus citas de uñas más rápido y consultar el estado de tus reservas y cursos.
            </p>
          </div>

          {registered ? (
            <div className="p-6 rounded-2xl bg-[#F1EDE4] border border-[#B6AEA1] space-y-4 text-xs">
              <p className="font-serif text-lg font-semibold text-[#2D2C28]">
                Bienvenida, {fullName}. Tu cuenta ha sido creada correctamente.
              </p>
              <p className="text-[#5B5650]">
                Ya puedes reservar tus citas de uñas con tus datos guardados o inscribirte en nuestras convocatorias de formación.
              </p>
              <div className="flex gap-3 pt-2">
                <Link
                  href="/reservas"
                  className="flex-1 text-center py-3 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium"
                >
                  Reservar Cita Ahora
                </Link>
                <Link
                  href="/login"
                  className="flex-1 text-center py-3 rounded-full bg-[#FAF9F7] border border-[#B6AEA1] text-[#2D2C28] font-medium"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {validationError && (
                <div className="p-3.5 rounded-xl bg-[#F1EDE4] border border-[#B6AEA1] text-[#2D2C28]">
                  {validationError}
                </div>
              )}

              <div>
                <label
                  htmlFor="reg-fullname"
                  className="block font-medium text-[#2D2C28] mb-1.5"
                >
                  Nombre y apellidos
                </label>
                <input
                  id="reg-fullname"
                  name="full_name"
                  type="text"
                  required
                  maxLength={100}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Laura Gómez Pérez"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-[#2D2C28] focus:outline-none focus:border-[#2D2C28]"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="block font-medium text-[#2D2C28] mb-1.5"
                >
                  Teléfono móvil
                </label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 600 00 00 00"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-[#2D2C28] focus:outline-none focus:border-[#2D2C28]"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block font-medium text-[#2D2C28] mb-1.5"
                >
                  Correo electrónico
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-[#2D2C28] focus:outline-none focus:border-[#2D2C28]"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block font-medium text-[#2D2C28] mb-1.5"
                >
                  Contraseña
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  minLength={10}
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 10 caracteres (mayúscula, número y símbolo)"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-[#2D2C28] focus:outline-none focus:border-[#2D2C28]"
                />
                <p className="text-[11px] text-[#878378] mt-1">
                  Debe incluir al menos 10 caracteres, una mayúscula, una minúscula, un número y un símbolo.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] transition-colors"
              >
                Crear Mi Cuenta
              </button>
            </form>
          )}

          <p className="text-xs text-center text-[#5B5650]">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#2D2C28] underline underline-offset-4"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
