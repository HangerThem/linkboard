import { Theme as ThemeEnum } from "@/prisma/generated/enums"
import z from "zod"

export const ThemeSchema = z.enum(ThemeEnum)

export type Theme = z.infer<typeof ThemeSchema>
