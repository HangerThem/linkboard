import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import "./global.css"
import prisma from "@/lib/prisma"
import { Theme } from "@/prisma/generated/enums"

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await prisma.setting.findUnique({
    where: { id: "default" },
  })

  const theme = (settings?.theme as Theme).replace(/_/g, "-") || Theme.default

  return (
    <html lang="en" data-theme={theme}>
      <body className="bg-theme-bg min-h-screen font-sans transition-colors duration-300">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
