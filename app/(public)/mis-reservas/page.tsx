import { requireUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { start } from 'repl'

export default async function MisReservasPege() {
    const user = await requireUser()
    const supabase = await createClient()

    const { data: customer, error: customerError } = await supabase
        .from('customers').select('id').eq('profile_id', user.id).maybeSingle()

    if (customerError) {
        console.error('Error buscando clientes:', customerError.message)
    }

    // Si aún no existe el cliente
    if (!customer) {
        return (
            <main className="min-h-screen bg-[#f7f4ee] px-6 py-16">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-4 text-4xl font-serif">Mis reservas</h1>
                    <p className="text-gray-600">
                        No hemos encontrado tu perfil de cliente.
                    </p>
                </div>
            </main>
        )
    }

    const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
      id,
      starts_at,
      ends_at,
      status,
      service_name_snapshot,
      price_snapshot,
      deposit_required,
      notes
    `).eq('customer_id', customer.id).order('starts_at', { ascending: false })

    if (error) {
        console.error('Error consultando reservas:', error.message)
    }

    const reservations = appointments ?? []

    const upcoming = reservations.filter(
        (appointment) =>
            new Date(appointment.starts_at) >= new Date() &&
            appointment.status !== 'cancelled'
    )

    const history = reservations.filter(
        (appointment) =>
            new Date(appointment.starts_at) >= new Date() &&
            appointment.status !== 'cancelled'
    )

    function formatDate(date: string) {
        return new Intl.DateTimeFormat('es-ES', {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(new Date(date))
    }

    function statusLabel(status: string) {
        const labels: Record<string, string> = {
            pending_payment: 'Pendiente de pago',
            confirmed: 'Confirmada',
            cancelled: 'Cancelada',
            completed: 'Completada'
        }
        return labels[status] ?? status
    }

    return (
        <main className="min-h-screen bg-[#f7f4ee] px-6 py-16">
            <div className="mx-auto max-w-5xl">

                <div className="mb-12">
                    <h1 className="text-4xl font-serif text-[#292824]">
                        Mis reservas
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Hola, {user.fullName}. Aquí puedes consultar tus citas.
                    </p>
                </div>

                <section className="mb-12">
                    <h2 className="mb-6 text-2xl font-serif">
                        Próximas citas
                    </h2>

                    {upcoming.length === 0 ? (
                        <div className="rounded-2xl border border-[#e5ded1] bg-white p-10 text-center">
                            <h3 className="text-xl font-serif">
                                Todavía no tienes reservas
                            </h3>

                            <Link
                                href="/reservas"
                                className="mt-6 inline-block rounded-full bg-[#292824] px-8 py-3 text-white"
                            >
                                Reservar una cita
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {upcoming.map((appointment) => (
                                <article
                                    key={appointment.id}
                                    className="rounded-2xl border border-[#e5ded1] bg-white p-6"
                                >
                                    <div className="flex flex-wrap justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-serif">
                                                {appointment.service_name_snapshot}
                                            </h3>

                                            <p className="mt-2 text-gray-500">
                                                {formatDate(appointment.starts_at)}
                                            </p>
                                        </div>

                                        <span className="h-fit rounded-full bg-[#eee8dc] px-4 py-2 text-sm">
                                            {statusLabel(appointment.status)}
                                        </span>
                                    </div>

                                    <div className="mt-5 border-t border-gray-100 pt-4">
                                        <p>Precio: {appointment.price_snapshot} €</p>
                                        <p>Señal: {appointment.deposit_required} €</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="mb-6 text-2xl font-serif">
                        Historial de reservas
                    </h2>

                    {history.length === 0 ? (
                        <p className="text-gray-500">
                            Todavía no tienes citas anteriores.
                        </p>
                    ) : (
                        <div className="grid gap-4">
                            {history.map((appointment) => (
                                <article
                                    key={appointment.id}
                                    className="rounded-xl border border-[#e5ded1] bg-white p-6"
                                >
                                    <h3 className="font-serif text-lg">
                                        {appointment.service_name_snapshot}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        {formatDate(appointment.starts_at)}
                                    </p>

                                    <p className="mt-2 text-sm">
                                        {statusLabel(appointment.status)}
                                    </p>

                                    <p className="mt-1">
                                        {appointment.price_snapshot} €
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </main>
    )
}