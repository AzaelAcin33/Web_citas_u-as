"use server";

import { createClient } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";

export async function cancelAppointment(appointmentId: string) {
    try {
        // Comprobar usuario y permisos
        const user = await getCurrentUser();

        if (!user || !["admin", "superadmin"].includes(user.role)) {
            console.error("Usuario sin permisos:", user?.role ?? "Sin sesión");

            return {
                success: false,
                message: `Acceso denegado. Rol detectado: ${user?.role ?? "Sin sesión"}`,
            };
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from("appointments")
            .update({ status: "cancelled" })
            .eq("id", appointmentId)
            .neq("status", "completed")
            .select("id")
            .maybeSingle();

        if (error) {
            console.error("Error de Supabase:", error);

            return {
                success: false,
                message: `Error al cancelar: ${error.message}`,
            };
        }

        if (!data) {
            return {
                success: false,
                message: "No se encontró la reserva o ya está completada.",
            };
        }

        return {
            success: true,
            message: "Reserva cancelada correctamente.",
        };
    } catch (error) {
        console.error("Error inesperado:", error);

        return {
            success: false,
            message: "Ha ocurrido un error al cancelar la reserva.",
        };
    }
}

export async function confirmManualDeposit(appointmentId: string) {
    const user = await getCurrentUser();

    if (!user || !["admin", "superadmin"].includes(user.role)) {
        return {
            success: false,
            message: "No tienes permisos para confirmar anticipos.",
        };
    }
    const supabase = await createClient();
    const { data, error } = await supabase.rpc(
        "confirm_manual_deposit", {
        p_appointment_id: appointmentId,
    }
    );

    if (error) {
        console.error("Error confirmando anticipo:", error);

        return {
            success: false,
            message: error.message,
        };
    }

    return {
        success: true,
        message: "Anticipo registrado y reserva confirmada."
    }
}

export async function registerRemainingPayment(appointmentId: string) {
    try {
        const user = await getCurrentUser();

        if (!user || !["admin", "superadmin"].includes(user.role)) {
            return {
                success: false,
                message: "No tienes permisos para registrar pagos.",
            };
        }
        const supabase = await createClient();
        const { data, error } = await supabase.rpc(
            "register_remaining_payment", {
            p_appointment_id: appointmentId,
        }
        );

        if (error) {
            console.error("Error registrando el pago restante:", error);

            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: data?.message ?? "Pago restante registrado correctamente.",
        }
    } catch (error) {
        console.error("Error inesperado:", error);

        return {
            success: false,
            message: "Ocurrio un error al registrar el pago"
        }
    }
}