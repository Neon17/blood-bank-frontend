import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'
import { AuthInfoContextProvider } from './authInfo'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Smart Blood Bank',
    template: '%s | Smart Blood Bank'
  },
  description: 'Smart Blood Bank is a location-aware web application to find nearby blood donors, search blood requests, and notify top potential donors within a chosen radius.',
  keywords: ['smart blood bank', 'blood donation', 'nextjs', 'react', 'typescript', 'tailwind', 'donor app', 'blood request', 'location based blood app'],
  authors: [{ name: 'Neon Neupane', url: 'https://yourportfolio.com' }],
  creator: 'Neon Neupane',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smartbloodbank.com',
    title: 'Smart Blood Bank',
    description: 'Find nearby blood donors, search requests, and stay notified about urgent needs based on your location.',
    siteName: 'Smart Blood Bank',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Blood Bank',
    description: 'Find nearby blood donors, search blood requests, and notify top donors in your area.',
    creator: '@neondev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://smartbloodbank.com'),
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute={"class"} defaultTheme='dark' enableSystem disableTransitionOnChange>
          <AuthInfoContextProvider>
            <div className="min-h-screen flex flex-col w-full h-full">
              
                <Navbar />

              <main className="mx-auto m-0 p-0 w-full root-main-layout">
                {children}
              </main>

              <Footer />
            </div>
          </AuthInfoContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}