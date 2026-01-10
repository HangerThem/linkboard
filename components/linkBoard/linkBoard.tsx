import Link from "next/link"
import Icon from "@/components/icon"
import ShareBar from "@/components/sharebar/sharebar"
import Source from "@/components/source/source"
import Image from "next/image"
import prisma from "@/lib/prisma"

export default async function LinkBoard() {
  const data = await prisma.link.findMany()

  return (
    <div>
      <ShareBar />
      <div>
        <Image src="/profile.png" alt="Profile" width={150} height={150} />
        <div>
          {/* <div>{randomizedName}</div>
          <div>{data.description}</div> */}
        </div>
      </div>
      <div>
        {data.map((link, index) => (
          <div key={link.url}>
            <Icon name={link.icon} />
            <Link href={link.url}>{link.title}</Link>
          </div>
        ))}
      </div>
      <Source />
    </div>
  )
}
