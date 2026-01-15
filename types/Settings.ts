import { Density, Theme } from "@/prisma/generated/enums"
import z from "zod"

export const SettingsSchema = z.object({
  id: z.string(),
  shareBar: z.boolean(),
  source: z.boolean(),
  density: z.enum(Density),
  theme: z.enum(Theme),
})

export type Settings = z.infer<typeof SettingsSchema>
