import './globals.css'

export const metadata = {
  title: 'Study Map - Masters in Finance',
  description: 'Find your perfect Masters in Finance program',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}