import { notFound } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  if (process.env.SINGLE_USER === "true") {
    if (process.env.NODE_ENV === "development") {
      return <>{children}</>
    }
    return notFound()
  }

  return <>{children}</>
}
