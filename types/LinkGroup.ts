import * as Icons from "react-bootstrap-icons"
import z from "zod"
import { NormalLinkSchema } from "./NormalLink"

export const LinkGroupSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(255, {
      message: "Name is too long",
    }),
  order: z.number().optional(),
  icon: z
    .string()
    .refine((val) => val === "" || val in Icons, {
      message: "Invalid icon name",
    })
    .optional()
    .or(z.literal(null)),
  links: NormalLinkSchema.array().optional(),
})

export type LinkGroup = z.infer<typeof LinkGroupSchema>

export const LinkGroupCreateSchema = LinkGroupSchema.omit({ id: true })
export type LinkGroupCreate = z.infer<typeof LinkGroupCreateSchema>

export const LinkGroupUpdateSchema = LinkGroupSchema.partial().extend({
  id: z.cuid(),
})

export type LinkGroupUpdate = z.infer<typeof LinkGroupUpdateSchema>
