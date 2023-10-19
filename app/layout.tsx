import type { Metadata } from "next";
import "@/styles/global.css";
import "@/styles/normalize.css";
import "@/styles/variables.css";

export const metadata: Metadata = {
  title: "LinkBoard",
  description: "A link board, like a bulletin board, but for links.",
  authors: [
    {
      name: "HangerThem",
      url: "https://hangarthem.com",
    },
  ],
  keywords: ["link", "board", "linkboard", "bulletin", "bulletin"],
  creator: "HangerThem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
