"use client"

import Link from "next/link"
import { Github } from "react-bootstrap-icons"
import { motion } from "motion/react"

export default function Source() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Link
        href="https://github.com/hangerthem/linkboard"
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.div
          className="flex items-center gap-2 px-4 py-2 theme-text-muted hover:theme-text-secondary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Github size={18} />
          <span className="text-xs font-medium uppercase tracking-wider">
            Source
          </span>
        </motion.div>
      </Link>
    </motion.div>
  )
}
