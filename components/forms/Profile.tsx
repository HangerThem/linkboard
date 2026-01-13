"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useRef } from "react"
import z from "zod"
import { Profile, ProfileCreate, ProfileCreateSchema } from "@/types/Profile"
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
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
        name: data.name,
        bio: data.bio || "",
        avatar: undefined,
      },
    },
  })

  const profile = watch("profile")

  const shouldDisableSubmit = () => {
    const profileChanged =
      data.name !== profile.name || (data.bio || "") !== (profile.bio || "")
    const avatarFile = watch("profile.avatar")
    const avatarChanged = Boolean(avatarFile && avatarFile.size > 0)
    return !profileChanged && !avatarChanged
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
    setValue("profile.avatar", undefined)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
            className="p-4 bg-neutral-800/50 border border-neutral-800 rounded-lg"
          >
            <div className="flex gap-6">
              {/* Avatar Upload - Left Side */}
              <div className="flex flex-col items-center gap-2">
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
                  className="relative w-24 h-24 rounded-full bg-neutral-800 border-2 border-dashed border-neutral-600 hover:border-neutral-500 transition-colors flex items-center justify-center overflow-hidden group"
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
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="Camera" size={24} />
                      </div>
                    </>
                  ) : data.avatar ? (
                    <>
                      <Image
                        src={`/${data.avatar}`}
                        alt="Current Avatar"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="Camera" size={24} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-neutral-500">
                      <Icon name="PersonCircle" size={32} />
                      <span className="text-xs">Upload</span>
                    </div>
                  )}
                </motion.button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-xs text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Name and Bio - Right Side */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Name Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-neutral-400 text-xs uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("profile.name")}
                    placeholder="Your name"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                  {errors.profile?.name && (
                    <span className="text-red-500 text-xs">
                      {errors.profile.name.message}
                    </span>
                  )}
                </div>

                {/* Bio Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-neutral-400 text-xs uppercase tracking-wider">
                    Bio
                  </label>
                  <textarea
                    {...register("profile.bio")}
                    placeholder="A short bio about yourself"
                    rows={3}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
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
