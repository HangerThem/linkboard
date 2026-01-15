"use client"

import { X } from "react-bootstrap-icons"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"

const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
}

interface QRCodeModalProps {
  open: boolean
  url: string
  handleClose: () => void
}

export default function QRCodeModal({
  open,
  url,
  handleClose,
}: QRCodeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, handleClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 theme-overlay"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={smoothSpring}
              className="theme-modal space-y-5"
            >
              <div className="flex items-center justify-between">
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, ...smoothSpring }}
                  className="theme-text-primary font-semibold text-lg"
                >
                  Scan QR Code
                </motion.h3>
                <motion.button
                  onClick={handleClose}
                  className="theme-modal-close-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springTransition}
                >
                  <X size={20} />
                </motion.button>
              </div>
              {url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, ...smoothSpring }}
                  className="theme-qr-container"
                >
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${url}`}
                    alt="QR Code"
                    width={180}
                    height={180}
                    style={{ borderRadius: "var(--radius)" }}
                  />
                </motion.div>
              )}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="theme-text-muted text-xs text-center"
              >
                Point your camera to open this page
              </motion.p>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
