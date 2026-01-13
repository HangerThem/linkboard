import * as Icons from "react-bootstrap-icons"

export default function Icon({
  name,
  size = 24,
  color = "currentColor",
}: {
  name: keyof typeof Icons
  size?: number
  color?: string
}) {
  const IconComponent = Icons[name]
  if (!IconComponent) {
    return null
  }
  return <IconComponent size={size} color={color} />
}
