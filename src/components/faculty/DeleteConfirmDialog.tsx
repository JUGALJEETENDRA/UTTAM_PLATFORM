"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  isDeleting: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={isDeleting ? undefined : onClose} />
      <Card className="w-full max-w-md shadow-2xl relative z-10 border border-zinc-200 animate-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row justify-between items-center p-6 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <CardTitle className="text-lg font-bold text-zinc-900 leading-tight">{title}</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            disabled={isDeleting}
            className="rounded-full w-8 h-8 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 py-5">
          <p className="text-sm text-zinc-500 leading-relaxed font-normal">{message}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 p-6 pt-4 border-t border-zinc-100 bg-zinc-50/50 rounded-b-xl">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isDeleting}
            className="border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-xs"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
