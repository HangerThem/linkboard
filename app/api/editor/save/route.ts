import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { NormalLinkSchema } from "@/types/NormalLink"
import { TopLinkSchema } from "@/types/TopLink"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const validatedTopLinks = TopLinkSchema.array().safeParse(body.topLinks)
  const validatedNormalLinks = NormalLinkSchema.array().safeParse(
    body.normalLinks
  )

  if (!validatedTopLinks.success || !validatedNormalLinks.success) {
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
        },
      },
      { status: 400 }
    )
  }

  await prisma.topLink.deleteMany()
  const topLinksData = await prisma.topLink.createMany({
    data: validatedTopLinks.data,
  })

  await prisma.normalLink.deleteMany()
  const normalLinksData = await prisma.normalLink.createMany({
    data: validatedNormalLinks.data,
  })

  const data = { topLinks: topLinksData, normalLinks: normalLinksData }

  return NextResponse.json({ data }, { status: 200 })
}
