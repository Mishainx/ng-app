import "../globals.css";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { ClientsProvider } from "@/context/ClientsContext";
import { ToastContainer } from "react-toastify";
import { TicketsProvider } from "@/context/TicketsContext";

export const metadata = {
  title: 'Admin Panel',
  description: 'Administración del sitio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientsProvider>
        <CategoriesProvider>
          <ProductsProvider>
            <TicketsProvider>
            <ToastContainer/>
              {children}
              </TicketsProvider>
          </ProductsProvider>
        </CategoriesProvider>
        </ClientsProvider>

      </body>
    </html>
  )
}
