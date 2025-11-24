import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* This is a Server Component, so the body tag is safe.
        The className uses the imported font variables.
      */}
      <body className={`font-sans antialiased`}>
        {/* All your pages and components are rendered here */}
        {children}
        
        {/* Vercel Analytics component */}
        <Analytics />
        
        {/* *** DO NOT RE-ADD THE SCRIPT HERE ***
          
          The script that intercepted 'localhost' calls and rewrote them 
          is removed. The actual fix must happen where the API call is made.
        */}
      </body>
    </html>
  )
}