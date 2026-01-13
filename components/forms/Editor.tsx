"use client"

import IconSearch from "@/components/modal/IconSearch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import z from "zod"
import { NormalLink, NormalLinkSchema } from "@/types/NormalLink"
import { TopLink, TopLinkSchema } from "@/types/TopLink"
import { LinkGroup, LinkGroupSchema } from "@/types/LinkGroup"
import { ContentItem } from "@/types/ContentItem"
import Sortable from "sortablejs"
import { nanoid } from "nanoid"
import { motion, AnimatePresence } from "motion/react"
import Section from "@/components/ui/Section"
import FormButton from "@/components/ui/FormButton"
import EmptyState from "@/components/ui/EmptyState"
import Icon from "../icon"
import * as Icons from "react-bootstrap-icons"
import ConfirmModal from "../modal/ConfirmModal"

const FormDataSchema = z.object({
  topLinks: TopLinkSchema.array(),
  contentItems: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("link"),
        order: z.number(),
        data: NormalLinkSchema,
      }),
      z.object({
        type: z.literal("group"),
        order: z.number(),
        data: LinkGroupSchema,
      }),
    ])
  ),
})

type FormData = z.infer<typeof FormDataSchema>

type LinkType = "top" | "content" | "groupLink"

interface IconSelectionContext {
  type: LinkType
  itemIndex?: number
  linkIndex?: number
}

interface EditorProps {
  data: {
    topLinks: TopLink[]
    normalLinks: NormalLink[]
    linkGroups?: LinkGroup[]
  }
}

function buildContentItems(
  normalLinks: NormalLink[],
  linkGroups: LinkGroup[]
): ContentItem[] {
  const items: ContentItem[] = []

  normalLinks.forEach((link, index) => {
    items.push({
      type: "link",
      order: link.order ?? index,
      data: link,
    })
  })

  linkGroups.forEach((group, index) => {
    items.push({
      type: "group",
      order: group.order ?? normalLinks.length + index,
      data: group,
    })
  })

  items.sort((a, b) => a.order - b.order)

  return items.map((item, index) => ({ ...item, order: index }))
}

export default function Editor({ data }: EditorProps) {
  const [iconsModalOpen, setIconsModalOpen] = useState(false)
  const [iconSelectionContext, setIconSelectionContext] =
    useState<IconSelectionContext | null>(null)
  const topListRef = useRef<HTMLUListElement>(null)
  const contentListRef = useRef<HTMLDivElement>(null)
  const groupLinksRefs = useRef<Map<string, HTMLUListElement>>(new Map())
  const topLinksSnapshot = useRef<TopLink[]>([])
  const contentSnapshot = useRef<ContentItem[]>([])
  const groupLinksSnapshots = useRef<Map<string, NormalLink[]>>(new Map())
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [groupToDeleteIndex, setGroupToDeleteIndex] = useState<number | null>(
    null
  )

  const initialContentItems = buildContentItems(
    data.normalLinks,
    data.linkGroups || []
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      topLinks: data.topLinks,
      contentItems: initialContentItems,
    },
  })

  const topLinks = watch("topLinks")
  const contentItems = watch("contentItems")
  const [topLinksOpen, setTopLinksOpen] = useState(true)
  const [contentOpen, setContentOpen] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const groups = contentItems.filter((item) => item.type === "group")
    return new Set(groups.map((g) => g.data.id))
  })

  const toggleGroupExpanded = (groupId: string) => {
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

  const addTopLink = () => {
    setValue("topLinks", [
      ...topLinks,
      { id: nanoid(), url: "", icon: "", order: topLinks.length } as TopLink,
    ])
  }

  const addLink = () => {
    const newItem: ContentItem = {
      type: "link",
      order: contentItems.length,
      data: {
        id: nanoid(),
        title: "",
        url: "",
        icon: null,
        order: contentItems.length,
      } as NormalLink,
    }
    setValue("contentItems", [...contentItems, newItem])
  }

  const addGroup = () => {
    const newGroupId = nanoid()
    const newItem: ContentItem = {
      type: "group",
      order: contentItems.length,
      data: {
        id: newGroupId,
        name: "",
        icon: null,
        links: [],
        order: contentItems.length,
      } as LinkGroup,
    }
    setValue("contentItems", [...contentItems, newItem])
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      newSet.add(newGroupId)
      return newSet
    })
  }

  const addLinkToGroup = (groupId: string) => {
    const updatedItems = contentItems.map((item) => {
      if (item.type === "group" && item.data.id === groupId) {
        const groupData = item.data as LinkGroup
        return {
          ...item,
          data: {
            ...groupData,
            links: [
              ...(groupData.links || []),
              {
                id: nanoid(),
                title: "",
                url: "",
                icon: null,
                linkGroupId: groupId,
                order: groupData.links?.length || 0,
              } as NormalLink,
            ],
          },
        }
      }
      return item
    })
    setValue("contentItems", updatedItems)
  }

  const removeTopLink = (index: number) => {
    setValue(
      "topLinks",
      topLinks.filter((_, i) => i !== index)
    )
  }

  const removeContentItem = (index: number) => {
    const item = contentItems[index]
    if (item.type === "group") {
      const groupData = item.data as LinkGroup
      if (groupData.links && groupData.links.length > 0) {
        const linksToAdd: ContentItem[] = groupData.links.map((link, i) => ({
          type: "link" as const,
          order: contentItems.length + i,
          data: { ...link, linkGroupId: null },
        }))
        const filtered = contentItems.filter((_, i) => i !== index)
        setValue("contentItems", [...filtered, ...linksToAdd])
        return
      }
    }
    setValue(
      "contentItems",
      contentItems.filter((_, i) => i !== index)
    )
  }

  const removeLinkFromGroup = (groupId: string, linkIndex: number) => {
    const updatedItems = contentItems.map((item) => {
      if (item.type === "group" && item.data.id === groupId) {
        const groupData = item.data as LinkGroup
        return {
          ...item,
          data: {
            ...groupData,
            links: groupData.links?.filter((_, i) => i !== linkIndex) || [],
          },
        }
      }
      return item
    })
    setValue("contentItems", updatedItems)
  }

  const shouldDisableSubmit = () => {
    const linksExist = topLinks.length > 0 || contentItems.length > 0
    const initialContent = buildContentItems(
      data.normalLinks,
      data.linkGroups || []
    )
    const changedFromInitial =
      JSON.stringify(data.topLinks) !== JSON.stringify(topLinks) ||
      JSON.stringify(initialContent) !== JSON.stringify(contentItems)

    if (!changedFromInitial) return true
    return !linksExist
  }

  const handleIconSelect = (iconName: string) => {
    if (!iconSelectionContext) return

    const { type, itemIndex, linkIndex } = iconSelectionContext

    if (type === "top" && itemIndex !== undefined) {
      const updatedTopLinks = [...topLinks]
      updatedTopLinks[itemIndex] = {
        ...updatedTopLinks[itemIndex],
        icon: iconName,
      }
      setValue("topLinks", updatedTopLinks)
    } else if (type === "content" && itemIndex !== undefined) {
      const item = contentItems[itemIndex]
      if (item.type === "link") {
        const updatedItems = [...contentItems]
        updatedItems[itemIndex] = {
          ...item,
          data: { ...item.data, icon: iconName },
        }
        setValue("contentItems", updatedItems)
      } else if (item.type === "group") {
        const updatedItems = [...contentItems]
        updatedItems[itemIndex] = {
          ...item,
          data: { ...item.data, icon: iconName },
        }
        setValue("contentItems", updatedItems)
      }
    } else if (
      type === "groupLink" &&
      itemIndex !== undefined &&
      linkIndex !== undefined
    ) {
      const item = contentItems[itemIndex]
      if (item.type === "group") {
        const groupData = item.data as LinkGroup
        const updatedLinks = [...(groupData.links || [])]
        updatedLinks[linkIndex] = {
          ...updatedLinks[linkIndex],
          icon: iconName,
        }
        const updatedItems = [...contentItems]
        updatedItems[itemIndex] = {
          ...item,
          data: { ...groupData, links: updatedLinks },
        }
        setValue("contentItems", updatedItems)
      }
    }

    setIconSelectionContext(null)
  }

  const openIconModal = (
    type: LinkType,
    itemIndex?: number,
    linkIndex?: number
  ) => {
    setIconSelectionContext({ type, itemIndex, linkIndex })
    setIconsModalOpen(true)
  }

  useEffect(() => {
    if (!topListRef.current) return

    const sortable = Sortable.create(topListRef.current, {
      animation: 150,
      handle: ".drag-handle",
      onStart: () => {
        topLinksSnapshot.current = [...topLinks]
      },
      onEnd: ({ oldIndex, newIndex }) => {
        if (oldIndex == null || newIndex == null) return
        const updated = [...topLinksSnapshot.current]
        const [movedItem] = updated.splice(oldIndex, 1)
        updated.splice(newIndex, 0, movedItem)
        setValue("topLinks", updated)
      },
    })
    return () => sortable.destroy()
  }, [topLinks.length, setValue, topLinks])

  useEffect(() => {
    if (!contentListRef.current) return

    const sortable = Sortable.create(contentListRef.current, {
      animation: 150,
      handle: ".content-drag-handle",
      draggable: ".content-item",
      onStart: () => {
        contentSnapshot.current = [...contentItems]
      },
      onEnd: ({ oldIndex, newIndex }) => {
        if (oldIndex == null || newIndex == null) return
        const updated = [...contentSnapshot.current]
        const [movedItem] = updated.splice(oldIndex, 1)
        updated.splice(newIndex, 0, movedItem)
        const reordered = updated.map((item, index) => ({
          ...item,
          order: index,
        }))
        setValue("contentItems", reordered)
      },
    })
    return () => sortable.destroy()
  }, [contentItems.length, setValue, contentItems])

  useEffect(() => {
    const sortables: Sortable[] = []

    contentItems.forEach((item, itemIndex) => {
      if (item.type !== "group") return
      const groupData = item.data as LinkGroup
      const listEl = groupLinksRefs.current.get(groupData.id)
      if (!listEl) return

      const sortable = Sortable.create(listEl, {
        animation: 150,
        handle: ".drag-handle",
        onStart: () => {
          groupLinksSnapshots.current.set(groupData.id, [
            ...(groupData.links || []),
          ])
        },
        onEnd: ({ oldIndex, newIndex }) => {
          if (oldIndex == null || newIndex == null) return
          const snapshot = groupLinksSnapshots.current.get(groupData.id) || []
          const updatedLinks = [...snapshot]
          const [movedItem] = updatedLinks.splice(oldIndex, 1)
          updatedLinks.splice(newIndex, 0, movedItem)

          const updatedItems = contentItems.map((it, idx) => {
            if (idx === itemIndex && it.type === "group") {
              return { ...it, data: { ...it.data, links: updatedLinks } }
            }
            return it
          })
          setValue("contentItems", updatedItems)
        },
      })
      sortables.push(sortable)
    })

    return () => sortables.forEach((s) => s.destroy())
  }, [contentItems, setValue])

  const onSubmit = async (formData: FormData) => {
    try {
      const normalLinks: NormalLink[] = []
      const linkGroups: LinkGroup[] = []

      formData.contentItems.forEach((item, index) => {
        if (item.type === "link") {
          normalLinks.push({ ...item.data, order: index, linkGroupId: null })
        } else if (item.type === "group") {
          const groupData = item.data as LinkGroup
          linkGroups.push({
            ...groupData,
            order: index,
            links: groupData.links?.map((link, linkIdx) => ({
              ...link,
              order: linkIdx,
            })),
          })
        }
      })

      const response = await fetch("/api/links/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topLinks: formData.topLinks.map((link, index) => ({
            ...link,
            order: index,
          })),
          normalLinks,
          linkGroups,
        }),
      })

      if (!response.ok) throw new Error("Failed to save links")

      const responseData = await response.json().then((res) => res.data)

      const newContentItems = buildContentItems(
        responseData.normalLinks,
        responseData.linkGroups
      )
      setValue("topLinks", responseData.topLinks)
      setValue("contentItems", newContentItems)
      alert("Links saved successfully!")
    } catch (error) {
      console.error(error)
      alert("An error occurred while saving links")
    }
  }

  const openConfirmModal = (groupIndex: number) => {
    setGroupToDeleteIndex(groupIndex)
    setIsConfirmModalOpen(true)
  }

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false)
    setGroupToDeleteIndex(null)
  }

  const confirmDeleteGroup = () => {
    if (groupToDeleteIndex === null) return
    removeContentItem(groupToDeleteIndex)
    closeConfirmModal()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ConfirmModal
        open={isConfirmModalOpen}
        title="Delete Group"
        message="Are you sure you want to delete this group? Its links will be moved to the main list."
        confirmText="Delete"
        cancelText="Cancel"
        handleConfirm={confirmDeleteGroup}
        handleClose={closeConfirmModal}
      />
      <IconSearch
        open={iconsModalOpen}
        handleClose={() => {
          setIconsModalOpen(false)
          setIconSelectionContext(null)
        }}
        handleSelect={handleIconSelect}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section
          title="Top Links"
          count={topLinks.length}
          isOpen={topLinksOpen}
          onToggle={() => setTopLinksOpen(!topLinksOpen)}
          action={
            <FormButton type="button" onClick={addTopLink}>
              <Icon name="Plus" size={16} />
              Add
            </FormButton>
          }
        >
          {topLinks.length > 0 ? (
            <ul ref={topListRef} className="space-y-2">
              {topLinks.map((link, index) => (
                <li
                  key={link.id}
                  className="group flex items-center gap-3 p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
                >
                  <button
                    type="button"
                    className="drag-handle cursor-grab text-neutral-600 hover:text-neutral-400 transition-colors"
                  >
                    <Icon name="GripVertical" size={18} />
                  </button>

                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => openIconModal("top", index)}
                      className={`flex items-center justify-center w-10 h-10 bg-neutral-800 border rounded-lg hover:border-neutral-500 transition-colors ${
                        errors.topLinks?.[index]?.icon
                          ? "border-red-500"
                          : "border-neutral-700"
                      }`}
                    >
                      {link.icon ? (
                        <Icon
                          name={link.icon as keyof typeof Icons}
                          size={18}
                        />
                      ) : (
                        <Icon name="PlusCircleDotted" size={18} />
                      )}
                    </button>
                    {errors.topLinks?.[index]?.icon && (
                      <span className="text-red-500 text-xs mt-1">
                        Required
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <input
                      type="text"
                      placeholder="https://example.com"
                      {...register(`topLinks.${index}.url`)}
                      className={`w-full px-4 py-2.5 bg-transparent border-b text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                        errors.topLinks?.[index]?.url
                          ? "border-red-500 focus:border-red-500"
                          : "border-neutral-700 focus:border-white"
                      }`}
                    />
                    {errors.topLinks?.[index]?.url && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.topLinks[index].url.message ||
                          "Valid URL is required"}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeTopLink(index)}
                    className="p-2 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No links yet" />
          )}
        </Section>

        <Section
          title="Links & Groups"
          count={contentItems.length}
          isOpen={contentOpen}
          onToggle={() => setContentOpen(!contentOpen)}
          action={
            <div className="flex gap-2">
              <FormButton type="button" onClick={addLink}>
                <Icon name="Plus" size={16} />
                Add Link
              </FormButton>
              <FormButton type="button" onClick={addGroup}>
                <Icon name="FolderPlus" size={16} />
                Add Group
              </FormButton>
            </div>
          }
        >
          {contentItems.length > 0 ? (
            <div ref={contentListRef} className="space-y-2">
              {contentItems.map((item, itemIndex) => {
                if (item.type === "link") {
                  const link = item.data as NormalLink
                  return (
                    <div
                      key={link.id}
                      data-item-id={link.id}
                      className="content-item group flex items-center gap-3 p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
                    >
                      <button
                        type="button"
                        className="content-drag-handle cursor-grab text-neutral-600 hover:text-neutral-400 transition-colors"
                      >
                        <Icon name="GripVertical" size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => openIconModal("content", itemIndex)}
                        className="flex items-center justify-center w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors"
                      >
                        {link.icon ? (
                          <Icon
                            name={link.icon as keyof typeof Icons}
                            size={18}
                          />
                        ) : (
                          <Icon name="PlusCircleDotted" size={18} />
                        )}
                      </button>

                      <div className="w-1/4 flex flex-col">
                        <input
                          type="text"
                          placeholder="Title"
                          {...register(
                            `contentItems.${itemIndex}.data.title` as const
                          )}
                          className="w-full px-4 py-2.5 bg-transparent border-b border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <input
                          type="text"
                          placeholder="https://example.com"
                          {...register(
                            `contentItems.${itemIndex}.data.url` as const
                          )}
                          className="w-full px-4 py-2.5 bg-transparent border-b border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeContentItem(itemIndex)}
                        className="p-2 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                      >
                        <Icon name="X" size={18} />
                      </button>
                    </div>
                  )
                } else {
                  const group = item.data as LinkGroup
                  return (
                    <div
                      key={group.id}
                      data-item-id={group.id}
                      className="content-item bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden"
                    >
                      <div className="flex items-center gap-3 p-4 bg-neutral-800/30">
                        <button
                          type="button"
                          className="content-drag-handle cursor-grab text-neutral-600 hover:text-neutral-400 transition-colors"
                        >
                          <Icon name="GripVertical" size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openIconModal("content", itemIndex)}
                          className="flex items-center justify-center w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors"
                        >
                          {group.icon ? (
                            <Icon
                              name={group.icon as keyof typeof Icons}
                              size={18}
                            />
                          ) : (
                            <Icon name="FolderFill" size={18} />
                          )}
                        </button>

                        <div className="flex-1 flex flex-col">
                          <input
                            type="text"
                            placeholder="Group Name"
                            {...register(
                              `contentItems.${itemIndex}.data.name` as const
                            )}
                            className="w-full px-4 py-2.5 bg-transparent border-b border-neutral-700 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                          />
                        </div>

                        <motion.button
                          animate={{
                            rotate: expandedGroups.has(group.id) ? 0 : 180,
                          }}
                          transition={{ duration: 0.2 }}
                          type="button"
                          onClick={() => toggleGroupExpanded(group.id)}
                          className="p-2 text-neutral-600 hover:text-neutral-400 transition-colors"
                        >
                          <Icon name="ChevronDown" size={18} />
                        </motion.button>

                        <button
                          type="button"
                          onClick={() => openConfirmModal(itemIndex)}
                          className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
                        >
                          <Icon name="Trash" size={18} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {expandedGroups.has(group.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-2 space-y-2">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-neutral-500">
                                  {group.links?.length || 0} link
                                  {(group.links?.length || 0) !== 1 ? "s" : ""}
                                </span>
                                <FormButton
                                  type="button"
                                  onClick={() => addLinkToGroup(group.id)}
                                >
                                  <Icon name="Plus" size={14} />
                                  Add Link
                                </FormButton>
                              </div>

                              {group.links && group.links.length > 0 ? (
                                <ul
                                  ref={(el) => {
                                    if (el)
                                      groupLinksRefs.current.set(group.id, el)
                                  }}
                                  className="space-y-2"
                                >
                                  {group.links.map((link, linkIndex) => (
                                    <li
                                      key={link.id}
                                      className="group/link flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
                                    >
                                      <button
                                        type="button"
                                        className="drag-handle cursor-grab text-neutral-600 hover:text-neutral-400 transition-colors"
                                      >
                                        <Icon name="GripVertical" size={16} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          openIconModal(
                                            "groupLink",
                                            itemIndex,
                                            linkIndex
                                          )
                                        }
                                        className="flex items-center justify-center w-8 h-8 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors"
                                      >
                                        {link.icon ? (
                                          <Icon
                                            name={
                                              link.icon as keyof typeof Icons
                                            }
                                            size={14}
                                          />
                                        ) : (
                                          <Icon
                                            name="PlusCircleDotted"
                                            size={14}
                                          />
                                        )}
                                      </button>

                                      <div className="w-1/4 flex flex-col">
                                        <input
                                          type="text"
                                          placeholder="Title"
                                          {...register(
                                            `contentItems.${itemIndex}.data.links.${linkIndex}.title` as const
                                          )}
                                          className="w-full px-3 py-2 bg-transparent border-b border-neutral-700 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                                        />
                                      </div>

                                      <div className="flex-1 flex flex-col">
                                        <input
                                          type="text"
                                          placeholder="https://example.com"
                                          {...register(
                                            `contentItems.${itemIndex}.data.links.${linkIndex}.url` as const
                                          )}
                                          className="w-full px-3 py-2 bg-transparent border-b border-neutral-700 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                                        />
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeLinkFromGroup(
                                            group.id,
                                            linkIndex
                                          )
                                        }
                                        className="p-1.5 text-neutral-600 opacity-0 group-hover/link:opacity-100 transition-opacity hover:text-white"
                                      >
                                        <Icon name="X" size={16} />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="min-h-[60px] flex items-center justify-center border border-dashed border-neutral-700 rounded-lg">
                                  <span className="text-neutral-600 text-sm">
                                    No links in this group
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }
              })}
            </div>
          ) : (
            <EmptyState message="No links or groups yet" />
          )}
        </Section>

        <FormButton
          type="submit"
          variant="primary"
          fullWidth
          disabled={shouldDisableSubmit()}
        >
          Save Changes
        </FormButton>
      </form>
    </div>
  )
}
