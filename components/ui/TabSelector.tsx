"use client"

import { motion } from "motion/react"

interface TabSelectorProps {
  tabs: string[]
  selectedTab: string
  onSelectTab: (tab: string) => void
}

export default function TabSelector({
  tabs,
  selectedTab,
  onSelectTab,
}: TabSelectorProps) {
  return (
    <div className="relative h-10 inline-flex w-72 bg-neutral-800 rounded-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onSelectTab(tab)}
          className={`flex-1 basis-0 relative text-sm z-10 rounded-full transition-colors ${
            selectedTab === tab
              ? "text-black"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          {tab.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
        </button>
      ))}
      <motion.div
        layoutId="tab-indicator"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-full h-8 bg-white rounded-full"
        style={{
          width: `calc(${100 / tabs.length}% - 0.5rem)`,
          left: `calc(${
            tabs.indexOf(selectedTab) * (100 / tabs.length)
          }% + 0.25rem)`,
        }}
      />
    </div>
  )
}
