"use client";

import { useState } from "react";
import {
  INITIAL_APPOINTMENTS,
  INITIAL_CUSTOMERS,
  INITIAL_PAYMENTS,
} from "@/lib/mock-data";
import { Appointment, AppointmentStatus, PaymentRecord } from "@/lib/types";

export default function AdminReservasPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const registerRemainingPayment = (apt: Appointment) => {
    const remaining = apt.price_snapshot - apt.deposit_required;
    const newPay: PaymentRecord = {
      id: `pay-${Date.now()}`,
      appointment_id: apt.id,
      enrollment_id: null,
      amount: remaining,
      currency: "EUR",
      payment_type: "remaining",
      status: "approved",
      provider: "TPV Local / Efectivo",
      provider_reference: `LOCAL-${apt.id}`,
      created_at: new Date().toISOString(),
      paid_at: new Date().toISOString(),
    };
    setPayments((prev) => [newPay, ...prev]);
    updateAppointmentStatus(apt.id, "completed");
  };

  const filteredAppointments = appointments.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
            Agenda y Pagos
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#2D2C28] mt-1">
            Gestión de Reservas y Cobros (50%)
          </h1>
          <p className="text-xs text-[#5B5650] mt-1">
            Controla las citas reservadas, verifica el pago del anticipo del 50% y registra el cobro del importe restante al finalizar en cabina.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: "all", label: "Todas" },
            { id: "pending_payment", label: "Pendiente Anticipo" },
            { id: "confirmed", label: "Confirmadas (50%)" },
            { id: "completed", label: "Completadas" },
            { id: "cancelled", label: "Canceladas" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3.5 py-2 rounded-full font-medium transition-colors ${
                statusFilter === f.id
                  ? "bg-[#2D2C28] text-[#FAF9F7]"
                  : "bg-[#F1EDE4] text-[#5B5650] hover:bg-[#E3DAC9]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de citas */}
      <div className="space-y-4">
        {filteredAppointments.map((apt) => {
          const customer = INITIAL_CUSTOMERS.find(
            (c) => c.id === apt.customer_id
          );
          const aptPayments = payments.filter((p) => p.appointment_id === apt.id);
          const paidAmount = aptPayments
            .filter((p) => p.status === "approved")
            .reduce((sum, p) => sum + p.amount, 0);
          const pendingAmount = Math.max(0, apt.price_snapshot - paidAmount);

          return (
            <div
              key={apt.id}
              className="p-6 rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-xs"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-serif text-lg font-semibold text-[#2D2C28]">
                    {apt.service_name_snapshot}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[11px] font-medium ${
                      apt.status === "confirmed"
                        ? "bg-[#E3DAC9] text-[#2D2C28]"
                        : apt.status === "completed"
                        ? "bg-[#2D2C28] text-[#FAF9F7]"
                        : apt.status === "pending_payment"
                        ? "bg-[#F1EDE4] border border-[#B6AEA1] text-[#5B5650]"
                        : "bg-[#EBE5D9] text-[#878378]"
                    }`}
                  >
                    Estado: {apt.status}
                  </span>
                </div>

                <p className="text-[#2D2C28] font-medium">
                  Clienta: {customer?.full_name} · Tel: {customer?.phone} · Email:{" "}
                  {customer?.email}
                </p>

                <p className="text-[#5B5650]">
                  Inicio:{" "}
                  <strong>
                    {new Date(apt.starts_at).toLocaleDateString("es-ES")} (
                    {new Date(apt.starts_at).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </strong>{" "}
                  · Notas: {apt.notes || "Sin notas"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:items-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#EBE5D9]">
                <div className="p-3.5 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-1 min-w-[210px]">
                  <div className="flex justify-between">
                    <span className="text-[#878378]">Total cita:</span>
                    <strong className="text-[#2D2C28]">{apt.price_snapshot} €</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#878378]">Anticipo requerido (50%):</span>
                    <span>{apt.deposit_required} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#878378]">Ya abonado:</span>
                    <strong className="text-[#2D2C28]">{paidAmount} €</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#EBE5D9]">
                    <span className="text-[#5B5650] font-medium">Pendiente en salón:</span>
                    <strong className="text-[#2D2C28]">{pendingAmount} €</strong>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {apt.status === "pending_payment" && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
                      className="px-4 py-2 rounded-xl bg-[#E3DAC9] text-[#2D2C28] font-medium hover:bg-[#B6AEA1]"
                    >
                      Confirmar Anticipo Manual
                    </button>
                  )}
                  {apt.status === "confirmed" && pendingAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => registerRemainingPayment(apt)}
                      className="px-4 py-2 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650]"
                    >
                      Cobrar 50% Restante ({pendingAmount} €) y Completar
                    </button>
                  )}
                  {apt.status !== "cancelled" && (
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                      className="px-4 py-2 rounded-xl border border-[#EBE5D9] text-[#878378] hover:text-[#2D2C28]"
                    >
                      Cancelar cita
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
