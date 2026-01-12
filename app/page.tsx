import Link from "next/link"
import Icon from "@/components/icon"
import ShareBar from "@/components/sharebar/sharebar"
import Source from "@/components/source/source"
import Image from "next/image"
import prisma from "@/lib/prisma"
import LinksList from "@/components/links/LinksList"

export default async function Page() {
  const topLinks = await prisma.topLink.findMany()
  const normalLinks = await prisma.normalLink.findMany()

  return (
    <div className="min-h-screen bg-black text-white">
      <ShareBar />
      <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-full blur-sm opacity-75" />
            <Image
              src="/profile.png"
              alt="Profile"
              width={120}
              height={120}
              className="relative rounded-full border-2 border-neutral-800"
            />
          </div>
        </div>

        <div className="space-y-4 flex justify-center">
          {topLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 block cursor-pointer"
            >
              {link.icon && <Icon name={link.icon} size={32} />}
            </Link>
          ))}
        </div>

        <LinksList links={normalLinks} />

        <div className="flex justify-center pt-8">
          <Source />
        </div>
      </main>
    </div>
  )
}
