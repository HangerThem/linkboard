import z from "zod"
import { NormalLinkSchema } from "./NormalLink"
import { LinkGroupSchema } from "./LinkGroup"

export const ContentItemSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("link"),
    order: z.number(),
    data: NormalLinkSchema,
  }),
  z.object({
    type: z.literal("group"),
    order: z.number(),
    data: LinkGroupSchema,
  }),
])

export type ContentItem = z.infer<typeof ContentItemSchema>

export const ContentItemsSchema = ContentItemSchema.array()
export type ContentItems = z.infer<typeof ContentItemsSchema>
