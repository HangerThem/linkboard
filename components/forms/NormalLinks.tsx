"use client"

import IconSearch from "@/components/modal/IconSearch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import z from "zod"
import { NormalLink, NormalLinkSchema } from "@/types/NormalLink"
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

type LinkType = "content" | "groupLink"

interface IconSelectionContext {
  type: LinkType
  itemIndex?: number
  linkIndex?: number
}

interface EditorProps {
  data: {
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

export default function NormalLinks({ data }: EditorProps) {
  const [originalData, setOriginalData] = useState(data)
  const [iconsModalOpen, setIconsModalOpen] = useState(false)
  const [iconSelectionContext, setIconSelectionContext] =
    useState<IconSelectionContext | null>(null)
  const contentListRef = useRef<HTMLDivElement>(null)
  const groupLinksRefs = useRef<Map<string, HTMLUListElement>>(new Map())
  const contentSnapshot = useRef<ContentItem[]>([])
  const groupLinksSnapshots = useRef<Map<string, NormalLink[]>>(new Map())
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [groupToDeleteIndex, setGroupToDeleteIndex] = useState<number | null>(
    null
  )

  const initialContentItems = buildContentItems(
    originalData.normalLinks,
    originalData.linkGroups || []
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
      contentItems: initialContentItems,
    },
  })

  const contentItems = watch("contentItems")
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
    const initialContent = buildContentItems(
      originalData.normalLinks,
      originalData.linkGroups || []
    )

    const normalizeForComparison = (items: ContentItem[]) =>
      items.map(({ order, ...rest }) => ({
        ...rest,
        data:
          rest.type === "group"
            ? {
                ...(rest.data as LinkGroup),
                links: (rest.data as LinkGroup).links?.map(
                  ({ order: linkOrder, ...linkRest }) => linkRest
                ),
              }
            : { ...(rest.data as NormalLink), order: undefined },
      }))

    const initialNormalized = JSON.stringify(
      normalizeForComparison(initialContent)
    )
    const currentNormalized = JSON.stringify(
      normalizeForComparison(contentItems)
    )

    return initialNormalized === currentNormalized
  }

  const handleIconSelect = (iconName: string) => {
    if (!iconSelectionContext) return

    const { type, itemIndex, linkIndex } = iconSelectionContext

    if (type === "content" && itemIndex !== undefined) {
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
        const reordered = updated.map((item, index) => {
          if (item.type === "link") {
            return {
              ...item,
              order: index,
              data: { ...item.data, order: index },
            }
          } else {
            return {
              ...item,
              order: index,
              data: { ...item.data, order: index },
            }
          }
        })
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
          const reorderedLinks = updatedLinks.map((link, idx) => ({
            ...link,
            order: idx,
          }))

          const updatedItems = contentItems.map((it, idx) => {
            if (idx === itemIndex && it.type === "group") {
              return { ...it, data: { ...it.data, links: reorderedLinks } }
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

      const response = await fetch("/api/links/normal/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          normalLinks,
          linkGroups,
        }),
      })

      if (!response.ok) throw new Error("Failed to save links")

      const responseData = await response.json().then((res) => res.data)

      setOriginalData({
        normalLinks: responseData.normalLinks,
        linkGroups: responseData.linkGroups,
      })

      const newContentItems = buildContentItems(
        responseData.normalLinks,
        responseData.linkGroups
      )
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
          title="Links & Groups"
          count={contentItems.length}
          isOpen={contentOpen}
          onToggle={() => setContentOpen(!contentOpen)}
          action={
            <div className="flex gap-2 ">
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
                      className="content-item group flex items-center gap-3 p-4 theme-link-card-nested hover:theme-border-hover transition-colors"
                    >
                      <button
                        type="button"
                        className="content-drag-handle cursor-grab theme-text-muted hover:theme-text-secondary transition-colors"
                      >
                        <Icon name="GripVertical" size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => openIconModal("content", itemIndex)}
                        className="theme-text-primary theme-icon-container theme-icon-container-md hover:theme-border-hover transition-colors"
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
                          className="theme-inline-input"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <input
                          type="text"
                          placeholder="https://example.com"
                          {...register(
                            `contentItems.${itemIndex}.data.url` as const
                          )}
                          className="theme-inline-input"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeContentItem(itemIndex)}
                        className="p-2 theme-text-muted hover:theme-text-primary transition-colors"
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
                      className="content-item theme-card overflow-hidden"
                    >
                      <div className="flex items-center gap-3 p-4 theme-group-header">
                        <button
                          type="button"
                          className="content-drag-handle cursor-grab theme-text-muted hover:theme-text-secondary transition-colors"
                        >
                          <Icon name="GripVertical" size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openIconModal("content", itemIndex)}
                          className="theme-text-primary theme-icon-container theme-icon-container-md hover:theme-border-hover transition-colors"
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
                            className="theme-inline-input"
                          />
                        </div>

                        <motion.button
                          animate={{
                            rotate: expandedGroups.has(group.id) ? 0 : 180,
                          }}
                          transition={{ duration: 0.2 }}
                          type="button"
                          onClick={() => toggleGroupExpanded(group.id)}
                          className="p-2 theme-text-muted hover:theme-text-secondary transition-colors"
                        >
                          <Icon name="ChevronDown" size={18} />
                        </motion.button>

                        <button
                          type="button"
                          onClick={() => openConfirmModal(itemIndex)}
                          className="p-2 theme-text-muted hover:text-red-500 transition-colors"
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
                                <span className="text-sm theme-text-muted">
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
                                      className="flex items-center gap-3 p-3 theme-link-card-nested"
                                    >
                                      <button
                                        type="button"
                                        className="drag-handle cursor-grab theme-text-muted hover:theme-text-secondary transition-colors"
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
                                        className="theme-icon-container theme-icon-container-sm hover:theme-border-hover transition-colors"
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
                                          className="theme-inline-input text-sm"
                                        />
                                      </div>

                                      <div className="flex-1 flex flex-col">
                                        <input
                                          type="text"
                                          placeholder="https://example.com"
                                          {...register(
                                            `contentItems.${itemIndex}.data.links.${linkIndex}.url` as const
                                          )}
                                          className="theme-inline-input text-sm"
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
                                        className="p-1.5 theme-text-muted opacity-0 group-hover/link:opacity-100 transition-opacity hover:theme-text-primary"
                                      >
                                        <Icon name="X" size={16} />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="theme-empty-state min-h-[60px] flex items-center justify-center">
                                  <span className="theme-text-muted text-sm">
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

          <FormButton
            type="submit"
            variant="primary"
            fullWidth
            disabled={shouldDisableSubmit()}
          >
            Save Changes
          </FormButton>
        </Section>
      </form>
    </div>
  )
}
