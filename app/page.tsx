import { createClient } from '@/lib/supabase-server'

export default async function Home() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('service_categories')
    .select('id, name')

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Conexión con Supabase
      </h1>

      {error ? (
        <p className="mt-4 text-red-600">
          Error de conexión: {error.message}
        </p>
      ) : (
        <div className="mt-4">
          <p className="text-green-600">
            ¡Conexión correcta con Supabase!
          </p>

          <h2 className="mt-4 font-bold">
            Categorías encontradas:
          </h2>

          <pre className="mt-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}