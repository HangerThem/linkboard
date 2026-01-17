import NormalLinks from "@/components/forms/NormalLinks"
import ProfileForm from "@/components/forms/Profile"
import SettingsForm from "@/components/forms/Settings"
import TopLinks from "@/components/forms/TopLinks"
import Icon from "@/components/icon"
import prisma from "@/lib/prisma"
import Link from "next/link"
import Theme from "@/components/forms/Theme"

export default async function EditorPage() {
  const normalLinks = await prisma.normalLink.findMany({
    where: { linkGroupId: null },
    orderBy: { order: "asc" },
  })
  const topLinks = await prisma.topLink.findMany({
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

  const profile = (await prisma.profile.findUnique({
    where: { id: "default" },
  }))!

  const settings = (await prisma.setting.findUnique({
    where: { id: "default" },
  }))!

  return (
    <main className="py-12 px-6">
      <Link
        href="/"
        title="Back to LinkBoard"
        className="theme-floating-btn bottom-4 right-4"
      >
        <Icon name="ArrowLeft" size={24} />
      </Link>

      <h1 className="mb-8 text-center text-4xl font-bold theme-text-primary">
        LinkBoard Editor
      </h1>
      <p className="mb-12 text-center theme-text-muted">
        Use the forms below to customize your LinkBoard profile, links, and
        settings.
      </p>

      <div className="space-y-8">
        <ProfileForm data={profile} />

        <TopLinks data={topLinks} />

        <NormalLinks data={{ normalLinks, linkGroups }} />

        <SettingsForm data={settings} />

        <Theme data={settings.theme} />
      </div>
    </main>
  )
}
