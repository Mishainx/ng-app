import "../globals.css";


export const metadata = {
  title: 'Próximamente',
  description: 'Próximamente NipponGame expertos en videojuegos',
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
