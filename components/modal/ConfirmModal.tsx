import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  handleConfirm: () => void
  handleClose: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  handleConfirm,
  handleClose,
}: ConfirmModalProps) {
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6"
              ref={modalRef}
            >
              <h3 className="text-white text-xl font-medium mb-4">{title}</h3>
              <p className="text-neutral-400 mb-6">{message}</p>
              <div className="flex justify-end gap-4">
                <motion.button
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 hover:bg-neutral-800/80 hover:text-white transition-colors"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleConfirm()
                    handleClose()
                  }}
                  className="px-4 py-2 bg-red-600 border border-red-700 rounded-lg text-white hover:bg-red-700 transition-colors"
                >
                  {confirmText}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
