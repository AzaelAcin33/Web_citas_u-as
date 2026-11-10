import Link from "next/link";
import {
  INITIAL_BUSINESS_HOURS,
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_COURSES,
  INITIAL_COURSE_SESSIONS,
  INITIAL_MEDIA,
  INITIAL_SERVICES,
} from "@/lib/mock-data";

const CLIENT_REVIEWS = [
  {
    id: "rev-1",
    author: "Claudia Morales",
    service: "Manicura Rusa + Nivelación Base Rubber",
    date: "Hace 1 semana",
    comment:
      "Llevaba tiempo buscando un sitio donde hicieran la manicura rusa de verdad sin dañar la cutícula. Me duraron 4 semanas intactas sin un solo levantamiento. El nuevo local es precioso y súper relajante.",
  },
  {
    id: "rev-2",
    author: "Elena Navarro",
    service: "Puesta Nueva en Gel (Talla M)",
    date: "Hace 2 semanas",
    comment:
      "La atención al detalle es impresionante. Te asesoran según la forma de tu mano y trabajan con todo el material esterilizado en bolsas individuales. Se nota la profesionalidad desde que entras.",
  },
  {
    id: "rev-3",
    author: "Sofía Domínguez",
    service: "Masterclass Manicura Rusa Combinada",
    date: "Hace 3 semanas",
    comment:
      "Hice el curso presencial de perfeccionamiento y ha cambiado por completo mi forma de trabajar en salón. Grupos muy reducidos donde corrigen tu postura y el ángulo del torno al milímetro.",
  },
];

export default function HomePage() {
  const featuredServices = INITIAL_SERVICES.filter((s) => s.is_active).slice(0, 4);
  const activeCourses = INITIAL_COURSES.filter((c) => c.is_active);

  return (
    <div className="space-y-0">
      {/* HERO PRINCIPAL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E3DAC9] via-[#EBE5D9] to-[#FAF9F7] border-b border-[#E3DAC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Columna izquierda con animación de entrada lateral limpia */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="animate-slide-left font-serif text-4xl sm:text-5xl lg:text-[58px] text-[#2D2C28] font-semibold leading-[1.08] tracking-tight">
                Cuidado, arquitectura y perfección en tus uñas.
              </h1>

              <p className="animate-slide-left-delay-1 text-base sm:text-lg text-[#5B5650] max-w-2xl leading-relaxed">
                Especialistas en{" "}
                <strong className="text-[#2D2C28] font-semibold">
                  manicura rusa combinada, nivelación con base rubber y uñas esculpidas
                </strong>{" "}
                en gel y acrílico. Reserva tu cita eligiendo el servicio exacto con confirmación inmediata o inscríbete en nuestras formaciones profesionales.
              </p>

              <div className="animate-slide-left-delay-2 flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/reservas"
                  className="px-7 py-4 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-sm font-medium hover:bg-[#5B5650] transition-all shadow-sm"
                >
                  Reservar Cita Ahora
                </Link>
                <Link
                  href="/servicios"
                  className="px-6 py-4 rounded-full bg-[#FAF9F7] text-[#2D2C28] border border-[#B6AEA1] text-sm font-medium hover:bg-[#F1EDE4] transition-all"
                >
                  Ver Carta de Servicios
                </Link>
                <Link
                  href="/cursos"
                  className="px-5 py-4 rounded-full text-sm font-medium text-[#5B5650] hover:text-[#2D2C28] underline underline-offset-4"
                >
                  Formación y Cursos
                </Link>
              </div>

              {/* Indicadores de confianza del estudio */}
              <div className="animate-slide-left-delay-2 pt-6 border-t border-[#B6AEA1]/40 grid grid-cols-3 gap-4 max-w-xl">
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D2C28]">
                    4.9 / 5
                  </p>
                  <p className="text-xs text-[#5B5650] mt-0.5">
                    Valoración media de clientas
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D2C28]">
                    +3 a 4 sem.
                  </p>
                  <p className="text-xs text-[#5B5650] mt-0.5">
                    Durabilidad intacta garantizada
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D2C28]">
                    100%
                  </p>
                  <p className="text-xs text-[#5B5650] mt-0.5">
                    Esterilización en autoclave
                  </p>
                </div>
              </div>
            </div>

            {/* Columna derecha: Composición visual */}
            <div className="lg:col-span-5 animate-fade-scale">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#FAF9F7] shadow-xl bg-[#F1EDE4]">
                <img
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=85"
                  alt="Manicura rusa combinada y nivelación profesional"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2C28]/80 via-[#2D2C28]/15 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-[#FAF9F7]/95 backdrop-blur-md border border-[#E3DAC9]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#878378] font-semibold block">
                        Tratamiento más solicitado
                      </span>
                      <p className="font-serif text-lg font-semibold text-[#2D2C28] mt-0.5">
                        Manicura Rusa + Nivelación Base Rubber
                      </p>
                      <p className="text-xs text-[#5B5650] mt-0.5">
                        75 min · 38 € total (Reserva con 19 €)
                      </p>
                    </div>
                    <Link
                      href="/reservas?service=srv-01"
                      className="shrink-0 px-4 py-2.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650] transition-colors"
                    >
                      Elegir
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES DE CALIDAD DEL ESTUDIO */}
      <section className="py-16 bg-[#FAF9F7] border-b border-[#EBE5D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-[#F7F4EF] border border-[#E3DAC9] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E3DAC9] flex items-center justify-center text-[#2D2C28]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
                Higiene y Esterilización Hospitalaria
              </h2>
              <p className="text-sm text-[#5B5650] leading-relaxed">
                Cada juego de fresas y tijeras pasa por ultrasonidos y autoclave Clase B en bolsas selladas que se abren frente a ti. Limas y buffers son siempre de un único uso.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#F7F4EF] border border-[#E3DAC9] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E3DAC9] flex items-center justify-center text-[#2D2C28]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
                Arquitectura y Cuidado Natural
              </h2>
              <p className="text-sm text-[#5B5650] leading-relaxed">
                Estudiamos la anatomía de tu uña natural para aplicar la base constructora adecuada, corrigiendo estrías o fragilidad y garantizando un crecimiento limpio y equilibrado.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#F7F4EF] border border-[#E3DAC9] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E3DAC9] flex items-center justify-center text-[#2D2C28]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
                Agenda en Tiempo Real sin Esperas
              </h2>
              <p className="text-sm text-[#5B5650] leading-relaxed">
                Selecciona tu servicio, consulta los huecos disponibles al instante y asegura tu plaza mediante el anticipo del 50%. El resto del importe se abona en el salón.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CARTA DE SERVICIOS DESTACADOS */}
      <section className="py-20 bg-[#F7F4EF] border-b border-[#EBE5D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
                Especialidades de Cabina
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D2C28]">
                Nuestros Servicios de Uñas
              </h2>
              <p className="text-sm sm:text-base text-[#5B5650] max-w-2xl">
                Cada tratamiento incluye diagnóstico previo de la lámina natural, preparación de cutícula de alta precisión y productos europeos libres de componentes agresivos.
              </p>
            </div>
            <Link
              href="/servicios"
              className="self-start md:self-auto px-5 py-2.5 rounded-full bg-[#E3DAC9] text-[#2D2C28] text-sm font-medium hover:bg-[#B6AEA1] transition-colors"
            >
              Ver todos los servicios ({INITIAL_SERVICES.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredServices.map((service) => {
              const deposit = (service.price / 2).toFixed(2).replace(".00", "");
              return (
                <article
                  key={service.id}
                  className="rounded-2xl bg-[#FAF9F7] border border-[#E3DAC9] overflow-hidden flex flex-col sm:flex-row hover:border-[#B6AEA1] transition-all shadow-2xs"
                >
                  <div className="sm:w-52 h-56 sm:h-auto relative shrink-0 bg-[#EBE5D9]">
                    <img
                      src={service.image_path || ""}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    {service.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#2D2C28]/90 text-[#FAF9F7] text-[11px] font-medium">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#878378]">
                        <span>Duración estimada: {service.duration_minutes} min</span>
                        <span className="font-medium text-[#5B5650]">
                          Anticipo: {deposit} €
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-[#2D2C28] leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-xs text-[#5B5650] leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#EBE5D9] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-[#878378] block">
                          Precio del servicio
                        </span>
                        <span className="font-serif text-2xl font-semibold text-[#2D2C28]">
                          {service.price} €
                        </span>
                      </div>
                      <Link
                        href={`/reservas?service=${service.id}`}
                        className="px-5 py-2.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650] transition-colors"
                      >
                        Reservar Cita
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESO EN 4 PASOS (ESTILO EDITORIAL MANDARINA) */}
      <section className="py-20 bg-[#FAF9F7] border-b border-[#EBE5D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
              Proceso de Cita Online
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D2C28]">
              De la reserva a unas uñas impecables
            </h2>
            <p className="text-sm sm:text-base text-[#5B5650]">
              Un sistema ágil y transparente pensado para dedicarte el tiempo exacto que cada estructura necesita sin esperas en el salón.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#F7F4EF] border border-[#E3DAC9] space-y-3">
              <span className="font-serif text-2xl font-semibold text-[#878378]">
                Paso 1
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
                Elige tu servicio de uñas
              </h3>
              <p className="text-xs text-[#5B5650] leading-relaxed">
                Selecciona entre manicura rusa natural, nivelación con base rubber, puesta nueva en gel/acrílico o mantenimiento periódico.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F4EF] border border-[#E3DAC9] space-y-3">
              <span className="font-serif text-2xl font-semibold text-[#878378]">
                Paso 2
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
                Selecciona día y hora
              </h3>
              <p className="text-xs text-[#5B5650] leading-relaxed">
                Nuestro calendario calcula automáticamente la duración del tratamiento y te muestra únicamente las franjas reales disponibles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F4EF] border border-[#E3DAC9] space-y-3">
              <span className="font-serif text-2xl font-semibold text-[#878378]">
                Paso 3
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
                Confirma con el 50%
              </h3>
              <p className="text-xs text-[#5B5650] leading-relaxed">
                Abona la mitad del servicio mediante pasarela segura para bloquear tu cita en la agenda. El 50% restante se liquida en el estudio.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7F4EF] border border-[#E3DAC9] space-y-3">
              <span className="font-serif text-2xl font-semibold text-[#878378]">
                Paso 4
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
                Disfruta tu momento
              </h3>
              <p className="text-xs text-[#5B5650] leading-relaxed">
                Te esperamos en nuestro nuevo local con asesoramiento personalizado de forma y tono para lograr un acabado elegante y duradero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE EL ESTUDIO (COMPOSICIÓN EDITORIAL MULTI-IMAGEN) */}
      <section className="py-20 bg-[#F1EDE4] border-b border-[#E3DAC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-[#E3DAC9] h-64 bg-[#EBE5D9]">
                  <img
                    src={INITIAL_MEDIA[1].storage_path}
                    alt={INITIAL_MEDIA[1].alt_text}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF9F7] border border-[#E3DAC9]">
                  <p className="font-serif text-2xl font-semibold text-[#2D2C28]">
                    Garantía de 7 días
                  </p>
                  <p className="text-xs text-[#5B5650] mt-1">
                    Respaldamos la calidad técnica de cada estructura y esmaltado realizado en nuestro estudio.
                  </p>
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <div className="p-5 rounded-2xl bg-[#2D2C28] text-[#FAF9F7]">
                  <p className="font-serif text-2xl font-semibold">
                    Atención 1 a 1
                  </p>
                  <p className="text-xs text-[#E3DAC9] mt-1">
                    Sin prisas ni turnos simultáneos. Dedicación exclusiva en cada cita.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#E3DAC9] h-64 bg-[#EBE5D9]">
                  <img
                    src={INITIAL_MEDIA[2].storage_path}
                    alt={INITIAL_MEDIA[2].alt_text}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
                Filosofía L&apos;Atelier Nails
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D2C28] leading-tight">
                Precisión técnica y estética atemporal en nuestro nuevo espacio.
              </h2>
              <p className="text-sm sm:text-base text-[#5B5650] leading-relaxed">
                Nuestro estudio nace con una premisa clara: elevar el cuidado de las uñas a un tratamiento de salud y arquitectura a medida. Huimos de los acabados gruesos o artificiales para lograr láminas estilizadas, resistentes y respetuosas con tu uña natural.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#E3DAC9]">
                  <h3 className="font-semibold text-sm text-[#2D2C28]">
                    Materiales Hipoalergénicos
                  </h3>
                  <p className="text-xs text-[#5B5650] mt-1">
                    Bases y geles europeos libres de HEMA agresivo y ácidos corrosivos.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#E3DAC9]">
                  <h3 className="font-semibold text-sm text-[#2D2C28]">
                    Especialistas en Cutícula
                  </h3>
                  <p className="text-xs text-[#5B5650] mt-1">
                    Técnica combinada segura adaptada a pieles sensibles, secas o húmedas.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/sobre-nosotros"
                  className="px-6 py-3 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650] transition-colors"
                >
                  Conocer el Estudio
                </Link>
                <Link
                  href="/galeria"
                  className="px-6 py-3 rounded-full bg-[#FAF9F7] text-[#2D2C28] border border-[#B6AEA1] text-xs font-medium hover:bg-[#E3DAC9] transition-colors"
                >
                  Ver Galería de Trabajos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMIA / CURSOS DE UÑAS */}
      <section className="py-20 bg-[#FAF9F7] border-b border-[#EBE5D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
                Formación Profesional Certificada
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D2C28]">
                Cursos de Uñas y Perfeccionamiento
              </h2>
              <p className="text-sm sm:text-base text-[#5B5650] max-w-2xl">
                Aprende nuestra metodología de trabajo en grupos reducidos de máximo 6 alumnas con práctica real supervisada, dossier técnico y certificado acreditativo.
              </p>
            </div>
            <Link
              href="/cursos"
              className="self-start md:self-auto px-5 py-2.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-sm font-medium hover:bg-[#5B5650] transition-colors"
            >
              Ver Convocatorias e Inscripción
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeCourses.map((course) => {
              const sessions = INITIAL_COURSE_SESSIONS.filter(
                (s) => s.course_id === course.id && s.status === "open"
              );
              const nextSession = sessions[0];
              const spotsLeft = nextSession
                ? nextSession.capacity - nextSession.enrolled_count
                : 0;

              return (
                <article
                  key={course.id}
                  className="rounded-2xl bg-[#F7F4EF] border border-[#E3DAC9] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative bg-[#EBE5D9]">
                      <img
                        src={course.image_path || ""}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FAF9F7]/95 text-[#2D2C28] text-xs font-medium">
                        {course.modality} · {course.duration_hours}h
                      </span>
                    </div>
                    <div className="p-6 space-y-3">
                      <span className="text-xs font-medium text-[#878378]">
                        Nivel: {course.level}
                      </span>
                      <h3 className="font-serif text-xl font-semibold text-[#2D2C28] leading-snug">
                        {course.name}
                      </h3>
                      <p className="text-xs text-[#5B5650] leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    <div className="p-3 rounded-xl bg-[#FAF9F7] border border-[#EBE5D9] flex items-center justify-between text-xs">
                      <span className="text-[#5B5650]">
                        {nextSession
                          ? `Próxima fecha: ${new Date(nextSession.starts_at).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "short",
                            })}`
                          : "Fechas bajo consulta"}
                      </span>
                      <span className="font-semibold text-[#2D2C28]">
                        {nextSession ? `${spotsLeft} plazas libres` : "Completo"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-[11px] text-[#878378] block">
                          Inscripción completa
                        </span>
                        <span className="font-serif text-2xl font-semibold text-[#2D2C28]">
                          {course.price} €
                        </span>
                      </div>
                      <Link
                        href={`/cursos?course=${course.id}`}
                        className="px-4 py-2.5 rounded-full bg-[#E3DAC9] text-[#2D2C28] text-xs font-medium hover:bg-[#B6AEA1] transition-colors"
                      >
                        Inscribirme
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* VALORACIONES DE CLIENTAS */}
      <section className="py-20 bg-[#F7F4EF] border-b border-[#EBE5D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
              Experiencias Reales
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D2C28]">
              Lo que opinan nuestras clientas y alumnas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLIENT_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-[#FAF9F7] border border-[#E3DAC9] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#2D2C28]" aria-label="5 de 5 estrellas">
                    {[...Array(5)].map((_, idx) => (
                      <svg key={idx} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-[#5B5650] leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EBE5D9] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#2D2C28]">{rev.author}</p>
                    <p className="text-[#878378]">{rev.service}</p>
                  </div>
                  <span className="text-[#878378]">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UBICACIÓN Y HORARIO DEL NUEVO LOCAL */}
      <section className="py-20 bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#E3DAC9] border border-[#B6AEA1] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#5B5650] font-semibold">
                Visítanos
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D2C28]">
                Te esperamos en nuestro nuevo local
              </h2>
              <p className="text-sm sm:text-base text-[#5B5650] leading-relaxed max-w-xl">
                {INITIAL_BUSINESS_SETTINGS.address}. Un estudio diseñado en tonos cálidos y relajantes para que desconectes mientras cuidamos de tus manos.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/reservas"
                  className="px-6 py-3.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-sm font-medium hover:bg-[#5B5650] transition-colors"
                >
                  Reservar Cita Online
                </Link>
                <Link
                  href="/contacto"
                  className="px-6 py-3.5 rounded-full bg-[#FAF9F7] text-[#2D2C28] text-sm font-medium hover:bg-[#F1EDE4] transition-colors"
                >
                  Ver Mapa y Cómo Llegar
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FAF9F7] border border-[#EBE5D9] space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
                Horario de Atención
              </h3>
              <ul className="space-y-2 text-xs">
                {INITIAL_BUSINESS_HOURS.map((bh) => (
                  <li
                    key={bh.id}
                    className="flex items-center justify-between border-b border-[#EBE5D9] pb-1.5 last:border-none"
                  >
                    <span className="font-medium text-[#2D2C28]">
                      {bh.weekday_label}
                    </span>
                    <span className="text-[#5B5650]">
                      {bh.is_closed
                        ? "Cerrado"
                        : `${bh.opens_at} - ${bh.closes_at}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
