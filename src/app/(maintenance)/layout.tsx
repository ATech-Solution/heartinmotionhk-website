import '../globals.css'
import { Caveat, Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' })

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${inter.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
