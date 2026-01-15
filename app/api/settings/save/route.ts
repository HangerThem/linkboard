import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { SettingsSchema } from "@/types/Settings"

export async function POST(req: NextRequest) {
  try {
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

    const settingsData = await prisma.setting.update({
      where: { id: "default" },
      data: {
        ...validatedSettings.data,
      },
    })

    const data = {
      settings: settingsData,
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
