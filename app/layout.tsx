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
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        {/* Debug helper: intercept fetch to log unexpected localhost calls and rewrite them to current origin in production. Remove after debugging. */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            if (typeof window === 'undefined') return;
            const originalFetch = window.fetch.bind(window);
            window.fetch = async function(input, init) {
              try {
                const url = (typeof input === 'string') ? input : (input && input.url) || '';
                const resolved = new URL(url, window.location.href).href;
                if (resolved.includes('localhost')) {
                  console.warn('[debug] fetch to localhost detected, rewriting to current origin:', resolved);
                  // log stack to help find initiator
                  try { throw new Error(); } catch(e) { console.warn('[debug] stack:', e.stack); }
                  // rewrite to current origin preserving path and query
                  const u = new URL(resolved);
                  const newUrl = window.location.origin + u.pathname + u.search + u.hash;
                  // if input is a Request object, recreate it
                  if (input instanceof Request) {
                    input = new Request(newUrl, input);
                  } else {
                    input = newUrl;
                  }
                }
              } catch (err) {
                console.warn('[debug] fetch-intercept error', err);
              }
              return originalFetch(input, init);
            };
          })();
        `}} />
      </body>
    </html>
  )
}
