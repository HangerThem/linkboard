import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { TopLinkSchema } from "@/types/TopLink"

/**
 * @swagger
 * /links/top/save:
 *   post:
 *     summary: Save top links
 *     description: Replaces all existing top links with the provided data
 *     tags:
 *       - Top Links
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topLinks
 *             properties:
 *               topLinks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TopLink'
 *     responses:
 *       200:
 *         description: Top links saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     topLinks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TopLink'
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

    const validatedTopLinks = TopLinkSchema.array().safeParse(body.topLinks)

    if (!validatedTopLinks.success) {
      return NextResponse.json(
        {
          error: "Invalid link data",
          details: {
            topLinks: validatedTopLinks.success
              ? null
              : validatedTopLinks.error.message,
          },
        },
        { status: 400 }
      )
    }
    await prisma.$transaction(async (tx) => {
      await tx.topLink.deleteMany()

      await tx.topLink.createMany({
        data: validatedTopLinks.data.map((link, index) => ({
          id: link.id,
          url: link.url,
          icon: link.icon,
          order: link.order ?? index,
        })),
      })
    })

    const topLinks = await prisma.topLink.findMany({
      orderBy: { order: "asc" },
    })

    const data = {
      topLinks,
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
