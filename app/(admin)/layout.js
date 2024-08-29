import "../globals.css";
import { ProductProvider } from "@/context/ProductsContext";

export const metadata = {
  title: 'Admin Panel',
  description: 'Administración del sitio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProductProvider>
          {children}
        </ProductProvider>
      </body>
    </html>
  )
}
