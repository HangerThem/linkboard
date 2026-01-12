import { PrismaClient } from "../generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const adapter = new PrismaBetterSqlite3({
  url: "file:./db/linkboard.db",
})

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: adapter,
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
