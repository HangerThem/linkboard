import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { SettingsSchema } from "@/types/Settings"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const validatedSettings = SettingsSchema.safeParse(body.settings)

  if (!validatedSettings.success) {
    return NextResponse.json(
      {
        error: "Invalid settings data",
        details: {
          settings: validatedSettings.error.message,
        },
      },
      { status: 400 }
    )
  }

  await prisma.$transaction(async (tx) => {
    await tx.setting.deleteMany()
    await tx.setting.create({
      data: validatedSettings.data,
    })
  })

  const settingsData = await prisma.setting.findFirst()

  const data = {
    settings: settingsData,
  }

  return NextResponse.json({ data }, { status: 200 })
}
