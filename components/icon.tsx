import * as Icons from "react-bootstrap-icons"

export default function Icon({
  name,
  size = 24,
}: {
  name: string
  size?: number
}) {
  const IconComponent = Icons[name as keyof typeof Icons]
  if (!IconComponent) {
    return null
  }
  return <IconComponent size={size} />
}
