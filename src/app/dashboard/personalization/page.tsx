"use client";
import ProfileEditor from "@/components/profile-editor";
import PreviewToggle from "@/components/preview-toggle";
import ProfilePreview from "@/components/profile-preview";
import { InfoIcon, Palette } from "lucide-react";
import { useState } from "react";

export default function PersonalizationPage() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  if (isPreviewMode) {
    return <ProfilePreview onClose={() => setIsPreviewMode(false)} />;
  }

  return (
    <main className="w-full">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Palette className="h-7 w-7" />
              Personalization
            </h1>
            <PreviewToggle
              isPreviewMode={isPreviewMode}
              onToggle={setIsPreviewMode}
            />
          </div>
          <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
            <InfoIcon size="14" />
            <span>Personalize the appearance and style of your profile</span>
          </div>
        </header>

        {/* Profile Editor (Personalization Part) */}
        <ProfileEditor />
      </div>
    </main>
  );
}
