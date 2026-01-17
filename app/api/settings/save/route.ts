import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { SettingsSchema } from "@/types/Settings"

/**
 * @swagger
 * /settings/save:
 *   post:
 *     summary: Save application settings
 *     description: Updates the application settings including theme, density, and display options
 *     tags:
 *       - Settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - settings
 *             properties:
 *               settings:
 *                 $ref: '#/components/schemas/Settings'
 *     responses:
 *       200:
 *         description: Settings saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     settings:
 *                       $ref: '#/components/schemas/Settings'
 *       400:
 *         description: Invalid settings data
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
