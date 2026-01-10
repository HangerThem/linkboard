import Link from "next/link"
import { Git } from "react-bootstrap-icons"

export default function Source() {
  return (
    <Link
      href="https://github.com/hangerthem/linkboard"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Git size={24} />
    </Link>
  )
}
