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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-neutral-800">
                <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
                  Select Icon
                </h2>
                <div className="relative">
                  <Icons.Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                    size={18}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search icons..."
                    className="w-full pl-11 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
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
                        className="flex flex-col items-center justify-center p-3 rounded-lg border border-neutral-800 group cursor-pointer"
                        onClick={() => {
                          handleSelect(name)
                          handleClose()
                        }}
                        whileHover={{
                          borderColor: "#525252",
                          backgroundColor: "rgba(38, 38, 38, 1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        <IconComponent
                          size={24}
                          className="text-neutral-400 group-hover:text-white transition-colors"
                        />
                        <span className="text-[10px] mt-2 text-neutral-600 group-hover:text-neutral-400 truncate w-full text-center transition-colors">
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
                    className="text-center py-12 border border-dashed border-neutral-800 rounded-lg"
                  >
                    <p className="text-neutral-600 text-sm">
                      No icons found matching "{search}"
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="p-4 border-t border-neutral-800 flex justify-between items-center">
                <span className="text-xs text-neutral-600">
                  {iconNames.length} icons
                </span>
                <motion.button
                  type="button"
                  className="px-5 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-full text-sm font-medium cursor-pointer"
                  onClick={handleClose}
                  whileHover={{
                    borderColor: "#525252",
                    color: "#ffffff",
                  }}
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
