"use client"

import Link from "next/link"
import Icon from "@/components/icon"
import { motion } from "motion/react"
import { NormalLink } from "@/types/NormalLink"

interface LinksListProps {
  links: NormalLink[]
}

export default function LinksList({ links }: LinksListProps) {
  if (links.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 border border-dashed border-neutral-800 rounded-xl"
      >
        <p className="text-neutral-600 text-sm">No links yet</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <motion.div
          key={link.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
            ease: "easeOut",
          }}
        >
          <Link href={link.url} target="_blank" rel="noopener noreferrer">
            <motion.div
              className="group flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors cursor-pointer"
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(38, 38, 38, 1)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {link.icon && (
                <div className="flex items-center justify-center w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-lg group-hover:border-neutral-600 transition-colors">
                  <Icon name={link.icon} size={20} />
                </div>
              )}
              <span className="flex-1 font-medium text-neutral-200 group-hover:text-white transition-colors">
                {link.title}
              </span>
              <motion.div
                className="text-neutral-600 group-hover:text-neutral-400 transition-colors"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
