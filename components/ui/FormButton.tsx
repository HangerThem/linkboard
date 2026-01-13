"use client"

import { motion, HTMLMotionProps } from "motion/react"
import { ReactNode } from "react"

interface FormButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode
  variant?: "primary" | "secondary"
  fullWidth?: boolean
}

export default function FormButton({
  children,
  variant = "primary",
  fullWidth = false,
  disabled,
  ...props
}: FormButtonProps) {
  const baseStyles =
    "flex items-center justify-center gap-2 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  const variantStyles = {
    primary: "px-4 py-2 bg-white text-black",
    secondary: "px-4 py-2 bg-neutral-800 text-white border border-neutral-700",
  }
  const widthStyles = fullWidth ? "w-full py-4 uppercase tracking-wider" : ""

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles}`}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.02,
              backgroundColor: variant === "primary" ? "#e5e5e5" : "#404040",
            }
      }
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
