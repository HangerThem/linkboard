import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import "./global.css"

export const metadata: Metadata = {
  icons: ["/profile.png"],
  description: "LinkBoard - A simple and customizable link board application.",
  authors: [
    {
      name: "HangerThem",
      url: "https://hangerthem.com",
    },
  ],
  keywords: ["link", "board", "linkboard", "bulletin", "bulletin"],
  creator: "HangerThem",
  publisher: "HangerThem",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
