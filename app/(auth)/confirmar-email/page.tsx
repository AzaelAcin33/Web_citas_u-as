import Link from "next/link";

export default function ConfirmarEmailPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-5 py-16">
            <div className="w-full max-w-lg text-center">

                <div className="w-20 h-20 rounded-full bg-[#E3DAC9] flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-10 h-10 text-[#2D2C28]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>

                <p className="text-xs uppercase tracking-[0.3em] text-[#878378] mb-4">
                    L'Atelier Nails
                </p>

                <h1 className="font-serif text-4xl text-[#2D2C28] mb-5">
                    Confirma tu correo
                </h1>

                <p className="text-[#5B5650] leading-relaxed mb-4">
                    ¡Gracias por registrarte! Te hemos enviado un correo
                    electrónico para verificar tu dirección.
                </p>

                <p className="text-[#5B5650] leading-relaxed mb-8">
                    Abre el mensaje y pulsa el botón de confirmación.
                    Hasta entonces no podrás acceder a tu cuenta.
                </p>

                <div className="bg-[#F1EDE4] border border-[#E3DAC9] rounded-2xl p-5 mb-8">
                    <p className="text-sm text-[#5B5650]">
                        Si no encuentras el mensaje, revisa también
                        la carpeta de spam o correo no deseado.
                    </p>
                </div>

                <Link
                    href="/login"
                    className="inline-flex px-8 py-3 rounded-full bg-[#2D2C28] text-white hover:bg-[#5B5650] transition-colors"
                >
                    Volver al inicio de sesión
                </Link>

            </div>
        </main>
    );
}