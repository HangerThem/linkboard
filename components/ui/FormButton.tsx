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
    variant === "primary" ? "theme-btn-primary" : "theme-btn-secondary"
  const widthStyles = fullWidth ? "w-full py-4 uppercase tracking-wider" : ""

  return (
    <motion.button
      className={`${baseStyles} ${widthStyles}`}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
