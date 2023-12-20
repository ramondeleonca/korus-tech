// Global styles
import AppContextProvider from '@/components/AppContext';
import './globals.scss';
import "./theme.scss";

// Font Imports
import { Montserrat } from "next/font/google";

// Metadata / META tags
export const metadata = {
  title: 'Korus'
}

// Fonts
const montserrat = Montserrat({ preload: true, subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className={`${montserrat.className}`}>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  )
}
