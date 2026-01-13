"use client"

import {
  Share,
  QrCode,
  Link45deg,
  CodeSquare,
  X,
  Check,
} from "react-bootstrap-icons"
import Image from "next/image"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
}

const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
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
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [shareOptionsOpen, setShareOptionsOpen] = useState<boolean>(false)
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [copied, setCopied] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
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
    dialogRef.current?.showModal()
    requestAnimationFrame(() => {
      setDialogOpen(true)
    })
  }, [])

  const handleCloseQR = useCallback(() => {
    setDialogOpen(false)
    setTimeout(() => dialogRef.current?.close(), 200)
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
    const dialog = dialogRef.current
    if (!dialog) return

    const handleDialogClick = (event: MouseEvent) => {
      if (event.target === dialog) {
        handleCloseQR()
      }
    }

    dialog.addEventListener("click", handleDialogClick)
    return () => {
      dialog.removeEventListener("click", handleDialogClick)
    }
  }, [handleCloseQR])

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
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-transparent border-none outline-none p-0 m-auto"
      >
        <AnimatePresence mode="wait">
          {dialogOpen && (
            <motion.div
              ref={dialogContentRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={smoothSpring}
              className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-3xl p-6 space-y-5 shadow-2xl shadow-black/50"
            >
              <div className="flex items-center justify-between">
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, ...smoothSpring }}
                  className="text-white font-semibold text-lg"
                >
                  Scan QR Code
                </motion.h3>
                <motion.button
                  onClick={handleCloseQR}
                  className="p-2 text-neutral-400 hover:text-white transition-all duration-200 rounded-xl hover:bg-neutral-800/80"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springTransition}
                >
                  <X size={20} />
                </motion.button>
              </div>
              {currentUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, ...smoothSpring }}
                  className="bg-white p-4 rounded-2xl shadow-lg"
                >
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${currentUrl}`}
                    alt="QR Code"
                    width={180}
                    height={180}
                    className="rounded-xl"
                  />
                </motion.div>
              )}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-neutral-500 text-xs text-center"
              >
                Point your camera to open this page
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>

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
                  className="h-12 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/50 rounded-full px-2 py-2 shadow-xl shadow-black/20"
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
                        className={`relative p-2 rounded-full transition-colors duration-200 ${
                          isCopied
                            ? "bg-neutral-500/20 text-neutral-400"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-700/50"
                        }`}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        title={button.label}
                      >
                        <AnimatePresence mode="wait">
                          {isCopied ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={springTransition}
                            >
                              <Check size={18} />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="icon"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={springTransition}
                            >
                              <button.icon size={18} />
                            </motion.div>
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
            className="relative h-12 w-12 flex items-center justify-center bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/50 text-neutral-400 hover:text-white hover:border-neutral-600 rounded-full transition-all duration-300 shadow-xl shadow-black/20"
            whileHover={{
              boxShadow: "0 0 20px rgba(255,255,255,0.1)",
            }}
            transition={springTransition}
          >
            <motion.div
              animate={{
                rotate: shareOptionsOpen ? 180 : 0,
              }}
              transition={smoothSpring}
            >
              <Share size={18} />
            </motion.div>

            {!shareOptionsOpen && (
              <motion.div
                className="absolute inset-0 rounded-full border border-neutral-600/50"
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
