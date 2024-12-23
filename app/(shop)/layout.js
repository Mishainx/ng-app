import { Inter } from "next/font/google";
import "../globals.css";
import Header from "../../src/components/header/header";
import Footer from "../../src/components/footer/footer";
import WhatsappButton from "../../src/components/whatsapp/Whatsapp";
import TopButton from "../../src/components/topbutton/TopButton";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import { PageProvider } from "@/context/PageContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { TicketsProvider } from "@/context/TicketsContext";

// Cargar la fuente Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nippon Game",
  description: "Ecommerce mayorista de videojuegos",
  openGraph: {
    title: 'Nippongame - Próximamente',
    description: 'Ecommerce mayorista experto en videojuegos',
    url: 'https://www.nippongame.com.ar',
    images: [
      {
        url: 'https://www.nippongame.com.ar/proximamente/nippon-game-logo.png',
        width: 1200,
        height: 630,
        alt: 'Nippongame logo',
      },
    ],
  }
};

// Función para obtener categorías en SSR utilizando Server Component
async function fetchCategories() {
  let categories = [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`,{next:{revalidate:1800}});
    const data = await response.json();
    categories = data.payload;
    console.log("Fetching categories successful");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return categories;
}

export default async function RootLayout({ children }) {
  const categories = await fetchCategories();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100`}>
        <AuthProvider>
          <CategoriesProvider initialCategories={categories}>
            <ProductsProvider>
              <PageProvider>
                <TicketsProvider>
                  <Header />
                  <ToastContainer />
                  {children}
                  <Footer />
                  <TopButton />
                  <WhatsappButton />
                </TicketsProvider>
              </PageProvider>
            </ProductsProvider>
          </CategoriesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
