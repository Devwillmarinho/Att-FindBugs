import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FindBugs 🐛',
  description: 'Created with DevWill',
  generator: 'Will.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
