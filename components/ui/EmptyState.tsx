"use client"

import { motion } from "motion/react"

interface EmptyStateProps {
  message: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="theme-empty-state"
    >
      <p className="theme-text-muted text-sm">{message}</p>
    </motion.div>
  )
}
