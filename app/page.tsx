import Link from "next/link"
import Icon from "@/components/icon"
import ShareBar from "@/components/sharebar/sharebar"
import Source from "@/components/source/source"
import Image from "next/image"
import prisma from "@/lib/prisma"
import LinksList from "@/components/links/LinksList"
import * as Icons from "react-bootstrap-icons"

export default async function Page() {
  const topLinks = await prisma.topLink.findMany({
    orderBy: { order: "asc" },
  })
  const normalLinks = await prisma.normalLink.findMany({
    where: { linkGroupId: null },
    orderBy: { order: "asc" },
  })
  const linkGroups = await prisma.linkGroup.findMany({
    include: {
      links: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  })

  const settings = (await prisma.setting.findUnique({
    where: { id: "default" },
  }))!

  const profile = (await prisma.profile.findUnique({
    where: { id: "default" },
  }))!

  return (
    <div>
      {/* {process.env.NODE_ENV === "development" && (
        <Link
          href="/editor"
          title="Go to Editor"
          className="theme-floating-btn bottom-4 right-4"
        >
          <Icon name="PencilSquare" size={24} />
        </Link>
      )}
      {settings.shareBar && <ShareBar />} */}
      <main className="max-w-2xl mx-auto px-4 py-12 space-y-4">
        <div className="flex flex-col items-center">
          {profile.avatar && (
            <div className="theme-profile-image bg-white w-48 h-48">
              <Image
                src={profile.avatar}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          )}
          <h2 className="mt-4 text-2xl font-bold theme-text-primary text-center">
            {profile.name}
          </h2>
          {profile.bio && (
            <p className="mt-2 text-center theme-text-muted whitespace-pre-line">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="space-y-4 flex justify-center">
          {topLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 block theme-text-secondary hover:theme-text-primary transition-colors"
            >
              {link.icon && (
                <Icon name={link.icon as keyof typeof Icons} size={32} />
              )}
            </Link>
          ))}
        </div>

        <LinksList
          links={normalLinks}
          linkGroups={linkGroups}
          density={settings.density}
        />

        {settings.source && (
          <div className="flex justify-center pt-8">
            <Source />
          </div>
        )}
      </main>
    </div>
  )
}
