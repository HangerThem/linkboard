import * as Icons from "react-bootstrap-icons"
import z from "zod"

export const TopLinkSchema = z.object({
  id: z.cuid(),
  url: z.url().max(2048),
  icon: z.string().refine((val) => val === "" || val in Icons, {
    message: "Invalid icon name",
  }),
})

export type TopLink = z.infer<typeof TopLinkSchema>

export const TopLinkUpdateSchema = TopLinkSchema.partial().extend({
  id: z.cuid(),
})

export type TopLinkUpdate = z.infer<typeof TopLinkUpdateSchema>
