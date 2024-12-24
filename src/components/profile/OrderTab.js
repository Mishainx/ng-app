import TicketRow from "./TicketRow";

export default function OrdersTab({ tickets }) {
  return (
    <section className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Mis Tickets</h2>
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tienes tickets disponibles.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ticket ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Monto Total</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Productos</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
