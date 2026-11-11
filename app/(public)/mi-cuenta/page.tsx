import { requireUser } from '@/lib/auth'
import { logoutUser } from '@/actions/auth/auth'
import Link from 'next/link'

export default async function MiCuentaPage() {
  const user = await requireUser()

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-16">
      <div className="mx-auto max-w-3xl">

        <h1 className="mb-3 text-4xl font-serif text-[#292824]">
          Mi cuenta
        </h1>

        <p className="mb-10 text-[#77736b]">
          Bienvenid@ a tu espacio personal.
        </p>

        <section className="rounded-2xl border border-[#e5ded1] bg-white p-8 shadow-sm">

          <h2 className="mb-6 text-2xl font-serif">
            Mis datos personales
          </h2>

          <div className="space-y-5">

            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-medium">{user.fullName || 'Sin nombre'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Correo electrónico</p>
              <p className="font-medium">{user.email}</p>
            </div>

          </div>

        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <Link
            href="/mis-reservas"
            className="rounded-xl border border-[#ded6c8] bg-white p-5 transition hover:bg-[#eee8dc]"
          >
            <h3 className="font-semibold">Mis reservas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Consulta tus citas.
            </p>
          </Link>

          <form action={logoutUser}>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#292824] p-5 text-left text-white transition hover:bg-[#45433e]"
            >
              <h3 className="font-semibold">Cerrar sesión</h3>
              <p className="mt-1 text-sm text-gray-300">
                Salir de tu cuenta.
              </p>
            </button>
          </form>

        </div>

      </div>
    </main>
  )
}