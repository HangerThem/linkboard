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

// Map enum values to data-theme attribute values
const themeDataMap: Record<Theme, string> = {
  [Theme.default]: "default",
  [Theme.dark]: "dark",
  [Theme.light]: "light",
  [Theme.neo_brutalism]: "neo-brutalism",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await prisma.setting.findUnique({
    where: { id: "default" },
  })

  const themeEnum = (settings?.theme as Theme) || Theme.default
  const theme = themeDataMap[themeEnum] || "default"

  return (
    <html lang="en" data-theme={theme}>
      <body className="bg-theme-bg min-h-screen font-sans transition-colors duration-300">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
