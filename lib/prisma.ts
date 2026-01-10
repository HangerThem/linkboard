import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const adapter = process.env.DATABASE_URL
  ? new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    })
  : new PrismaBetterSqlite3({
      url: "file:./.tmp/dev.db",
    })

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: adapter,
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
