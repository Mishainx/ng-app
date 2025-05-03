import { useState, useEffect } from 'react';

const QrDashboard = ({ resetView }) => {
  const [currentCode, setCurrentCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const fetchCurrentCode = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qr`);
        if (response.ok) {
          const data = await response.json();
          setCurrentCode(data.code || '');
          setNewCode(data.code || '');
        } else if (response.status === 404) {
          setCurrentCode('');
          setNewCode('');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al obtener el código');
        }
      } catch (err) {
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentCode();
  }, []);

  const handleUpdateCode = async () => {
    setUpdateSuccess(false);
    setUpdateError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qr`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentCode(data.code);
        setUpdateSuccess(data.message || 'Código actualizado correctamente');
      } else {
        setUpdateError(data.message || 'Error al actualizar el código');
      }
    } catch (err) {
      setUpdateError('Error al conectar con el servidor');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Cargando código...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error al cargar el código: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl flex flex-col gap-5 w-full md:w-3/4 lg:w-1/2 ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Administrar Código de Acceso</h2>

      <div className="mb-4">
        <p className="text-gray-700">
          Código actual: <strong className="font-medium text-indigo-600">{currentCode || 'No configurado'}</strong>
        </p>
        {!currentCode && <p className="text-gray-500 text-sm">No hay código de acceso configurado.</p>}
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="newCode" className="block text-gray-700 text-sm font-bold">
          Nuevo Código:
        </label>
        <input
          type="text"
          id="newCode"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={handleUpdateCode}
          className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition focus:outline-none focus:shadow-outline"
        >
          {currentCode ? 'Actualizar' : 'Crear'}
        </button>
      </div>

      {updateSuccess && (
        <div className="mt-3 text-green-500 text-sm">{updateSuccess}</div>
      )}
      {updateError && (
        <div className="mt-3 text-red-500 text-sm">{updateError}</div>
      )}
    </div>
  );
};

export default QrDashboard;