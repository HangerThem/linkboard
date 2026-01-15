"use client"

import {
  Share,
  QrCode,
  Link45deg,
  CodeSquare,
  Check,
} from "react-bootstrap-icons"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import QRCodeModal from "@/components/modal/QRCodeModal"

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.5, x: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    x: 15,
    transition: { duration: 0.15 },
  },
}

const shareButtons = [
  { id: "qr", icon: QrCode, label: "QR Code" },
  { id: "link", icon: Link45deg, label: "Copy Link" },
  { id: "embed", icon: CodeSquare, label: "Copy Embed" },
]

export default function ShareBar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shareOptionsOpen, setShareOptionsOpen] = useState<boolean>(false)
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [copied, setCopied] = useState<string | null>(null)
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setShareOptionsOpen(false)
    }, 8000)
  }, [])

  const handleOpenQR = useCallback(() => {
    setQrModalOpen(true)
  }, [])

  const handleCloseQR = useCallback(() => {
    setQrModalOpen(false)
  }, [])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    setCopied("link")
    resetTimeout()
    setTimeout(() => setCopied(null), 2500)
  }

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(
      `<iframe src="${currentUrl}" frameborder="0" />`
    )
    setCopied("embed")
    resetTimeout()
    setTimeout(() => setCopied(null), 2500)
  }

  const handleOpenShareOptions = () => {
    setShareOptionsOpen((prev) => !prev)
  }

  const handleButtonClick = (id: string) => {
    switch (id) {
      case "qr":
        handleOpenQR()
        break
      case "link":
        handleCopyLink()
        break
      case "embed":
        handleCopyEmbed()
        break
    }
  }

  useEffect(() => {
    if (shareOptionsOpen) {
      resetTimeout()
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [shareOptionsOpen, resetTimeout])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShareOptionsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <QRCodeModal
        open={qrModalOpen}
        url={currentUrl}
        handleClose={handleCloseQR}
      />

      <div ref={containerRef} className="fixed top-6 right-6 z-50">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {shareOptionsOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden h-12"
              >
                <motion.div
                  className="theme-share-options"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {shareButtons.map((button) => {
                    const isCopied = copied === button.id

                    return (
                      <motion.button
                        key={button.id}
                        variants={buttonVariants}
                        onClick={() => handleButtonClick(button.id)}
                        className="theme-share-option-btn"
                        data-copied={isCopied}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        title={button.label}
                      >
                        <AnimatePresence mode="wait">
                          {isCopied ? (
                            <motion.span
                              key="check"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={springTransition}
                              className="theme-share-icon text-green-500"
                            >
                              <Check size={18} />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="icon"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={springTransition}
                              className="theme-share-icon"
                            >
                              <button.icon size={18} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    )
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleOpenShareOptions}
            className="theme-share-btn"
            whileHover={{
              boxShadow: "var(--shadow-lg)",
            }}
            transition={springTransition}
          >
            <motion.span
              animate={{
                rotate: shareOptionsOpen ? 180 : 0,
              }}
              transition={springTransition}
              className="theme-share-icon"
            >
              <Share size={18} />
            </motion.span>

            {!shareOptionsOpen && (
              <motion.div
                className="absolute inset-0 theme-border border"
                style={{ borderRadius: "var(--radius-full)" }}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.button>
        </div>
      </div>
    </>
  )
}
