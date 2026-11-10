"use client";

import Link from "next/link";
import { useState } from "react";
import {
  INITIAL_AVAILABILITY_EXCEPTIONS,
  INITIAL_BUSINESS_HOURS,
  INITIAL_SERVICES,
  INITIAL_SERVICE_CATEGORIES,
} from "@/lib/mock-data";

const AVAILABLE_TIME_SLOTS = [
  "09:30",
  "10:30",
  "11:45",
  "13:00",
  "16:00",
  "17:15",
  "18:30",
];

export default function ReservasPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    INITIAL_SERVICES[0].id
  );
  const [nailShape, setNailShape] = useState<string>("Almendra de salón");
  const [needsRemoval, setNeedsRemoval] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("2026-11-18");
  const [selectedTime, setSelectedTime] = useState<string>("10:30");

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [paymentMethod, setPaymentMethod] = useState<
    "stripe_card" | "bizum" | "apple_pay"
  >("stripe_card");
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  const selectedService =
    INITIAL_SERVICES.find((s) => s.id === selectedServiceId) ||
    INITIAL_SERVICES[0];

  const extraRemovalPrice = needsRemoval ? 10 : 0;
  const extraRemovalMinutes = needsRemoval ? 20 : 0;
  const totalPrice = selectedService.price + extraRemovalPrice;
  const depositAmount = Number((totalPrice * 0.5).toFixed(2));
  const remainingAmount = Number((totalPrice - depositAmount).toFixed(2));
  const totalDuration = selectedService.duration_minutes + extraRemovalMinutes;

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setStep(4);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EBE5D9] pb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
            Agenda Online
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D2C28] mt-1">
            Reservar Cita de Uñas
          </h1>
          <p className="text-sm text-[#5B5650] mt-2">
            Selecciona tu servicio, día y hora. Tu cita quedará confirmada al instante abonando el{" "}
            <strong className="text-[#2D2C28]">50% de anticipo</strong>.
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center gap-2 text-xs">
          {[
            { num: 1, label: "1. Servicio" },
            { num: 2, label: "2. Fecha y Hora" },
            { num: 3, label: "3. Datos y Anticipo" },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => !bookingConfirmed && setStep(s.num as 1 | 2 | 3)}
              className={`px-3.5 py-2 rounded-full font-medium transition-colors ${
                step === s.num
                  ? "bg-[#2D2C28] text-[#FAF9F7]"
                  : step > s.num
                  ? "bg-[#E3DAC9] text-[#2D2C28]"
                  : "bg-[#F1EDE4] text-[#878378]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* PASO 1 */}
          {step === 1 && (
            <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 sm:p-8 space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#2D2C28]">
                  Paso 1 · Selecciona el servicio de uñas
                </h2>
                <p className="text-xs text-[#5B5650] mt-1">
                  Elige el tratamiento principal para calcular automáticamente la duración y el anticipo.
                </p>
              </div>

              <div className="space-y-6">
                {INITIAL_SERVICE_CATEGORIES.map((category) => {
                  const catServices = INITIAL_SERVICES.filter(
                    (srv) => srv.category_id === category.id && srv.is_active
                  );
                  return (
                    <div key={category.id} className="space-y-3">
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-[#878378] border-b border-[#EBE5D9] pb-1.5">
                        {category.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {catServices.map((srv) => {
                          const isSelected = srv.id === selectedServiceId;
                          return (
                            <button
                              key={srv.id}
                              type="button"
                              onClick={() => setSelectedServiceId(srv.id)}
                              className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                isSelected
                                  ? "bg-[#E3DAC9]/60 border-[#2D2C28] shadow-xs"
                                  : "bg-[#F7F4EF] border-[#EBE5D9] hover:border-[#B6AEA1]"
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-serif font-semibold text-base text-[#2D2C28]">
                                    {srv.name}
                                  </span>
                                  {isSelected && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-[10px]">
                                      Seleccionado
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#5B5650] mt-1 line-clamp-2">
                                  {srv.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-[#EBE5D9]/80 text-xs">
                                <span className="text-[#878378]">
                                  {srv.duration_minutes} min
                                </span>
                                <div className="text-right">
                                  <strong className="text-sm text-[#2D2C28]">
                                    {srv.price} €
                                  </strong>
                                  <span className="text-[11px] text-[#5B5650] ml-1.5">
                                    (Anticipo {(srv.price / 2).toFixed(0)} €)
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-5 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-4">
                <h3 className="font-serif text-base font-semibold text-[#2D2C28]">
                  Preferencias para tu servicio
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5B5650] mb-1.5">
                      Forma preferida de la uña
                    </label>
                    <select
                      value={nailShape}
                      onChange={(e) => setNailShape(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1] text-xs text-[#2D2C28]"
                    >
                      <option value="Almendra de salón">Almendra de salón (Recomendada)</option>
                      <option value="Cuadrada suave (Squoval)">Cuadrada suave (Squoval)</option>
                      <option value="Cuadrada definida">Cuadrada definida</option>
                      <option value="Ovalada natural">Ovalada natural</option>
                      <option value="Bailarina / Coffin">Bailarina / Coffin</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-start gap-3 cursor-pointer text-xs text-[#2D2C28] bg-[#FAF9F7] p-3.5 rounded-xl border border-[#EBE5D9] w-full">
                      <input
                        type="checkbox"
                        checked={needsRemoval}
                        onChange={(e) => setNeedsRemoval(e.target.checked)}
                        className="mt-0.5 accent-[#2D2C28]"
                      />
                      <span>
                        <strong className="block">Llevo material de otro centro para retirar</strong>
                        <span className="text-[#878378]">
                          Añade +20 min y +10 € (5 € en el anticipo)
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-7 py-3.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650] transition-colors"
                >
                  Continuar a Fecha y Hora
                </button>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#2D2C28]">
                  Paso 2 · Selecciona el día y la hora de tu cita
                </h2>
                <p className="text-xs text-[#5B5650] mt-1">
                  Los tramos horarios tienen en cuenta la duración de tu servicio ({totalDuration} minutos).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5650]">
                    Fecha de la cita
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min="2026-11-11"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-sm text-[#2D2C28]"
                  />

                  <div className="p-4 rounded-xl bg-[#F1EDE4] border border-[#E3DAC9] text-xs space-y-1.5">
                    <p className="font-semibold text-[#2D2C28]">
                      Horario habitual del estudio:
                    </p>
                    {INITIAL_BUSINESS_HOURS.map((bh) => (
                      <div key={bh.id} className="flex justify-between text-[#5B5650]">
                        <span>{bh.weekday_label}</span>
                        <span>
                          {bh.is_closed
                            ? "Cerrado"
                            : `${bh.opens_at} - ${bh.closes_at}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5B5650]">
                    Horas disponibles para el {selectedDate}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {AVAILABLE_TIME_SLOTS.map((slot) => {
                      const active = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 px-4 rounded-xl text-xs font-medium border transition-all ${
                            active
                              ? "bg-[#2D2C28] text-[#FAF9F7] border-[#2D2C28]"
                              : "bg-[#F7F4EF] text-[#2D2C28] border-[#EBE5D9] hover:border-[#B6AEA1]"
                          }`}
                        >
                          {slot} h
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F7F4EF] border border-[#EBE5D9] text-[11px] text-[#5B5650]">
                    <strong className="text-[#2D2C28] block mb-1">
                      Días con horario especial o cierre:
                    </strong>
                    {INITIAL_AVAILABILITY_EXCEPTIONS.map((exc) => (
                      <p key={exc.id}>
                        - {new Date(exc.starts_at).toLocaleDateString("es-ES")}: {exc.reason}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-full border border-[#B6AEA1] text-xs font-medium text-[#5B5650] hover:text-[#2D2C28]"
                >
                  Cambiar servicio
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-7 py-3.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650]"
                >
                  Continuar a Datos y Pago
                </button>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <form
              onSubmit={handleConfirmPayment}
              className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 sm:p-8 space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#2D2C28]">
                  Paso 3 · Tus datos y pago del anticipo (50%)
                </h2>
                <p className="text-xs text-[#5B5650] mt-1">
                  ¿Ya tienes cuenta en la web?{" "}
                  <Link href="/login" className="text-[#2D2C28] font-semibold underline">
                    Inicia sesión aquí
                  </Link>{" "}
                  para completar tus datos automáticamente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#2D2C28] mb-1">
                    Nombre y apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Claudia Morales Vega"
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-xs text-[#2D2C28]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D2C28] mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-xs text-[#2D2C28]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D2C28] mb-1">
                    Teléfono móvil (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 600 00 00 00"
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-xs text-[#2D2C28]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#2D2C28] mb-1">
                    Observaciones sobre el diseño o tus uñas (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Indica si prefieres algún tono o acabado concreto (milky, baby boomer, francesa fina) o si necesitas reparar alguna uña."
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-xs text-[#2D2C28]"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F1EDE4] border border-[#E3DAC9] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
                    Método de pago para el anticipo ({depositAmount.toFixed(2)} €)
                  </h3>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF9F7] border border-[#B6AEA1] text-[#2D2C28] font-medium">
                    Pasarela Cifrada
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "stripe_card",
                      title: "Tarjeta Bancaria",
                      sub: "Visa, Mastercard, Maestro",
                    },
                    {
                      id: "bizum",
                      title: "Bizum Instantáneo",
                      sub: "Confirmación con tu móvil",
                    },
                    {
                      id: "apple_pay",
                      title: "Apple Pay / Google Pay",
                      sub: "Pago rápido en 1 clic",
                    },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          pm.id as "stripe_card" | "bizum" | "apple_pay"
                        )
                      }
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        paymentMethod === pm.id
                          ? "bg-[#2D2C28] text-[#FAF9F7] border-[#2D2C28]"
                          : "bg-[#FAF9F7] text-[#2D2C28] border-[#EBE5D9]"
                      }`}
                    >
                      <span className="block text-xs font-semibold">{pm.title}</span>
                      <span
                        className={`block text-[11px] mt-0.5 ${
                          paymentMethod === pm.id ? "text-[#E3DAC9]" : "text-[#878378]"
                        }`}
                      >
                        {pm.sub}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-[#5B5650] leading-relaxed">
                  Al confirmar serás redirigida de forma segura a la pasarela de pagos. Nunca almacenamos números de tarjeta ni códigos de seguridad en nuestros servidores.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full border border-[#B6AEA1] text-xs font-medium text-[#5B5650]"
                >
                  Volver a Fecha y Hora
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-semibold hover:bg-[#5B5650] transition-colors shadow-sm"
                >
                  Abonar Anticipo ({depositAmount.toFixed(2)} €) y Confirmar Cita
                </button>
              </div>
            </form>
          )}

          {/* PASO 4 */}
          {step === 4 && bookingConfirmed && (
            <div className="rounded-3xl bg-[#F1EDE4] border-2 border-[#B6AEA1] p-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium">
                <span>Reserva Confirmada y Anticipo Abonado</span>
              </div>

              <h2 className="font-serif text-3xl font-semibold text-[#2D2C28]">
                Te esperamos en el estudio, {fullName || "Clienta"}
              </h2>

              <p className="text-sm text-[#5B5650] leading-relaxed">
                Tu cita ha quedado confirmada y hemos enviado el justificante de reserva junto con el recibo del anticipo ({depositAmount.toFixed(2)} €) a tu correo electrónico.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F7] p-5 rounded-2xl border border-[#E3DAC9] text-xs">
                <div>
                  <span className="text-[#878378] block">Servicio reservado</span>
                  <strong className="text-[#2D2C28] text-sm">{selectedService.name}</strong>
                  <span className="block text-[#5B5650] mt-0.5">
                    Forma: {nailShape} {needsRemoval ? "· Con retirada previa" : ""}
                  </span>
                </div>
                <div>
                  <span className="text-[#878378] block">Fecha y hora</span>
                  <strong className="text-[#2D2C28] text-sm">
                    {selectedDate} a las {selectedTime} h
                  </strong>
                  <span className="block text-[#5B5650] mt-0.5">
                    Duración estimada: {totalDuration} min
                  </span>
                </div>
                <div>
                  <span className="text-[#878378] block">Anticipo pagado hoy (50%)</span>
                  <strong className="text-[#2D2C28] text-sm">
                    {depositAmount.toFixed(2)} €
                  </strong>
                </div>
                <div>
                  <span className="text-[#878378] block">Restante a abonar en el local</span>
                  <strong className="text-[#5B5650] text-sm">
                    {remainingAmount.toFixed(2)} €
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium"
                >
                  Ver mi cita en Mi Cuenta
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setBookingConfirmed(false);
                    setStep(1);
                  }}
                  className="px-6 py-3 rounded-full bg-[#FAF9F7] border border-[#B6AEA1] text-[#2D2C28] text-xs font-medium"
                >
                  Realizar otra reserva
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resumen Persistente */}
        <aside className="lg:col-span-4 sticky top-28 rounded-3xl bg-[#F7F4EF] border border-[#E3DAC9] p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EBE5D9] pb-4">
            <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
              Resumen de tu Cita
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#E3DAC9] text-[#2D2C28] font-medium">
              Anticipo 50%
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src={selectedService.image_path}
              alt={selectedService.name}
              className="w-16 h-16 rounded-2xl object-cover border border-[#B6AEA1]"
            />
            <div>
              <p className="font-serif font-semibold text-sm text-[#2D2C28]">
                {selectedService.name}
              </p>
              <p className="text-xs text-[#878378] mt-0.5">
                {totalDuration} min · Forma: {nailShape}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs border-y border-[#EBE5D9] py-4">
            <div className="flex justify-between">
              <span className="text-[#878378]">Fecha seleccionada:</span>
              <strong className="text-[#2D2C28]">{selectedDate}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#878378]">Hora de inicio:</span>
              <strong className="text-[#2D2C28]">{selectedTime} h</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#878378]">Servicio base:</span>
              <span className="text-[#2D2C28]">{selectedService.price.toFixed(2)} €</span>
            </div>
            {needsRemoval && (
              <div className="flex justify-between">
                <span className="text-[#878378]">Suplemento retirada previa:</span>
                <span className="text-[#2D2C28]">+{extraRemovalPrice.toFixed(2)} €</span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-[#5B5650]">Importe total del servicio</span>
              <strong className="font-serif text-lg text-[#2D2C28]">
                {totalPrice.toFixed(2)} €
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-[#E3DAC9] text-[#2D2C28] flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold block">
                  Anticipo a abonar hoy (50%)
                </span>
                <span className="text-[11px] text-[#5B5650]">
                  Para confirmar tu reserva
                </span>
              </div>
              <span className="font-serif text-2xl font-bold">
                {depositAmount.toFixed(2)} €
              </span>
            </div>

            <div className="flex justify-between text-xs text-[#878378] px-1">
              <span>Restante a abonar en el estudio:</span>
              <strong className="text-[#5B5650]">{remainingAmount.toFixed(2)} €</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
