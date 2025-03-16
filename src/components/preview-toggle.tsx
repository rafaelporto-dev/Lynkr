"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface PreviewToggleProps {
  onToggle: (isPreviewMode: boolean) => void;
  isPreviewMode: boolean;
}

export default function PreviewToggle({
  onToggle,
  isPreviewMode,
}: PreviewToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isPreviewMode ? "secondary" : "outline"}
            size="sm"
            onClick={() => onToggle(!isPreviewMode)}
            className={`${isPreviewMode ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}`}
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Exit Preview
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview Profile
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isPreviewMode
              ? "Return to dashboard"
              : "See how your profile looks to visitors"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
