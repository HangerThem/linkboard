"use client"

import { Share, QrCode, Link45deg, CodeSquare } from "react-bootstrap-icons"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

export default function ShareBar() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [shareOptionsOpen, setShareOptionsOpen] = useState<boolean>(false)
  const [currentUrl, setCurrentUrl] = useState<string>("")

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const handleOpenOR = () => {
    dialogRef.current?.showModal()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
  }

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(`<iframe src="${currentUrl}" />`)
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
      <dialog ref={dialogRef}>
        {currentUrl && (
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentUrl}`}
            alt="QR Code"
            width={150}
            height={150}
          />
        )}
      </dialog>
      <div>
        <div>
          <QrCode onClick={handleOpenOR} title="QR Code" />
          <Link45deg onClick={handleCopyLink} title="Copy Link" />
          <CodeSquare onClick={handleCopyEmbed} title="Copy Embed" />
        </div>
        <div onClick={handleOpenShareOptions}>
          <Share style={{ zIndex: 1000 }} />
        </div>
      </div>
    </>
  )
}
