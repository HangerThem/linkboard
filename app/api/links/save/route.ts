import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { NormalLinkSchema } from "@/types/NormalLink"
import { TopLinkSchema } from "@/types/TopLink"
import { LinkGroupSchema } from "@/types/LinkGroup"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const validatedTopLinks = TopLinkSchema.array().safeParse(body.topLinks)
  const validatedNormalLinks = NormalLinkSchema.array().safeParse(
    body.normalLinks
  )
  const validatedLinkGroups = LinkGroupSchema.array().safeParse(body.linkGroups)

  if (
    !validatedTopLinks.success ||
    !validatedNormalLinks.success ||
    !validatedLinkGroups.success
  ) {
    return NextResponse.json(
      {
        error: "Invalid link data",
        details: {
          topLinks: validatedTopLinks.success
            ? null
            : validatedTopLinks.error.message,
          normalLinks: validatedNormalLinks.success
            ? null
            : validatedNormalLinks.error.message,
          linkGroups: validatedLinkGroups.success
            ? null
            : validatedLinkGroups.error.message,
        },
      },
      { status: 400 }
    )
  }
  await prisma.$transaction(async (tx) => {
    await tx.normalLink.deleteMany()
    await tx.linkGroup.deleteMany()
    await tx.topLink.deleteMany()

    await tx.topLink.createMany({
      data: validatedTopLinks.data.map((link, index) => ({
        id: link.id,
        url: link.url,
        icon: link.icon,
        order: link.order ?? index,
      })),
    })

    const linkGroupsData = []
    for (const group of validatedLinkGroups.data) {
      const { links, ...groupData } = group
      const createdGroup = await tx.linkGroup.create({
        data: {
          id: groupData.id,
          name: groupData.name,
          icon: groupData.icon,
          order: groupData.order ?? 0,
          links: {
            create:
              links?.map((link, linkIndex) => ({
                id: link.id,
                title: link.title,
                url: link.url,
                icon: link.icon,
                order: link.order ?? linkIndex,
              })) || [],
          },
        },
        include: {
          links: {
            orderBy: { order: "asc" },
          },
        },
      })
      linkGroupsData.push(createdGroup)
    }

    const ungroupedLinks = validatedNormalLinks.data.filter(
      (link) => !link.linkGroupId
    )

    await tx.normalLink.createMany({
      data: ungroupedLinks.map((link, index) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        linkGroupId: null,
        order: link.order ?? index,
      })),
    })
  })

  const normalLinks = await prisma.normalLink.findMany({
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

  const data = {
    normalLinks,
    topLinks,
    linkGroups,
  }

  return NextResponse.json({ data }, { status: 200 })
}
