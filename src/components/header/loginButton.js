import Link from "next/link";

export default function LoginButton() {


    return (
        <>
                <Link href="/login">
                    <button className="text-xs text-white shadow-md bg-red-500 p-2 rounded-3xl hover:bg-red-700">
                        Iniciar sesión
                    </button>
                </Link>
        </>
    );
}
