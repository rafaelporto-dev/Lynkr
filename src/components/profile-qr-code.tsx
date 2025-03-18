"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import QRCode from "react-qr-code";
import { Download, QrCode, Share2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

export default function ProfileQRCode({
  username,
  customDomain,
}: {
  username: string;
  customDomain?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Determine the URL to use (custom domain or default)
  const profileUrl = customDomain
    ? `https://${customDomain}`
    : `https://lynkr.me/${username}`;

  const downloadQRCode = () => {
    const svg = document.getElementById("profile-qr-code");
    if (!svg) return;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create an image from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;

      // Draw white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the QR code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert to PNG and download
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${username}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up
      URL.revokeObjectURL(url);

      toast({
        title: "QR Code Downloaded",
        description: "Your profile QR code has been downloaded successfully.",
      });
    };

    img.src = url;
  };

  const shareQRCode = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${username}'s Lynkr Profile`,
          text: `Check out my Lynkr profile!`,
          url: profileUrl,
        });
        toast({
          title: "Shared Successfully",
          description: "Your profile link has been shared.",
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(profileUrl);
        toast({
          title: "Link Copied",
          description: "Profile link copied to clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing Failed",
        description: "Could not share your profile link.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Profile QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to visit your profile at {profileUrl}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-4 bg-white rounded-lg">
          <QRCode
            id="profile-qr-code"
            value={profileUrl}
            size={200}
            level="H"
            fgColor="#000"
            bgColor="#fff"
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={shareQRCode}
            className="flex-1 gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share Link
          </Button>
          <Button
            onClick={downloadQRCode}
            className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
