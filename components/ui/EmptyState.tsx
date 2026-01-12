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
      className="text-center py-8 border border-dashed border-neutral-800 rounded-lg"
    >
      <p className="text-neutral-600 text-sm">{message}</p>
    </motion.div>
  )
}
