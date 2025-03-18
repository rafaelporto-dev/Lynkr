"use client";

import { useState, useEffect } from "react";
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
import { Copy, Download, QrCode, Share2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type QRCodeColor = {
  id: string;
  name: string;
  fgColor: string;
  bgColor: string;
};

const qrCodeColors: QRCodeColor[] = [
  { id: "default", name: "Default", fgColor: "#000000", bgColor: "#FFFFFF" },
  { id: "purple", name: "Purple", fgColor: "#7C3AED", bgColor: "#FFFFFF" },
  { id: "blue", name: "Blue", fgColor: "#2563EB", bgColor: "#FFFFFF" },
  { id: "green", name: "Green", fgColor: "#10B981", bgColor: "#FFFFFF" },
  { id: "inverted", name: "Inverted", fgColor: "#FFFFFF", bgColor: "#000000" },
  { id: "brand", name: "Lynkr", fgColor: "#7C3AED", bgColor: "#F3F4F6" },
  { id: "dark", name: "Dark", fgColor: "#CCCCCC", bgColor: "#121212" },
  { id: "minimal", name: "Minimal", fgColor: "#333333", bgColor: "#FFFFFF" },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    fgColor: "#FFD700",
    bgColor: "#121212",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    fgColor: "#FF3EA5",
    bgColor: "#121212",
  },
  { id: "matrix", name: "Matrix", fgColor: "#00FF00", bgColor: "#000000" },
  {
    id: "glassmorphism",
    name: "Glass",
    fgColor: "#FFFFFF",
    bgColor: "rgba(255, 255, 255, 0.1)",
  },
  { id: "neon", name: "Neon", fgColor: "#7C3AED", bgColor: "#121212" },
];

export default function ProfileQRCode({
  username,
  customDomain,
  profileTheme,
}: {
  username: string;
  customDomain?: string;
  profileTheme?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Usar o tema do perfil como padrão se existir e corresponder a uma das nossas opções de cor
  const getInitialColorId = () => {
    // Se o tema do perfil existir e for um dos nossos temas de QR Code, use-o
    if (
      profileTheme &&
      qrCodeColors.some((color) => color.id === profileTheme)
    ) {
      return profileTheme;
    }

    // Caso contrário, use o tema padrão
    switch (profileTheme) {
      case "purple":
      case "blue":
      case "dark":
      case "minimal":
      case "cyberpunk":
      case "synthwave":
      case "matrix":
      case "glassmorphism":
      case "neon":
        return profileTheme;
      default:
        return "default";
    }
  };

  const [selectedColorId, setSelectedColorId] =
    useState<string>(getInitialColorId());
  const [qrSize, setQrSize] = useState<string>("200");

  // Determinar a URL a ser usada (domínio personalizado ou padrão)
  const profileUrl = customDomain
    ? `https://${customDomain}`
    : `https://lynkr.me/${username}`;

  // Obter o esquema de cores selecionado
  const selectedColor =
    qrCodeColors.find((color) => color.id === selectedColorId) ||
    qrCodeColors[0];

  // Atualizar a cor quando o tema do perfil mudar
  useEffect(() => {
    setSelectedColorId(getInitialColorId());
  }, [profileTheme]);

  const downloadQRCode = () => {
    const svg = document.getElementById("profile-qr-code");
    if (!svg) return;

    // Criar um elemento canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Criar uma imagem a partir do SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Definir dimensões do canvas
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;

      // Desenhar o fundo
      ctx.fillStyle = selectedColor.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar o QR code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Converter para PNG e baixar
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${username}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Limpar
      URL.revokeObjectURL(url);

      toast({
        title: "QR Code Downloaded",
        description: "Your profile QR code has been downloaded successfully.",
      });
    };

    img.src = url;
  };

  const copyQRCodeToClipboard = async () => {
    const svg = document.getElementById("profile-qr-code");
    if (!svg) return;

    try {
      // Serializar SVG
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });

      // Converter para canvas/imagem para a área de transferência
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;

        // Desenhar fundo
        ctx.fillStyle = selectedColor.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenhar QR code
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Obter como blob para a área de transferência
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              // Tentar copiar como imagem (navegadores modernos)
              await navigator.clipboard.write([
                new ClipboardItem({
                  [blob.type]: blob,
                }),
              ]);

              toast({
                title: "QR Code Copied",
                description: "QR code image copied to clipboard.",
              });
            } catch (err) {
              // Fallback - copiar URL
              await navigator.clipboard.writeText(profileUrl);
              toast({
                title: "Link Copied",
                description:
                  "Couldn't copy the image, but the link was copied.",
              });
            }
          }
          URL.revokeObjectURL(url);
        }, "image/png");
      };

      img.src = url;
    } catch (error) {
      console.error("Erro ao copiar QR code:", error);
      // Fallback para copiar a URL
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link Copied",
        description: "Profile link copied to clipboard.",
      });
    }
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
        <Button
          variant="outline"
          size="sm"
          className="gap-1 sm:gap-2 px-2 sm:px-3 py-1 h-auto text-xs sm:text-sm"
        >
          <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">QR Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-md p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg sm:text-xl">
            Your Profile QR Code
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Scan this QR code to visit your profile at {profileUrl}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="view" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="view" className="text-xs sm:text-sm py-1">
              View
            </TabsTrigger>
            <TabsTrigger value="customize" className="text-xs sm:text-sm py-1">
              Customize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="pt-4">
            <div
              className="flex justify-center p-4 rounded-lg"
              style={{ backgroundColor: selectedColor.bgColor }}
            >
              <QRCode
                id="profile-qr-code"
                value={profileUrl}
                size={parseInt(qrSize)}
                level="H"
                fgColor={selectedColor.fgColor}
                bgColor={selectedColor.bgColor}
              />
            </div>

            {/* Mobile quick actions */}
            <div className="flex gap-2 justify-center mt-4 sm:hidden">
              <Button
                variant="outline"
                onClick={copyQRCodeToClipboard}
                size="sm"
                className="h-8 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={shareQRCode}
                size="sm"
                className="h-8 px-2 text-xs"
              >
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
              <Button
                onClick={downloadQRCode}
                size="sm"
                className="h-8 px-2 text-xs bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </TabsContent>

          <TabsContent
            value="customize"
            className="space-y-3 sm:space-y-4 pt-4"
          >
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="color-select" className="text-xs sm:text-sm">
                QR Code Color
              </Label>
              <Select
                value={selectedColorId}
                onValueChange={setSelectedColorId}
              >
                <SelectTrigger
                  id="color-select"
                  className="h-8 sm:h-10 text-xs sm:text-sm"
                >
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {qrCodeColors.map((color) => (
                    <SelectItem
                      key={color.id}
                      value={color.id}
                      className="text-xs sm:text-sm py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.fgColor }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="size-select" className="text-xs sm:text-sm">
                Size
              </Label>
              <Select value={qrSize} onValueChange={setQrSize}>
                <SelectTrigger
                  id="size-select"
                  className="h-8 sm:h-10 text-xs sm:text-sm"
                >
                  <SelectValue placeholder="QR Code Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150" className="text-xs sm:text-sm py-1.5">
                    Small
                  </SelectItem>
                  <SelectItem value="200" className="text-xs sm:text-sm py-1.5">
                    Medium
                  </SelectItem>
                  <SelectItem value="250" className="text-xs sm:text-sm py-1.5">
                    Large
                  </SelectItem>
                  <SelectItem value="300" className="text-xs sm:text-sm py-1.5">
                    Extra Large
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview in customization tab */}
            <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="text-xs text-center text-gray-500 mb-3">
                Preview
              </div>
              <div
                className="flex justify-center"
                style={{
                  backgroundColor: selectedColor.bgColor,
                  borderRadius: "4px",
                  padding: "8px",
                }}
              >
                <QRCode
                  value={profileUrl}
                  size={Math.min(parseInt(qrSize) * 0.6, 150)}
                  level="H"
                  fgColor={selectedColor.fgColor}
                  bgColor={selectedColor.bgColor}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Desktop footer actions - hidden on mobile */}
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4 hidden sm:flex">
          <div className="flex gap-2 flex-1">
            <Button
              variant="outline"
              onClick={copyQRCodeToClipboard}
              className="flex-1 gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              onClick={shareQRCode}
              className="flex-1 gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
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
