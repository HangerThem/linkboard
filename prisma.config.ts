import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema:
    process.env.DATABASE_URL
      ? "prisma/schema.prod.prisma"
      : "prisma/schema.dev.prisma",
  migrations: {
    path:
      process.env.NODE_ENV === "development"
        ? "prisma/migrations/dev"
        : "prisma/migrations/prod",
  },
  datasource: {
    url: process.env.DATABASE_URL || "file:./.tmp/dev.db",
  },
})
