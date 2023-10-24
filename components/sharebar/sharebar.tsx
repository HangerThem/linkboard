import { Share, QrCode, Link45deg, CodeSquare } from "react-bootstrap-icons";
import {
  ShareBarContainer,
  ShareLinksContainer,
  ShareDialog,
  ShareTrigger,
} from "@/styles/shareBarStyles";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShareBar() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [shareOptionsOpen, setShareOptionsOpen] = useState<boolean>(false);

  const handleOpenOR = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(
      `<iframe src="${window.location.href}" height="750" width="375"/>`
    );
  };

  const handleOpenShareOptions = () => {
    setShareOptionsOpen(!shareOptionsOpen);
  };

  return (
    <>
      <ShareDialog open={dialogOpen}>
        <Image
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.href}`}
          alt="QR Code"
          width={250}
          height={250}
        />
      </ShareDialog>
      <ShareBarContainer>
        <ShareLinksContainer open={shareOptionsOpen}>
          <QrCode onClick={handleOpenOR} title="QR Code" />
          <Link45deg onClick={handleCopyLink} title="Copy Link" />
          <CodeSquare onClick={handleCopyEmbed} title="Copy Embed" />
        </ShareLinksContainer>
        <ShareTrigger onClick={handleOpenShareOptions}>
          <Share />
        </ShareTrigger>
      </ShareBarContainer>
    </>
  );
}
