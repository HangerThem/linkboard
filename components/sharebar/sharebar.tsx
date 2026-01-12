"use client"

import { Share, QrCode, Link45deg, CodeSquare, X } from "react-bootstrap-icons"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

export default function ShareBar() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [shareOptionsOpen, setShareOptionsOpen] = useState<boolean>(false)
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const handleOpenQR = () => {
    dialogRef.current?.showModal()
  }

  const handleCloseQR = () => {
    dialogRef.current?.close()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    setCopied("link")
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(`<iframe src="${currentUrl}" />`)
    setCopied("embed")
    setTimeout(() => setCopied(null), 2000)
  }

  const handleOpenShareOptions = () => {
    setShareOptionsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (shareOptionsOpen) {
      const timer = setTimeout(() => {
        setShareOptionsOpen(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [shareOptionsOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.firstChild?.contains(event.target as Node)
      ) {
        dialogRef.current.close()
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
        className="backdrop:bg-black/80 bg-transparent border-none outline-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Scan QR Code</h3>
            <motion.button
              onClick={handleCloseQR}
              className="p-2 text-neutral-500 hover:text-white transition-colors rounded-lg hover:bg-neutral-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          </div>
          {currentUrl && (
            <div className="bg-white p-3 rounded-xl">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentUrl}`}
                alt="QR Code"
                width={150}
                height={150}
                className="rounded-lg"
              />
            </div>
          )}
        </motion.div>
      </dialog>

      <div className="fixed top-6 right-6 z-50">
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {shareOptionsOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-2 py-2"
              >
                <motion.button
                  onClick={handleOpenQR}
                  className="p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="QR Code"
                >
                  <QrCode size={18} />
                </motion.button>
                <motion.button
                  onClick={handleCopyLink}
                  className="p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy Link"
                >
                  <Link45deg size={18} />
                  <AnimatePresence>
                    {copied === "link" && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-green-500 whitespace-nowrap"
                      >
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  onClick={handleCopyEmbed}
                  className="p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy Embed"
                >
                  <CodeSquare size={18} />
                  <AnimatePresence>
                    {copied === "embed" && (
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-green-500 whitespace-nowrap"
                      >
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleOpenShareOptions}
            className="p-3 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: shareOptionsOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Share size={18} />
          </motion.button>
        </div>
      </div>
    </>
  )
}
