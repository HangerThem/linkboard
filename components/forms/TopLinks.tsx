"use client"

import IconSearch from "@/components/modal/IconSearch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import z from "zod"
import { TopLink, TopLinkSchema } from "@/types/TopLink"
import Sortable from "sortablejs"
import { nanoid } from "nanoid"
import Section from "@/components/ui/Section"
import FormButton from "@/components/ui/FormButton"
import EmptyState from "@/components/ui/EmptyState"
import Icon from "../icon"
import * as Icons from "react-bootstrap-icons"

const FormDataSchema = z.object({
  topLinks: TopLinkSchema.array(),
})

type FormData = z.infer<typeof FormDataSchema>

interface IconSelectionContext {
  itemIndex?: number
  linkIndex?: number
}

interface EditorProps {
  data: TopLink[]
}

export default function TopLinks({ data }: EditorProps) {
  const [originalData, setOriginalData] = useState(data)
  const [iconsModalOpen, setIconsModalOpen] = useState(false)
  const [iconSelectionContext, setIconSelectionContext] =
    useState<IconSelectionContext | null>(null)
  const topListRef = useRef<HTMLUListElement>(null)
  const topLinksSnapshot = useRef<TopLink[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      topLinks: originalData,
    },
  })

  const topLinks = watch("topLinks")
  const [topLinksOpen, setTopLinksOpen] = useState(true)

  const addTopLink = () => {
    setValue("topLinks", [
      ...topLinks,
      { id: nanoid(), url: "", icon: "", order: topLinks.length } as TopLink,
    ])
  }

  const shouldDisableSubmit = () => {
    const normalizeForComparison = (links: TopLink[]) =>
      links.map(({ order, ...rest }) => rest)

    const initialNormalized = JSON.stringify(
      normalizeForComparison(originalData)
    )
    const currentNormalized = JSON.stringify(normalizeForComparison(topLinks))

    return initialNormalized === currentNormalized
  }

  const handleIconSelect = (iconName: string) => {
    if (!iconSelectionContext) return

    const { itemIndex } = iconSelectionContext

    if (itemIndex !== undefined) {
      const updatedTopLinks = [...topLinks]
      updatedTopLinks[itemIndex] = {
        ...updatedTopLinks[itemIndex],
        icon: iconName,
      }
      setValue("topLinks", updatedTopLinks)
    }

    setIconSelectionContext(null)
  }

  const openIconModal = (itemIndex?: number, linkIndex?: number) => {
    setIconSelectionContext({ itemIndex, linkIndex })
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
        const reordered = updated.map((item, index) => ({
          ...item,
          order: index,
        }))
        setValue("topLinks", reordered)
      },
    })
    return () => sortable.destroy()
  }, [topLinks.length, setValue, topLinks])

  const removeTopLink = (index: number) => {
    const updated = [...topLinks]
    updated.splice(index, 1)
    setValue("topLinks", updated)
  }

  const onSubmit = async (formData: FormData) => {
    try {
      const response = await fetch("/api/links/top/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topLinks: formData.topLinks.map((link, index) => ({
            ...link,
            order: index,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to save links")

      const responseData = await response.json().then((res) => res.data)

      setOriginalData(responseData.topLinks)
      setValue("topLinks", responseData.topLinks)
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
                  className="group flex items-center gap-3 p-4 theme-link-card-nested hover:theme-border-hover transition-colors"
                >
                  <button
                    type="button"
                    className="drag-handle cursor-grab theme-text-muted hover:theme-text-primary transition-colors"
                  >
                    <Icon name="GripVertical" size={18} />
                  </button>

                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => openIconModal(index)}
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
                      className={`theme-inline-input ${
                        errors.topLinks?.[index]?.url
                          ? "!border-red-500 focus:!border-red-500"
                          : ""
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
                    className="p-2 theme-text-muted hover:theme-text-primary transition-colors"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No links yet" />
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
