import Link from "next/link";
import {
  INITIAL_BUSINESS_HOURS,
  INITIAL_BUSINESS_SETTINGS,
} from "@/lib/mock-data";

export default function Footer() {
  return (
    <footer className="bg-[#F1EDE4] border-t border-[#E3DAC9] text-[#5B5650]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Presentación del estudio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E3DAC9] border border-[#B6AEA1] flex items-center justify-center text-[#2D2C28] font-serif font-semibold">
                L&apos;A
              </div>
              <span className="font-serif text-lg font-semibold text-[#2D2C28]">
                {INITIAL_BUSINESS_SETTINGS.business_name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#5B5650]">
              {INITIAL_BUSINESS_SETTINGS.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={INITIAL_BUSINESS_SETTINGS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650] transition-colors"
              >
                <span>WhatsApp Directo</span>
              </a>
              <Link
                href="/reservas"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E3DAC9] text-[#2D2C28] text-xs font-medium hover:bg-[#B6AEA1] transition-colors"
              >
                Reservar Cita
              </Link>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-serif text-base font-semibold text-[#2D2C28] mb-4">
              Navegación
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/servicios" className="hover:text-[#2D2C28] transition-colors">
                  Servicios de Uñas y Tarifas
                </Link>
              </li>
              <li>
                <Link href="/reservas" className="hover:text-[#2D2C28] transition-colors">
                  Reservar Cita Online
                </Link>
              </li>
              <li>
                <Link href="/cursos" className="hover:text-[#2D2C28] transition-colors">
                  Cursos de Formación
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="hover:text-[#2D2C28] transition-colors">
                  Galería de Trabajos
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="hover:text-[#2D2C28] transition-colors">
                  El Estudio
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#2D2C28] transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/registro" className="hover:text-[#2D2C28] transition-colors">
                  Crear Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Horario */}
          <div>
            <h3 className="font-serif text-base font-semibold text-[#2D2C28] mb-4">
              Horario de Apertura
            </h3>
            <ul className="space-y-2 text-sm">
              {INITIAL_BUSINESS_HOURS.map((bh) => (
                <li
                  key={bh.id}
                  className="flex items-center justify-between border-b border-[#EBE5D9] pb-1.5"
                >
                  <span className="font-medium text-[#2D2C28]">{bh.weekday_label}</span>
                  {bh.is_closed ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBE5D9] text-[#878378]">
                      Cerrado
                    </span>
                  ) : (
                    <span className="text-[#5B5650]">
                      {bh.opens_at} - {bh.closes_at}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-[#2D2C28] mb-4">
              Ubicación y Contacto
            </h3>
            <p className="text-sm">
              <strong className="block text-[#2D2C28] text-xs uppercase tracking-wider mb-0.5">
                Dirección
              </strong>
              {INITIAL_BUSINESS_SETTINGS.address}
            </p>
            <p className="text-sm">
              <strong className="block text-[#2D2C28] text-xs uppercase tracking-wider mb-0.5">
                Teléfono y WhatsApp
              </strong>
              {INITIAL_BUSINESS_SETTINGS.phone}
            </p>
            <p className="text-sm">
              <strong className="block text-[#2D2C28] text-xs uppercase tracking-wider mb-0.5">
                Correo Electrónico
              </strong>
              {INITIAL_BUSINESS_SETTINGS.email}
            </p>
            <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E3DAC9] text-xs text-[#5B5650] leading-relaxed">
              <strong className="text-[#2D2C28] block mb-1">
                Reserva Garantizada y Pago Seguro
              </strong>
              Las citas se confirman abonando el 50% de anticipo mediante pasarela cifrada. El importe restante se abona en el salón al finalizar el servicio.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E3DAC9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#878378]">
          <p>
            © {new Date().getFullYear()} {INITIAL_BUSINESS_SETTINGS.business_name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span>Aviso Legal y Privacidad</span>
            <span>·</span>
            <span>Política de Reservas y Cancelaciones</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
