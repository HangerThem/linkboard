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
        className="theme-empty-state"
      >
        <p className="theme-text-muted text-sm">No links yet</p>
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
          className={`group flex items-center gap-4 ${getLinkSpacingClass()} theme-link-card`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          {link.icon && (
            <div className="theme-icon-container theme-icon-container-md">
              <Icon name={link.icon as keyof typeof Icons} size={20} />
            </div>
          )}
          <span className="flex-1 font-medium theme-text-secondary group-hover:theme-text-primary transition-colors">
            {link.title}
          </span>
          <motion.div
            className="theme-text-muted group-hover:theme-text-secondary transition-colors"
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
      className="theme-card overflow-hidden"
    >
      <div className="theme-group-header">
        <motion.button
          className={`w-full flex items-center gap-4 ${getLinkSpacingClass()}`}
          onClick={() => toggleGroup(group.id)}
          whileTap={{ scale: 0.99 }}
        >
          {group.icon && (
            <div className="theme-icon-container theme-icon-container-md">
              <Icon name={group.icon as keyof typeof Icons} size={20} />
            </div>
          )}
          <span className="flex-1 font-medium theme-text-secondary text-left">
            {group.name}
          </span>
          <span className="text-sm theme-text-muted mr-2">
            {group.links?.length || 0} link
            {(group.links?.length || 0) !== 1 ? "s" : ""}
          </span>
          <motion.div
            className="theme-text-muted"
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
              <div className={`theme-group-content ${getSpacingClass()}`}>
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
                        className={`group flex items-center gap-3 ${getLinkSpacingClass()} theme-link-card-nested`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                      >
                        {link.icon && (
                          <div className="theme-icon-container theme-icon-container-sm">
                            <Icon
                              name={link.icon as keyof typeof Icons}
                              size={16}
                            />
                          </div>
                        )}
                        <span className="flex-1 text-sm font-medium theme-text-secondary group-hover:theme-text-primary transition-colors">
                          {link.title}
                        </span>
                        <motion.div
                          className="theme-text-muted group-hover:theme-text-secondary transition-colors"
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
