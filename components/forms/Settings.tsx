"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import z from "zod"
import { Settings, SettingsSchema } from "@/types/Settings"
import Section from "@/components/ui/Section"
import FormButton from "@/components/ui/FormButton"
import Toggle from "@/components/ui/Toggle"
import TabSelector from "@/components/ui/TabSelector"
import { motion } from "motion/react"
import Icon from "../icon"
import { Density } from "@/prisma/generated/enums"

const FormDataSchema = z.object({
  settings: SettingsSchema,
})

type FormData = z.infer<typeof FormDataSchema>

interface SettingsFormProps {
  data: Settings
}

export default function SettingsForm({ data }: SettingsFormProps) {
  const [generalOpen, setGeneralOpen] = useState(true)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      settings: data,
    },
  })

  const settings = watch("settings")

  const shouldDisableSubmit = () => {
    return JSON.stringify(data) === JSON.stringify(settings)
  }

  const onSubmit = async (formData: FormData) => {
    console.log("Submitting form data:", formData)
    try {
      const response = await fetch("/api/settings/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: formData.settings,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      alert("Settings saved successfully!")
    } catch (error) {
      console.error(error)
      alert("An error occurred while saving settings")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section
          title="General"
          isOpen={generalOpen}
          onToggle={() => setGeneralOpen(!generalOpen)}
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-lg">
                  <Icon name="Code" size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    Show Source Link
                  </span>
                  <span className="text-neutral-500 text-xs">
                    Display a link to the GitHub repository
                  </span>
                </div>
              </div>
              <Controller
                name="settings.source"
                control={control}
                render={({ field }) => (
                  <Toggle checked={field.value} onChange={field.onChange} />
                )}
              />
            </motion.div>
            {errors.settings?.source && (
              <span className="text-red-500 text-xs">
                {errors.settings.source.message}
              </span>
            )}
          </div>
          <div className="space-y-4 mt-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-lg">
                  <Icon name="Share" size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    Show Share Bar
                  </span>
                  <span className="text-neutral-500 text-xs">
                    Display a share bar on the link board
                  </span>
                </div>
              </div>
              <Controller
                name="settings.shareBar"
                control={control}
                render={({ field }) => (
                  <Toggle checked={field.value} onChange={field.onChange} />
                )}
              />
            </motion.div>
            {errors.settings?.shareBar && (
              <span className="text-red-500 text-xs">
                {errors.settings.shareBar.message}
              </span>
            )}
          </div>

          <div className="space-y-4 mt-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-neutral-800 border border-neutral-700 rounded-lg">
                  <Icon name="LayoutThreeColumns" size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    Density
                  </span>
                  <span className="text-neutral-500 text-xs">
                    Adjust the spacing of the link board
                  </span>
                </div>
              </div>
              <Controller
                name="settings.density"
                control={control}
                render={({ field }) => (
                  <TabSelector
                    tabs={Object.values(Density)}
                    selectedTab={field.value}
                    onSelectTab={field.onChange}
                  />
                )}
              />
            </motion.div>
            {errors.settings?.density && (
              <span className="text-red-500 text-xs">
                {errors.settings.density.message}
              </span>
            )}
          </div>

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
