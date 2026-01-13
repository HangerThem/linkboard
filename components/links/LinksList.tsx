"use client"

import Link from "next/link"
import Icon from "@/components/icon"
import { motion, AnimatePresence } from "motion/react"
import { NormalLink } from "@/types/NormalLink"
import { LinkGroup } from "@/types/LinkGroup"
import * as Icons from "react-bootstrap-icons"
import { useState, useMemo } from "react"
import { Density } from "@/prisma/generated/enums"

interface LinksListProps {
  links: NormalLink[]
  linkGroups?: LinkGroup[]
  density: Density
}

type ContentItem =
  | { type: "link"; order: number; data: NormalLink }
  | { type: "group"; order: number; data: LinkGroup }

export default function LinksList({
  links,
  linkGroups = [],
  density,
}: LinksListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(linkGroups.map((g) => g.id))
  )

  const contentItems = useMemo(() => {
    const items: ContentItem[] = []

    links.forEach((link, index) => {
      items.push({
        type: "link",
        order: link.order ?? index,
        data: link,
      })
    })

    linkGroups.forEach((group, index) => {
      items.push({
        type: "group",
        order: group.order ?? links.length + index,
        data: group,
      })
    })

    return items.sort((a, b) => a.order - b.order)
  }, [links, linkGroups])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const getSpacingClass = () => {
    switch (density) {
      case Density.COMPACT:
        return "space-y-2"
      case Density.COMFORTABLE:
        return "space-y-3"
      case Density.SPACIOUS:
        return "space-y-4"
      default:
        return "space-y-3"
    }
  }

  const getLinkSpacingClass = () => {
    switch (density) {
      case Density.COMPACT:
        return "p-2"
      case Density.COMFORTABLE:
        return "p-3"
      case Density.SPACIOUS:
        return "p-4"
      default:
        return "p-3"
    }
  }

  const hasContent = links.length > 0 || linkGroups.length > 0

  if (!hasContent) {
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

  const renderLink = (link: NormalLink, index: number) => (
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
          className={`group flex items-center gap-4 ${getLinkSpacingClass()} bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors`}
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(38, 38, 38, 1)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          {link.icon && (
            <div className="flex items-center justify-center w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-lg group-hover:border-neutral-600 transition-colors">
              <Icon name={link.icon as keyof typeof Icons} size={20} />
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
            <Icon name="BoxArrowUpRight" size={16} />
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  )

  const renderGroup = (group: LinkGroup, index: number) => (
    <motion.div
      key={group.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      className="border border-neutral-800 rounded-xl overflow-hidden"
    >
      <div className="bg-neutral-900 hover:bg-neutral-800/80 transition-colors">
        <motion.button
          className={`w-full flex items-center gap-4 ${getLinkSpacingClass()}`}
          onClick={() => toggleGroup(group.id)}
          whileTap={{ scale: 0.99 }}
        >
          {group.icon && (
            <div className="flex items-center justify-center w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-lg">
              <Icon name={group.icon as keyof typeof Icons} size={20} />
            </div>
          )}
          <span className="flex-1 font-medium text-neutral-200 text-left">
            {group.name}
          </span>
          <span className="text-sm text-neutral-500 mr-2">
            {group.links?.length || 0} link
            {(group.links?.length || 0) !== 1 ? "s" : ""}
          </span>
          <motion.div
            className="text-neutral-600"
            animate={{ rotate: expandedGroups.has(group.id) ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon name="ChevronDown" size={20} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {expandedGroups.has(group.id) &&
          group.links &&
          group.links.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`p-3 ${getSpacingClass()} bg-neutral-900/50`}>
                {group.links.map((link, linkIndex) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: linkIndex * 0.03,
                    }}
                  >
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.div
                        className={`group flex items-center gap-3 ${getLinkSpacingClass()} bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors`}
                        whileHover={{
                          scale: 1.01,
                          backgroundColor: "rgba(38, 38, 38, 0.7)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                      >
                        {link.icon && (
                          <div className="flex items-center justify-center w-8 h-8 bg-neutral-800 border border-neutral-700 rounded-md group-hover:border-neutral-600 transition-colors">
                            <Icon
                              name={link.icon as keyof typeof Icons}
                              size={16}
                            />
                          </div>
                        )}
                        <span className="flex-1 text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          {link.title}
                        </span>
                        <motion.div
                          className="text-neutral-600 group-hover:text-neutral-400 transition-colors"
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                        >
                          <Icon name="BoxArrowUpRight" size={14} />
                        </motion.div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </motion.div>
  )

  return (
    <div className={getSpacingClass()}>
      {contentItems.map((item, index) =>
        item.type === "link"
          ? renderLink(item.data, index)
          : renderGroup(item.data, index)
      )}
    </div>
  )
}
