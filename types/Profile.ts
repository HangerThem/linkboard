import z from "zod"

export const ProfileSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name is too long" }),
  bio: z.string().max(1024, { message: "Bio is too long" }).nullable(),
  avatar: z.string().nullable(),
  createdAt: z.date(),
})

export type Profile = z.infer<typeof ProfileSchema>

export const ProfileCreateSchema = ProfileSchema.omit({
  id: true,
  createdAt: true,
  avatar: true,
}).extend({
  avatar: z.instanceof(File).optional(),
})

export type ProfileCreate = z.infer<typeof ProfileCreateSchema>