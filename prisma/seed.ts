import prisma from "@/lib/prisma"
import { Density } from "./generated/enums"

async function main() {
  await prisma.profile.deleteMany()
  await prisma.profile.create({
    data: {
      id: "default",
      name: "Your Name",
      bio: "This is your bio.",
			avatar: null,
    },
  })

  await prisma.setting.deleteMany()
  await prisma.setting.create({
    data: {
      id: "default",
      shareBar: true,
      source: false,
      density: Density.COMFORTABLE,
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
