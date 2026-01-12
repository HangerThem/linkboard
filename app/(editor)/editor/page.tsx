"use client"

import IconSearch from "@/components/modal/IconSearch"
import { useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { NormalLink } from "@/types/NormalLink"
import { TopLink } from "@/types/TopLink"
import Sortable from "sortablejs"
import * as Icons from "react-bootstrap-icons"
import { nanoid } from "nanoid"

interface FormData {
  topLinks: TopLink[]
  normalLinks: NormalLink[]
}

type LinkType = "top" | "normal"

export default function EditorPage() {
  const [iconsModalOpen, setIconsModalOpen] = useState(false)
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number | null>(
    null
  )
  const [selectedLinkType, setSelectedLinkType] = useState<LinkType | null>(
    null
  )
  const topListRef = useRef<HTMLUListElement>(null)
  const normalListRef = useRef<HTMLUListElement>(null)
  const topLinksSnapshot = useRef<TopLink[]>([])
  const normalLinksSnapshot = useRef<NormalLink[]>([])
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      topLinks: [],
      normalLinks: [],
    },
  })

  const addTopLink = () => {
    const currentTopLinks = watch("topLinks")
    setValue("topLinks", [
      ...currentTopLinks,
      { id: nanoid(), url: "", icon: "" } as TopLink,
    ])
  }

  const addNormalLink = () => {
    const currentNormalLinks = watch("normalLinks")
    setValue("normalLinks", [
      ...currentNormalLinks,
      { id: nanoid(), title: "", url: "", icon: null } as NormalLink,
    ])
  }

  const removeTopLink = (index: number) => {
    const currentTopLinks = watch("topLinks")
    setValue(
      "topLinks",
      currentTopLinks.filter((_, i) => i !== index)
    )
  }

  const removeNormalLink = (index: number) => {
    const currentNormalLinks = watch("normalLinks")
    setValue(
      "normalLinks",
      currentNormalLinks.filter((_, i) => i !== index)
    )
  }

  const handleIconSelect = (iconName: string) => {
    if (selectedLinkIndex === null || selectedLinkType === null) return

    if (selectedLinkType === "top") {
      const currentTopLinks = watch("topLinks")
      const updatedTopLinks = [...currentTopLinks]
      updatedTopLinks[selectedLinkIndex] = {
        ...updatedTopLinks[selectedLinkIndex],
        icon: iconName,
      }
      setValue("topLinks", updatedTopLinks)
    } else {
      const currentNormalLinks = watch("normalLinks")
      const updatedNormalLinks = [...currentNormalLinks]
      updatedNormalLinks[selectedLinkIndex] = {
        ...updatedNormalLinks[selectedLinkIndex],
        icon: iconName,
      }
      setValue("normalLinks", updatedNormalLinks)
    }

    setSelectedLinkIndex(null)
    setSelectedLinkType(null)
  }

  const openIconModal = (index: number, type: LinkType) => {
    setSelectedLinkIndex(index)
    setSelectedLinkType(type)
    setIconsModalOpen(true)
  }

  useEffect(() => {
    if (!topListRef.current) return

    const sortable = Sortable.create(topListRef.current, {
      animation: 150,
      handle: ".drag-handle",
      onStart: () => {
        topLinksSnapshot.current = [...watch("topLinks")]
      },
      onEnd: ({ oldIndex, newIndex }) => {
        if (oldIndex == null || newIndex == null) return

        const updatedTopLinks = [...topLinksSnapshot.current]
        const [movedItem] = updatedTopLinks.splice(oldIndex, 1)
        updatedTopLinks.splice(newIndex, 0, movedItem)
        setValue("topLinks", updatedTopLinks)
      },
    })

    return () => sortable.destroy()
  }, [watch("topLinks").length, setValue, watch])

  useEffect(() => {
    if (!normalListRef.current) return

    const sortable = Sortable.create(normalListRef.current, {
      animation: 150,
      handle: ".drag-handle",
      onStart: () => {
        normalLinksSnapshot.current = [...watch("normalLinks")]
      },
      onEnd: ({ oldIndex, newIndex }) => {
        if (oldIndex == null || newIndex == null) return

        const updatedNormalLinks = [...normalLinksSnapshot.current]
        const [movedItem] = updatedNormalLinks.splice(oldIndex, 1)
        updatedNormalLinks.splice(newIndex, 0, movedItem)
        setValue("normalLinks", updatedNormalLinks)
      },
    })

    return () => sortable.destroy()
  }, [watch("normalLinks").length, setValue, watch])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <IconSearch
          open={iconsModalOpen}
          handleClose={() => {
            setIconsModalOpen(false)
            setSelectedLinkIndex(null)
            setSelectedLinkType(null)
          }}
          handleSelect={handleIconSelect}
        />

        <form
          onSubmit={handleSubmit((data) => {
            console.log("Form submitted:", data)
          })}
          className="space-y-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Links
              </h2>
              <button
                type="button"
                onClick={addTopLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Icons.Plus size={20} />
                Add Link
              </button>
            </div>

            <ul ref={topListRef} className="space-y-3">
              {watch("topLinks").map((link, index) => {
                const IconComponent = Icons[link.icon as keyof typeof Icons]
                return (
                  <li
                    key={link.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <button
                      type="button"
                      className="drag-handle cursor-grab text-gray-400 hover:text-gray-600"
                    >
                      <Icons.GripVertical size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() => openIconModal(index, "top")}
                      className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:border-blue-500 transition-colors"
                    >
                      {IconComponent ? (
                        <IconComponent
                          size={20}
                          className="text-gray-700 dark:text-gray-200"
                        />
                      ) : (
                        <Icons.QuestionCircle
                          size={20}
                          className="text-gray-400"
                        />
                      )}
                    </button>

                    <input
                      type="text"
                      placeholder="https://example.com"
                      {...register(`topLinks.${index}.url` as const)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() => removeTopLink(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Icons.Trash size={18} />
                    </button>
                  </li>
                )
              })}
            </ul>

            {watch("topLinks").length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No top links yet. Click "Add Link" to get started.
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Normal Links
              </h2>
              <button
                type="button"
                onClick={addNormalLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Icons.Plus size={20} />
                Add Link
              </button>
            </div>

            <ul ref={normalListRef} className="space-y-3">
              {watch("normalLinks").map((link, index) => {
                const iconName = link.icon || ""
                const IconComponent = Icons[iconName as keyof typeof Icons]
                return (
                  <li
                    key={link.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <button
                      type="button"
                      className="drag-handle cursor-grab text-gray-400 hover:text-gray-600"
                    >
                      <Icons.GripVertical size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() => openIconModal(index, "normal")}
                      className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:border-blue-500 transition-colors"
                    >
                      {IconComponent ? (
                        <IconComponent
                          size={20}
                          className="text-gray-700 dark:text-gray-200"
                        />
                      ) : (
                        <Icons.QuestionCircle
                          size={20}
                          className="text-gray-400"
                        />
                      )}
                    </button>

                    <input
                      type="text"
                      placeholder="Title"
                      {...register(`normalLinks.${index}.title` as const)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="text"
                      placeholder="https://example.com"
                      {...register(`normalLinks.${index}.url` as const)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() => removeNormalLink(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Icons.Trash size={18} />
                    </button>
                  </li>
                )
              })}
            </ul>

            {watch("normalLinks").length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No normal links yet. Click "Add Link" to get started.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-colors shadow-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
