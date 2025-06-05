import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#EEEDE4] text-center px-4">
            <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Página no encontrada</h2>
            <p className="text-gray-600 mb-6">
                La página que estás buscando no existe o fue movida.
            </p>
            <Link
                to="/"
                className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-500 transition"
            >
                Volver al inicio
            </Link>
        </div>
    )
}

export default NotFound
