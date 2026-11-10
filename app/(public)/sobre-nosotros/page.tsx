import Link from "next/link";
import { INITIAL_BUSINESS_SETTINGS } from "@/lib/mock-data";

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#F7F4EF] border border-[#EBE5D9] rounded-3xl p-8 sm:p-12">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
            El Estudio y la Especialista
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#2D2C28] leading-tight">
            Pasión por la técnica, la higiene y la belleza natural de tus manos
          </h1>
          <p className="text-sm sm:text-base text-[#5B5650] leading-relaxed">
            {INITIAL_BUSINESS_SETTINGS.business_name} nace con la vocación de elevar el estándar del cuidado de uñas. No somos un salón masificado: dedicamos a cada clienta el tiempo necesario para analizar su tipo de lámina, cutícula y estilo de vida antes de aplicar cualquier producto.
          </p>
          <p className="text-sm text-[#5B5650] leading-relaxed">
            Además de nuestros servicios en cabina, formamos a nuevas profesionales en técnicas avanzadas de manicura rusa combinada, nivelación anatómica y estructuras de salón.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/reservas"
              className="px-6 py-3.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650]"
            >
              Reservar mi primera cita
            </Link>
            <Link
              href="/cursos"
              className="px-6 py-3.5 rounded-full bg-[#E3DAC9] text-[#2D2C28] text-xs font-medium hover:bg-[#B6AEA1]"
            >
              Ver Formación y Academia
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden border-2 border-[#E3DAC9] aspect-[3/4]">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85"
              alt="Trabajo de precisión en cabina"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden border-2 border-[#E3DAC9] aspect-[3/4] mt-8">
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=85"
              alt="Acabado limpio en tonos crema y nude"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            step: "01",
            title: "Protocolo de Esterilización Hospitalaria",
            desc: "Todo nuestro instrumental metálico (fresas, tijeras y empujadores) pasa por limpieza ultrasónica, desinfección enzimática y esterilización en autoclave clase B embolsado individualmente.",
          },
          {
            step: "02",
            title: "Materiales Hipoalergénicos HEMA-Free",
            desc: "Seleccionamos bases rubber, geles y acrílicos europeos respetuosos con la lámina natural, evitando el sobrecalentamiento y garantizando hasta 4 semanas sin desprendimientos.",
          },
          {
            step: "03",
            title: "Nuevo Local Diseñado para tu Calma",
            desc: "Un espacio luminoso inspirado en tonos arena, lino y piedra cálida, con puestos ergonómicos equipados con aspiración de polvo de alto caudal.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-7 rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] space-y-3"
          >
            <span className="w-8 h-8 rounded-full bg-[#E3DAC9] text-[#2D2C28] flex items-center justify-center text-xs font-serif font-semibold">
              {item.step}
            </span>
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              {item.title}
            </h2>
            <p className="text-xs text-[#5B5650] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
