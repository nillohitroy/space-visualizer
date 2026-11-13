import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Space Visualizer',
  description: 'Earth Observation Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="selection:bg-cyan-accent selection:text-space-950 flex flex-col min-h-screen">
        <Header />
        <main className="w-full pt-16 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}