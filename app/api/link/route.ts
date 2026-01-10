import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const data = await prisma.link.createMany({
    data: body.map((link: any) => ({
      icon: link.icon || "default-icon",
      url: link.url,
      title: link.title,
    })),
  })

  return NextResponse.json({ data }, { status: 200 })
}
