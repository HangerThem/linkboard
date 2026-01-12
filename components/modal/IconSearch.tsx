"use client"

import * as Icons from "react-bootstrap-icons"
import { useState } from "react"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"

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
  const iconNames = Object.keys(Icons).filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[80vh] data-closed:opacity-0 data-closed:scale-95 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="font-bold text-xl text-gray-900 dark:text-white mb-4">
              Select an Icon
            </DialogTitle>
            <div className="relative">
              <Icons.Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search icons..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {iconNames.map((name) => {
                const IconComponent = (Icons as any)[name]
                return (
                  <button
                    key={name}
                    type="button"
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 group cursor-pointer"
                    onClick={() => {
                      handleSelect(name)
                      handleClose()
                    }}
                  >
                    <IconComponent
                      size={28}
                      className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    />
                    <span className="text-xs mt-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate w-full text-center transition-colors">
                      {name}
                    </span>
                  </button>
                )
              })}
            </div>
            {iconNames.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No icons found matching "{search}"
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {iconNames.length} icons
            </span>
            <button
              type="button"
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
