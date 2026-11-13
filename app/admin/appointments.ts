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