import * as Icons from "react-bootstrap-icons"
import z from "zod"

export const TopLinkSchema = z.object({
  id: z.string(),
  url: z.url().max(2048),
  icon: z
    .string()
    .min(1, "Icon is required")
    .refine((val) => val in Icons, {
      message: "Invalid icon name",
    }),
})

export type TopLink = z.infer<typeof TopLinkSchema>

export const TopLinkCreateSchema = TopLinkSchema.omit({ id: true })
export type TopLinkCreate = z.infer<typeof TopLinkCreateSchema>

export const TopLinkUpdateSchema = TopLinkSchema.partial().extend({
  id: z.cuid(),
})

export type TopLinkUpdate = z.infer<typeof TopLinkUpdateSchema>
