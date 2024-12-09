import "../globals.css";


export const metadata = {
  title: 'Nippongame - Próximamente',
  description: 'Ecommerce mayorista experto en videojuegos',
  openGraph: {
    title: 'Nippongame - Próximamente',
    description: 'Ecommerce mayorista experto en videojuegos',
    url: 'https://www.nippongame.com.ar',
    images: [
      {
        url: '/proximamente/nippon-game-logo.png',  // Ruta de la imagen
        width: 1200,  // Ancho de la imagen
        height: 630,  // Alto de la imagen
        alt: 'Nippongame logo',  // Descripción alternativa de la imagen
      },
    ],
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
      </body>
    </html>
  )
}
