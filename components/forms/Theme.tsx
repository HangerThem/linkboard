"use client"

import { Theme } from "@/prisma/generated/enums"
import { useState } from "react"
import { motion } from "motion/react"
import Section from "@/components/ui/Section"
import FormButton from "@/components/ui/FormButton"
import Icon from "../icon"
import Image from "next/image"

interface ThemeFormProps {
  data: Theme
}

export default function ThemeForm({ data }: ThemeFormProps) {
  const [originalTheme, setOriginalTheme] = useState<Theme>(data)
  const [selectedTheme, setSelectedTheme] = useState<Theme>(data)
  const [themeOpen, setThemeOpen] = useState(true)

  const shouldDisableSubmit = () => {
    return originalTheme === selectedTheme
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/theme/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: selectedTheme,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save theme")
      }

      alert("Theme saved successfully!")
      setOriginalTheme(selectedTheme)
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert("An error occurred while saving theme")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <Section
          title="Theme"
          isOpen={themeOpen}
          onToggle={() => setThemeOpen(!themeOpen)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="p-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(Theme).map((themeOption) => (
                <motion.label
                  key={themeOption}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  className={`relative h-48 cursor-pointer overflow-hidden theme-link-card-nested hover:theme-border-hover transition-all ${
                    selectedTheme === themeOption
                      ? "border-5 border-theme-primary theme-border-hover"
                      : ""
                  }`}
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={themeOption}
                    checked={selectedTheme === themeOption}
                    onChange={() => setSelectedTheme(themeOption)}
                    className="hidden"
                  />
                  <Image
                    src={`/theme-previews/${themeOption}.png`}
                    alt={`${themeOption} theme preview`}
                    fill
                    className="object-cover"
                  />
                  {selectedTheme === themeOption && (
                    <div className="absolute top-2 right-2 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center z-10">
                      <Icon name="Check" size={14} />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-theme-bg/60 backdrop-blur-sm py-2 px-3">
                    <span className="theme-text-primary text-sm font-medium">
                      {themeOption.at(0)?.toUpperCase() +
                        themeOption.slice(1).replace("_", " ")}
                    </span>
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

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
