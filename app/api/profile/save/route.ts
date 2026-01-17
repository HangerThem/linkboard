import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { ProfileCreateSchema } from "@/types/Profile"
import sharp from "sharp"

/**
 * @swagger
 * /profile/save:
 *   post:
 *     summary: Save user profile
 *     description: Updates the user profile including name, bio, and avatar image
 *     tags:
 *       - Profile
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 description: Display name
 *               bio:
 *                 type: string
 *                 maxLength: 1024
 *                 description: Profile bio/description
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file (jpeg, png, gif, webp)
 *     responses:
 *       200:
 *         description: Profile saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile:
 *                       $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid profile data or unsupported file type
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

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const bio = formData.get("bio") as string
    const avatar = formData.get("avatar") as File | null

    const validatedProfile = ProfileCreateSchema.safeParse({
      name: name?.trim(),
      bio: bio?.trim() || undefined,
      avatar: avatar || undefined,
    })

    if (!validatedProfile.success) {
      return NextResponse.json(
        {
          error: "Invalid profile data",
          details: validatedProfile.error.message,
        },
        { status: 400 }
      )
    }

    let avatarPath: string | null = null
    if (avatar && avatar.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(avatar.type)) {
        return NextResponse.json(
          { error: "Unsupported avatar file type" },
          { status: 400 }
        )
      }
      const bytes = await avatar.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const image = sharp(buffer)
      const metadata = await image.metadata()

      if (metadata.width && metadata.width > 512) {
        image.resize(512)
      }

      const optimizedBuffer = await image.toBuffer()

      await mkdir(UPLOAD_DIR, { recursive: true })

      const ext = avatar.name.split(".").pop()
      const filename = `avatar-${Date.now()}.${ext}`
      avatarPath = `/uploads/${filename}`

      await writeFile(path.join(UPLOAD_DIR, filename), optimizedBuffer)
    }
    const profile = await prisma.profile.update({
      where: { id: "default" },
      data: {
        name: validatedProfile.data.name,
        bio: validatedProfile.data.bio || null,
        avatar: avatarPath,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        profile,
      },
    })
  } catch (error) {
    console.error("Error saving profile:", error)
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    )
  }
}
