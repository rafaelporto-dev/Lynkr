"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ShieldAlert } from "lucide-react";

interface AdultContentWarningDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  linkTitle: string;
}

export function AdultContentWarningDialog({
  isOpen,
  onConfirm,
  onCancel,
  linkTitle,
}: AdultContentWarningDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
            <ShieldAlert className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Adult Content Warning
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            The link{" "}
            <span className="font-medium text-yellow-600">{linkTitle}</span>{" "}
            may contain adult content.
          </DialogDescription>
        </DialogHeader>

        <div className="p-1 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This content may include sensitive material, such as nudity, violence,
            or explicit language. You confirm that you are at least 18 years old
            and wish to continue?
          </p>
        </div>

        <DialogFooter className="sm:justify-center gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="bg-yellow-600 hover:bg-yellow-700"
            onClick={onConfirm}
          >
            Yes, continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
