import Editor from "@/components/forms/Editor"
import prisma from "@/lib/prisma"

export default async function EditorPage() {
  const normalLinks = await prisma.normalLink.findMany()
  const topLinks = await prisma.topLink.findMany()

  return (
    <main className="min-h-screen bg-black py-12 px-6">
      <h1 className="mb-8 text-center text-4xl font-bold text-white">
        LinkBoard Editor
      </h1>
      <p className="mb-12 text-center text-neutral-500">
        Manage your links and customize your LinkBoard
      </p>
      <Editor data={{ normalLinks, topLinks }} />;
    </main>
  )
}
