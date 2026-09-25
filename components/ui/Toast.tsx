"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  title: string;
  description?: string;
  dismissLabel: string;
  onClose: () => void;
  /** Auto-dismiss delay in ms. */
  duration?: number;
}

export function Toast({
  open,
  title,
  description,
  dismissLabel,
  onClose,
  duration = 4500,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(id);
  }, [open, duration, onClose]);

  return (
    // The live region stays mounted so screen readers reliably announce new content.
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-white/10 bg-[#111114]/95 p-4 shadow-[0_20px_50px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl"
          >
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-accent-green" aria-hidden />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{title}</p>
              {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={dismissLabel}
              className="rounded-md p-1 text-zinc-500 transition-colors hover:text-white"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
