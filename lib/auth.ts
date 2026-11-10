import { createClient } from "@/lib/supabase-server";

export async function getCurrentUser() {
    const supabase = await createClient()

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single()

    return {
        id: user.id,
        email: user.email,
        fullName: profile?.full_name ?? user.user_metadata?.full_name ?? '',
        role: roleData?.role ?? 'customer',
    }
}
