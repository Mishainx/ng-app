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
import { GoogleAnalytics } from '@next/third-parties/google'

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

export default async function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100`}>
        <AuthProvider>
          <CategoriesProvider>
            <ProductsProvider>
              <PageProvider>
                <TicketsProvider>
                  <Header />
                  <ToastContainer />
                  {children}
                  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID} />
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
