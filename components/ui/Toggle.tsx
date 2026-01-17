"use client"

import { motion } from "motion/react"

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function Toggle({
  checked,
  onChange,
  disabled = false,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="theme-toggle"
      data-checked={checked}
    >
      <motion.span
        className="theme-toggle-thumb"
        data-checked={checked}
        animate={{
          x: checked ? 24 : 4,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  )
}
