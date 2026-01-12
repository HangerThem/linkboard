import prisma from "@/lib/prisma"

async function main() {
  await prisma.setting.deleteMany()
  const settings = await prisma.setting.create({
    data: {
      source: true,
    },
  })

  console.log({ settings })
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
