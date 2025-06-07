import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'
import { AuthInfoContextProvider } from './authInfo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  themeColor: '#ffffff', // Force light theme
  title: {
    default: 'Smart Blood Bank',
    template: '%s | Smart Blood Bank'
  },
  description: 'Your app description goes here',
  keywords: ['nextjs', 'react', 'typescript'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourapp.com',
    title: 'Your App Name',
    description: 'Your app description goes here',
    siteName: 'Your App Name',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your App Name',
    description: 'Your app description goes here',
    creator: '@yourusername',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthInfoContextProvider>
        <div className="min-h-screen flex flex-col w-full h-full">
          <header className="shadow-sm">
            <Navbar />
          </header>

          <main className="flex items-center justify-center w-full h-full m-0 p-0 root-main-layout">
            {children}
          </main>

          <Footer/>
        </div>
        </AuthInfoContextProvider>
      </body>
    </html>
  )
}