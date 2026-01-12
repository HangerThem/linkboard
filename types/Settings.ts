import z from "zod"

export const SettingsSchema = z.object({
  id: z.string(),
  source: z.boolean(),
})

export type Settings = z.infer<typeof SettingsSchema>
