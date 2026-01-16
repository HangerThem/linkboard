import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import {
  K2D,
  Space_Mono,
  VT323,
  Orbitron,
  Caveat,
  Inter,
} from "next/font/google"
import "./global.css"
import prisma from "@/lib/prisma"
import { Theme } from "@/prisma/generated/enums"

const k2d = K2D({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-k2d",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-orbitron",
})

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

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

const themeDataMap: Record<Theme, string> = {
  [Theme.default]: "default",
  [Theme.dark]: "dark",
  [Theme.light]: "light",
  [Theme.neo_brutalism]: "neo-brutalism",
}

const fontVariables = [
  k2d.variable,
  spaceMono.variable,
  vt323.variable,
  orbitron.variable,
  caveat.variable,
  inter.variable,
].join(" ")

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
    <html lang="en" data-theme="retro" className={fontVariables}>
      <body className="bg-theme-bg min-h-screen font-sans transition-colors duration-300">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
