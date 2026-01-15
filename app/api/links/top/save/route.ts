import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { TopLinkSchema } from "@/types/TopLink"

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
