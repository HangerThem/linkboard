import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { SettingsSchema } from "@/types/Settings"
import { ThemeSchema } from "@/types/Theme"

/**
 * @swagger
 * /theme/save:
 *   post:
 *     summary: Save application theme
 *     description: Updates the application theme
 *     tags:
 *       - Theme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *             properties:
 *               theme:
 *                 $ref: '#/components/schemas/Theme'
 *     responses:
 *       200:
 *         description: Theme saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     theme:
 *                       $ref: '#/components/schemas/Theme'
 *       400:
 *         description: Invalid theme data
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

    const validatedTheme = ThemeSchema.safeParse(body.theme)

    if (!validatedTheme.success) {
      return NextResponse.json(
        {
          error: "Invalid theme data",
          details: {
            theme: validatedTheme.error.message,
          },
        },
        { status: 400 }
      )
    }

    const themeData = await prisma.setting.update({
      where: { id: "default" },
      data: {
        theme: validatedTheme.data,
      },
    })

    const data = {
      theme: themeData,
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
