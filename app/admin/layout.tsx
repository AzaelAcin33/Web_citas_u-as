"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/actions/auth/auth";

const ADMIN_LINKS = [
  { href: "/admin", label: "Resumen y Agenda" },
  { href: "/admin/reservas", label: "Reservas y Cobros" },
  { href: "/admin/servicios", label: "Servicios de Uñas" },
  { href: "/admin/cursos", label: "Cursos y Convocatorias" },
  { href: "/admin/galeria", label: "Galería y Multimedia" },
  { href: "/admin/clientes", label: "Clientes e Historial" },
  { href: "/admin/configuracion", label: "Negocio, Horarios y Roles" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<"admin" | "superadmin">("admin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF9F7] text-[#2D2C28]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col bg-[#F1EDE4] border-r border-[#E3DAC9] shrink-0">
        <div className="p-6 border-b border-[#E3DAC9] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2D2C28] text-[#FAF9F7] flex items-center justify-center font-serif font-semibold">
              L&apos;A
            </div>
            <div>
              <span className="font-serif text-lg font-semibold text-[#2D2C28] block leading-none">
                Panel de Gestión
              </span>
              <span className="text-[11px] text-[#878378] uppercase tracking-wider mt-1 block">
                L&apos;Atelier Nails
              </span>
            </div>
          </div>

          {/* Selector de nivel de acceso */}
          <div className="p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E3DAC9] text-xs space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#878378] font-semibold block">
              Nivel de acceso:
            </span>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setActiveRole("admin")}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                  activeRole === "admin"
                    ? "bg-[#2D2C28] text-[#FAF9F7]"
                    : "text-[#5B5650] hover:bg-[#E3DAC9]"
                }`}
              >
                Propietaria
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("superadmin")}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                  activeRole === "superadmin"
                    ? "bg-[#2D2C28] text-[#FAF9F7]"
                    : "text-[#5B5650] hover:bg-[#E3DAC9]"
                }`}
              >
                Superadmin
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_LINKS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#2D2C28] text-[#FAF9F7] shadow-2xs"
                    : "text-[#5B5650] hover:bg-[#E3DAC9] hover:text-[#2D2C28]"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E3DAC9] space-y-2">
          <Link
            href="/"
            className="block w-full text-center py-2.5 px-4 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1] text-xs font-medium text-[#2D2C28] hover:bg-[#E3DAC9] transition-colors"
          >
            Ver Web Pública
          </Link>
          <form action={logoutUser}>
            <button
              type="submit"
              className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-medium text-[#5B5650] hover:text-[#2D2C28] hover:bg-[#E3DAC9]/50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Cabecera Móvil / Tablet */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#F1EDE4] border-b border-[#E3DAC9] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#2D2C28] text-[#FAF9F7] flex items-center justify-center font-serif text-sm font-semibold">
            L&apos;A
          </span>
          <div>
            <span className="font-serif text-sm font-semibold text-[#2D2C28] block">
              Administración
            </span>
            <span className="text-[10px] text-[#878378]">
              Perfil: {activeRole === "admin" ? "Propietaria" : "Superadmin"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-[#FAF9F7] border border-[#B6AEA1] text-xs font-medium text-[#2D2C28]"
          >
            Web Pública
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="px-3 py-1.5 rounded-lg bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium"
          >
            {mobileMenuOpen ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F1EDE4] border-b border-[#E3DAC9] px-4 py-3 space-y-1">
          {ADMIN_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-xs font-medium text-[#2D2C28] hover:bg-[#E3DAC9]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-[#FAF9F7] border-b border-[#EBE5D9] text-xs">
          <div className="flex items-center gap-2 text-[#5B5650]">
            <span className="w-2 h-2 rounded-full bg-[#2D2C28]" />
            <span>Panel de gestión interna del estudio</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-[#E3DAC9] text-[#2D2C28] font-medium">
              Sesión: {activeRole === "admin" ? "Propietaria" : "Superadministrador"}
            </span>
            <Link href="/reservas" className="text-[#2D2C28] font-medium underline">
              Ver Agenda Pública
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
