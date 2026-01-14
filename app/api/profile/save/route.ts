import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { ProfileCreateSchema, ProfileSchema } from "@/types/Profile"

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
      const bytes = await avatar.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadsDir = path.join(process.cwd(), "public", "uploads")
      await mkdir(uploadsDir, { recursive: true })

      const ext = avatar.name.split(".").pop()
      const filename = `avatar-${Date.now()}.${ext}`
      avatarPath = `/uploads/${filename}`

      await writeFile(path.join(uploadsDir, filename), buffer)
    }

    const profile = await prisma.profile.update({
      where: { id: "default" },
      data: {
        name: validatedProfile.data.name,
        bio: validatedProfile.data.bio || null,
        avatar: avatarPath || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        profile,
        avatarPath,
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
