"use client"

import IconSearch from "@/components/modal/IconSearch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import z from "zod"
import { NormalLink, NormalLinkSchema } from "@/types/NormalLink"
import { TopLink, TopLinkSchema } from "@/types/TopLink"
import Sortable from "sortablejs"
import * as Icons from "react-bootstrap-icons"
import { nanoid } from "nanoid"
import { motion, AnimatePresence } from "motion/react"
import Section from "@/components/ui/Section"
import FormButton from "@/components/ui/FormButton"
import EmptyState from "@/components/ui/EmptyState"

const FormDataSchema = z.object({
  topLinks: TopLinkSchema.array(),
  normalLinks: NormalLinkSchema.array(),
})

type FormData = z.infer<typeof FormDataSchema>

type LinkType = "top" | "normal"

interface EditorProps {
  data: {
    topLinks: TopLink[]
    normalLinks: NormalLink[]
  }
}

export default function Editor({ data }: EditorProps) {
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
      normalLinks: data.normalLinks,
    },
  })

  const topLinks = watch("topLinks")
  const normalLinks = watch("normalLinks")
  const [topLinksOpen, setTopLinksOpen] = useState(true)
  const [normalLinksOpen, setNormalLinksOpen] = useState(true)

  const addTopLink = () => {
    setValue("topLinks", [
      ...topLinks,
      { id: nanoid(), url: "", icon: "" } as TopLink,
    ])
  }

  const addNormalLink = () => {
    setValue("normalLinks", [
      ...normalLinks,
      { id: nanoid(), title: "", url: "", icon: null } as NormalLink,
    ])
  }

  const removeTopLink = (index: number) => {
    setValue(
      "topLinks",
      topLinks.filter((_, i) => i !== index)
    )
  }

  const removeNormalLink = (index: number) => {
    setValue(
      "normalLinks",
      normalLinks.filter((_, i) => i !== index)
    )
  }

  const shouldDisableSubmit = () => {
    const linksExist = topLinks.length > 0 || normalLinks.length > 0
    const changedFromInitial =
      JSON.stringify(data.topLinks) !== JSON.stringify(topLinks) ||
      JSON.stringify(data.normalLinks) !== JSON.stringify(normalLinks)

    if (!changedFromInitial) return true

    return !linksExist
  }

  const handleIconSelect = (iconName: string) => {
    if (selectedLinkIndex === null || selectedLinkType === null) return

    if (selectedLinkType === "top") {
      const updatedTopLinks = [...topLinks]
      updatedTopLinks[selectedLinkIndex] = {
        ...updatedTopLinks[selectedLinkIndex],
        icon: iconName,
      }
      setValue("topLinks", updatedTopLinks)
    } else {
      const updatedNormalLinks = [...normalLinks]
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
        topLinksSnapshot.current = [...topLinks]
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
  }, [topLinks.length, setValue, topLinks])

  useEffect(() => {
    if (!normalListRef.current) return

    const sortable = Sortable.create(normalListRef.current, {
      animation: 150,
      handle: ".drag-handle",
      onStart: () => {
        normalLinksSnapshot.current = [...normalLinks]
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
  }, [normalLinks.length, setValue, normalLinks])

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/links/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topLinks: data.topLinks,
          normalLinks: data.normalLinks,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save links")
      }

      const responseData = await response.json().then((res) => res.data)

      setValue("topLinks", responseData.topLinks)
      setValue("normalLinks", responseData.normalLinks)
      alert("Links saved successfully!")
    } catch (error) {
      console.error(error)
      alert("An error occurred while saving links")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <IconSearch
        open={iconsModalOpen}
        handleClose={() => {
          setIconsModalOpen(false)
          setSelectedLinkIndex(null)
          setSelectedLinkType(null)
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
              <Icons.Plus size={16} />
              Add
            </FormButton>
          }
        >
          {topLinks.length > 0 ? (
            <ul ref={topListRef} className="space-y-2">
              <AnimatePresence initial={false}>
                {topLinks.map((link, index) => {
                  const IconComponent = Icons[link.icon as keyof typeof Icons]
                  return (
                    <motion.li
                      key={link.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.15 }}
                      className="group flex items-center gap-3 p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
                    >
                      <button
                        type="button"
                        className="drag-handle cursor-grab text-neutral-600 hover:text-neutral-400 transition-colors"
                      >
                        <Icons.GripVertical size={18} />
                      </button>

                      <div className="flex flex-col items-center">
                        <motion.button
                          type="button"
                          onClick={() => openIconModal(index, "top")}
                          className={`flex items-center justify-center w-10 h-10 bg-neutral-800 border rounded-lg cursor-pointer ${
                            errors.topLinks?.[index]?.icon
                              ? "border-red-500"
                              : "border-neutral-700"
                          }`}
                          whileHover={{
                            borderColor: errors.topLinks?.[index]?.icon
                              ? "#ef4444"
                              : "#737373",
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {IconComponent ? (
                            <IconComponent size={18} className="text-white" />
                          ) : (
                            <Icons.QuestionCircle
                              size={18}
                              className={
                                errors.topLinks?.[index]?.icon
                                  ? "text-red-500"
                                  : "text-neutral-500"
                              }
                            />
                          )}
                        </motion.button>
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

                      <motion.button
                        type="button"
                        onClick={() => removeTopLink(index)}
                        className="p-2 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ color: "#ffffff" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icons.X size={18} />
                      </motion.button>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>
          ) : (
            <EmptyState message="No links yet" />
          )}
        </Section>

        <Section
          title="Links"
          count={normalLinks.length}
          isOpen={normalLinksOpen}
          onToggle={() => setNormalLinksOpen(!normalLinksOpen)}
          action={
            <FormButton type="button" onClick={addNormalLink}>
              <Icons.Plus size={16} />
              Add
            </FormButton>
          }
        >
          {normalLinks.length > 0 ? (
            <ul ref={normalListRef} className="space-y-2">
              <AnimatePresence initial={false}>
                {normalLinks.map((link, index) => {
                  const iconName = link.icon || ""
                  const IconComponent = Icons[iconName as keyof typeof Icons]
                  return (
                    <motion.li
                      key={link.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.15 }}
                      className="group flex items-center gap-3 p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
                    >
                      <button
                        type="button"
                        className="drag-handle cursor-grab text-neutral-600 hover:text-neutral-400 transition-colors"
                      >
                        <Icons.GripVertical size={18} />
                      </button>

                      <motion.button
                        type="button"
                        onClick={() => openIconModal(index, "normal")}
                        className="flex items-center justify-center w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer"
                        whileHover={{ borderColor: "#737373" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {IconComponent ? (
                          <IconComponent size={18} className="text-white" />
                        ) : (
                          <Icons.QuestionCircle
                            size={18}
                            className="text-neutral-500"
                          />
                        )}
                      </motion.button>

                      <div className="w-1/4 flex flex-col">
                        <input
                          type="text"
                          placeholder="Title"
                          {...register(`normalLinks.${index}.title`)}
                          className={`w-full px-4 py-2.5 bg-transparent border-b text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                            errors.normalLinks?.[index]?.title
                              ? "border-red-500 focus:border-red-500"
                              : "border-neutral-700 focus:border-white"
                          }`}
                        />
                        {errors.normalLinks?.[index]?.title && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors.normalLinks[index].title.message ||
                              "Title is required"}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col">
                        <input
                          type="text"
                          placeholder="https://example.com"
                          {...register(`normalLinks.${index}.url`)}
                          className={`w-full px-4 py-2.5 bg-transparent border-b text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                            errors.normalLinks?.[index]?.url
                              ? "border-red-500 focus:border-red-500"
                              : "border-neutral-700 focus:border-white"
                          }`}
                        />
                        {errors.normalLinks?.[index]?.url && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors.normalLinks[index].url.message ||
                              "Valid URL is required"}
                          </span>
                        )}
                      </div>

                      <motion.button
                        type="button"
                        onClick={() => removeNormalLink(index)}
                        className="p-2 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ color: "#ffffff" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icons.X size={18} />
                      </motion.button>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>
          ) : (
            <EmptyState message="No links yet" />
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
