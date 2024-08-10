import { useRouter } from "next/navigation"; // Importa el hook useRouter para redirección

export default function RegisterMessage (){
    
    const router = useRouter(); // Inicializa useRouter

    const handleRedirect = () => {
        router.push("/");
      };

    return (
        <div className="p-6 sm:px-8 rounded-xl bg-gray-800 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-6">
            Usuario registrado correctamente
            </h2>
            <button
            onClick={handleRedirect}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
            OK
            </button>
        </div>
    )
}