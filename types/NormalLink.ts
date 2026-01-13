import * as Icons from "react-bootstrap-icons"
import z from "zod"

export const NormalLinkSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, {
      message: "Too short",
    })
    .max(255, {
      message: "Too long",
    }),
  url: z.url().max(2048),
  order: z.number().optional(),
  linkGroupId: z.string().nullable().optional(),
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
