import * as Icons from "react-bootstrap-icons"
import z from "zod"

export const NormalLinkSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, {
      error: "Too short",
    })
    .max(255, {
      error: "Too long",
    }),
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
