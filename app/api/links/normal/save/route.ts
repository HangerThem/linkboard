import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { NormalLinkSchema } from "@/types/NormalLink"
import { LinkGroupSchema } from "@/types/LinkGroup"

/**
 * @swagger
 * /links/normal/save:
 *   post:
 *     summary: Save normal links and link groups
 *     description: Replaces all existing normal links and link groups with the provided data
 *     tags:
 *       - Normal Links
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - normalLinks
 *               - linkGroups
 *             properties:
 *               normalLinks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NormalLink'
 *               linkGroups:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/LinkGroup'
 *     responses:
 *       200:
 *         description: Links saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     normalLinks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/NormalLink'
 *                     linkGroups:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LinkGroup'
 *       400:
 *         description: Invalid link data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const validatedNormalLinks = NormalLinkSchema.array().safeParse(
      body.normalLinks
    )
    const validatedLinkGroups = LinkGroupSchema.array().safeParse(
      body.linkGroups
    )

    if (!validatedNormalLinks.success || !validatedLinkGroups.success) {
      return NextResponse.json(
        {
          error: "Invalid link data",
          details: {
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

    const data = {
      normalLinks,
      linkGroups,
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
