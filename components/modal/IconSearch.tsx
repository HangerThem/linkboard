"use client"

import * as Icons from "react-bootstrap-icons"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"

interface IconSearchProps {
  open: boolean
  handleClose: () => void
  handleSelect: (iconName: string) => void
}

export default function IconSearch({
  open,
  handleClose,
  handleSelect,
}: IconSearchProps) {
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const iconNames = Object.keys(Icons).filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (open) {
      setSearch("")
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, handleClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 theme-overlay"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-2xl theme-modal flex flex-col max-h-[80vh] p-0"
            >
              <div className="p-6 theme-border border-b">
                <h2 className="text-sm font-medium uppercase tracking-widest theme-text-muted mb-4">
                  Select Icon
                </h2>
                <div className="relative">
                  <Icons.Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted"
                    size={18}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search icons..."
                    className="theme-input pl-11"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <motion.div
                  layout
                  className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2"
                >
                  {iconNames.map((name) => {
                    const IconComponent = (Icons as any)[name]
                    return (
                      <motion.button
                        key={name}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        type="button"
                        className="flex flex-col items-center justify-center p-3 theme-link-card-nested group"
                        onClick={() => {
                          handleSelect(name)
                          handleClose()
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        title={name}
                      >
                        <IconComponent
                          size={24}
                          className="theme-text-muted group-hover:theme-text-primary transition-colors"
                        />
                        <span className="text-[10px] mt-2 theme-text-muted group-hover:theme-text-secondary truncate w-full text-center transition-colors">
                          {name}
                        </span>
                      </motion.button>
                    )
                  })}
                </motion.div>
                {iconNames.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="theme-empty-state"
                  >
                    <p className="theme-text-muted text-sm">
                      No icons found matching "{search}"
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="p-4 theme-border border-t flex justify-between items-center">
                <span className="text-xs theme-text-muted">
                  {iconNames.length} icons
                </span>
                <motion.button
                  type="button"
                  className="theme-btn-secondary"
                  onClick={handleClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
