"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

const Qr = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { qrLogin } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await qrLogin(code);
      setShowModal(false);
      router.push("/catalogo");
    } catch (err) {
      setError(err.message || 'Error al verificar el código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ingrese el Código</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label htmlFor="code" className="block text-gray-700 text-sm font-bold">
                Código:
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className={`flex justify-center items-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition focus:outline-none focus:shadow-outline ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Verificando..." : "Verificar Código"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Qr;
