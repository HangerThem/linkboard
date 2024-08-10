import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import data from "@/config";
import ThemeContext from "@/context/themeContext";
import "@/styles/global.css";
import "@/styles/normalize.css";

export const metadata: Metadata = {
  title: data.title,
  description: "A link board, like a bulletin board, but for links.",
  authors: [
    {
      name: "HangerThem",
      url: "https://hangerthem.com",
    },
  ],
  keywords: ["link", "board", "linkboard", "bulletin", "bulletin"],
  creator: "HangerThem",
  publisher: "HangerThem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeContext>{children}</ThemeContext>
        <Analytics />
      </body>
    </html>
  );
}
