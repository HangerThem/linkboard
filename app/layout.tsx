import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import data from "@/config"
import "@/styles/global.css";
import "@/styles/normalize.css";
import "@/styles/variables.css";


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
				{children}
				<Analytics />
			</body>
		</html>
	);
}
