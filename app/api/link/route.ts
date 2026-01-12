import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { NormalLinkSchema } from "@/types/NormalLink"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const validatedLinks = NormalLinkSchema.array().safeParse(body)

  if (!validatedLinks.success) {
    return NextResponse.json(
      { error: "Invalid link data", details: validatedLinks.error.message },
      { status: 400 }
    )
  }

  const data = await prisma.link.createMany({
    data: validatedLinks.data,
  })

  return NextResponse.json({ data }, { status: 200 })
}
