"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useRef } from "react"
import z from "zod"
import { Profile, ProfileCreateSchema } from "@/types/Profile"
import Section from "@/components/ui/Section"
import FormButton from "@/components/ui/FormButton"
import { motion } from "motion/react"
import Icon from "../icon"
import Image from "next/image"

const FormDataSchema = z.object({
  profile: ProfileCreateSchema,
})

type FormData = z.infer<typeof FormDataSchema>

interface ProfileFormProps {
  data: Profile
}

export default function ProfileForm({ data }: ProfileFormProps) {
  const [profileOpen, setProfileOpen] = useState(true)
  const [originalData, setOriginalData] = useState(data)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarRemoved, setAvatarRemoved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      profile: {
        name: originalData.name,
        bio: originalData.bio || "",
      },
    },
  })

  const profile = watch("profile")

  const shouldDisableSubmit = () => {
    const profileChanged =
      originalData.name !== profile.name ||
      (originalData.bio || "") !== (profile.bio || "")
    const avatarFile = watch("profile.avatar")
    const avatarChanged = Boolean(avatarFile && avatarFile.size > 0)
    return !profileChanged && !avatarChanged && !avatarRemoved
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("profile.avatar", file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    if (originalData.avatar && !avatarPreview) {
      setAvatarRemoved(true)
    }
    setAvatarPreview(null)
    setValue("profile.avatar", undefined)
  }

  const onSubmit = async (formData: FormData) => {
    try {
      const submitData = new FormData()
      submitData.append("name", formData.profile.name)
      submitData.append("bio", formData.profile.bio || "")

      if (formData.profile.avatar) {
        submitData.append("avatar", formData.profile.avatar)
      }

      const response = await fetch("/api/profile/save", {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      const responseData = await response.json().then((res) => res.data)

      setOriginalData(responseData.profile)
      setValue("profile.name", responseData.profile.name)
      setValue("profile.bio", responseData.profile.bio || "")
      setValue("profile.avatar", undefined)
      setAvatarPreview(null)
      setAvatarRemoved(false)

      alert("Profile saved successfully!")
    } catch (error) {
      console.error(error)
      alert("An error occurred while saving profile")
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section
          title="Profile"
          isOpen={profileOpen}
          onToggle={() => setProfileOpen(!profileOpen)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="p-4 h-64"
          >
            <div className="flex gap-6">
              <div className="relative group flex flex-col items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                <motion.button
                  type="button"
                  onClick={handleAvatarClick}
                  className="relative w-56 h-56 theme-bg-card border-2 border-dashed theme-border hover:theme-border-hover transition-colors flex items-center justify-center overflow-hidden group"
                  style={{ borderRadius: "var(--radius-lg)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {avatarPreview ? (
                    <>
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="theme-text-primary absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="Camera" size={24} />
                      </div>
                    </>
                  ) : originalData.avatar && !avatarRemoved ? (
                    <>
                      <Image
                        src={originalData.avatar}
                        alt="Current Avatar"
                        fill
                        className="object-cover"
                      />
                      <div className="theme-text-primary absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="Camera" size={24} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 theme-text-muted">
                      <Icon name="PersonCircle" size={32} />
                      <span className="text-xs">Upload</span>
                    </div>
                  )}
                </motion.button>
                {(avatarPreview || (originalData.avatar && !avatarRemoved)) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="theme-text-primary absolute top-2 right-2 p-1 theme-bg-card rounded-full hover:bg-red-600 transition-colors group-hover:flex hidden"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <label className="theme-text-muted text-xs uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("profile.name")}
                    placeholder="Your name"
                    className="theme-input"
                  />
                  {errors.profile?.name && (
                    <span className="text-red-500 text-xs">
                      {errors.profile.name.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="theme-text-muted text-xs uppercase tracking-wider">
                    Bio
                  </label>
                  <textarea
                    {...register("profile.bio")}
                    placeholder="A short bio about yourself"
                    rows={3}
                    className="theme-input h-28 resize-none"
                  />
                  {errors.profile?.bio && (
                    <span className="text-red-500 text-xs">
                      {errors.profile.bio.message}
                    </span>
                  )}
                </div>
              </div>
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
