export default function Tabs({ activeTab, setActiveTab }) {
    return (
      <section className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            className={`py-2 text-lg font-semibold transition-colors duration-300 ease-in-out ${activeTab === "usuario" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600 hover:text-red-500"}`}
            onClick={() => setActiveTab("usuario")}
          >
            Usuario
          </button>
          <button
            className={`py-2 text-lg font-semibold transition-colors duration-300 ease-in-out ${activeTab === "pedidos" ? "text-red-500 border-b-2 border-red-500" : "text-gray-600 hover:text-red-500"}`}
            onClick={() => setActiveTab("pedidos")}
          >
            Pedidos
          </button>
        </div>
      </section>
    );
  }
  