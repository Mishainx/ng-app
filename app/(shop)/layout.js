import { Inter } from "next/font/google";
import "../globals.css";
import Header from "../../src/components/header/header";
import Footer from "../../src/components/footer/footer";
import WhatsappButton from "../../src/components/whatsapp/Whatsapp";
import TopButton from "../../src/components/topbutton/TopButton";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nippon Game",
  description: "Ecommerce mayorista de videojuegos",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className= {`${inter.className}  bg-slate-100`}>

        <AuthProvider>
        <CategoriesProvider>
              <Header/>
              <ToastContainer/>
              {children}
              <Footer/>
              <TopButton/>
              <WhatsappButton/>
          </CategoriesProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
