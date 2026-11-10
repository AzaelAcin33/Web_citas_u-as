'use server'

import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

// Validación de datos

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password: string) {
    return (
        password.length >= 10 &&
        password.length <= 72 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    )
}

// Registro de users

export async function registerUser(formData: FormData) {
    const supabase = await createClient()

    const fullName = String(
        formData.get('full_name') ?? ''
    ).trim()

    const email = String(
        formData.get('email') ?? ''
    ).trim().toLowerCase()

    const password = String(
        formData.get('password') ?? ''
    )

    if (
        !fullName ||
        fullName.length > 100 ||
        !isValidEmail(email) ||
        email.length > 254 ||
        !isValidPassword(password)
    ) {
        redirect('/?auth=invalid-data')
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (error) {
        console.error('Error de registro', error.message)
        redirect('/?auth=register-error')
    }
    console.log('REGISTRO CORRECTO: redirigiendo a inicio')
    redirect('/?auth=registered')
}

// Inicio de sesión

export async function loginUser(formData: FormData) {
    const supabase = await createClient()

    const email = String(
        formData.get('email') ?? ''
    ).trim().toLowerCase()

    const password = String(
        formData.get('password') ?? ''
    )

    if (
        !email ||
        email.length > 254 ||
        !isValidEmail(email) ||
        !password ||
        password.length > 72
    ) {
        redirect('/?auth=invalid-data')
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Error de inicio de sesión:', error.message)
        redirect('/?auth=login-error')
    }

    redirect('/')
}

// Cierre de sesión

export async function logoutUser() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error al cerrar sesión:', error.message)
        redirect('/?auth=logout-error')
    }

    redirect('/')
}