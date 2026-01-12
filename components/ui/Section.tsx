"use client"

import { motion, AnimatePresence } from "motion/react"
import * as Icons from "react-bootstrap-icons"
import { ReactNode } from "react"

interface SectionProps {
  title: string
  count?: number
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  action?: ReactNode
}

export default function Section({
  title,
  count,
  isOpen,
  onToggle,
  children,
  action,
}: SectionProps) {
  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-3 group"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Icons.ChevronRight size={16} className="text-neutral-500" />
          </motion.div>
          <span className="text-sm font-medium uppercase tracking-widest text-neutral-400 group-hover:text-neutral-300 transition-colors">
            {title}
          </span>
          {count !== undefined && (
            <span className="text-xs text-neutral-600 tabular-nums">
              ({count})
            </span>
          )}
        </button>
        {action}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
