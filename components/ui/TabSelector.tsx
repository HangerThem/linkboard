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
    <div className="theme-tab-selector">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onSelectTab(tab)}
          className="theme-tab-button"
          data-selected={selectedTab === tab}
        >
          {tab.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
        </button>
      ))}
      <motion.div
        layoutId="tab-indicator"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="theme-tab-indicator"
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
