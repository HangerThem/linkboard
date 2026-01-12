import * as Icons from "react-bootstrap-icons"
import z from "zod"

export const NormalLinkSchema = z.object({
  id: z.cuid(),
  title: z.string().min(1).max(255),
  url: z.url().max(2048),
  icon: z
    .string()
    .refine((val) => val === "" || val in Icons, {
      message: "Invalid icon name",
    })
    .optional()
    .or(z.literal(null)),
})

export type NormalLink = z.infer<typeof NormalLinkSchema>

export const NormalLinkUpdateSchema = NormalLinkSchema.partial().extend({
  id: z.cuid(),
})

export type NormalLinkUpdate = z.infer<typeof NormalLinkUpdateSchema>
