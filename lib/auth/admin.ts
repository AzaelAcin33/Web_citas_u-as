import { createClient } from "../supabase-server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/?auth=required");
    }

    const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

    if (roleError) {
        throw new Error("No se pudieron comprobar los permisos.");
    }

    const isAdmin = roles?.some(
        (item) => item.role === "admin" || item.role === "superadmin"
    );

    if (!isAdmin) {
        redirect("/?auth=forbidden");
    }

    return {
        user,
        role: roles?.some((item) => item.role === "superadmin")
            ? "superadmin"
            : "admin",
    };
}