"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page header with title + optional action button. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Stat tile for the dashboard. */
export function StatTile({
  label,
  value,
  icon: Icon,
  accent = "green",
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "green" | "blue" | "orange" | "pink";
}) {
  const accents = {
    green: "bg-prelli-green-50 text-prelli-green-600",
    blue: "bg-prelli-blue/10 text-prelli-blue-700",
    orange: "bg-prelli-orange-50 text-prelli-orange",
    pink: "bg-prelli-pink/10 text-prelli-pink",
  };
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-e1">
      <div className={cn("inline-flex rounded-md p-2.5", accents[accent])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-ink">{value}</p>
      <p className="text-sm text-slate">{label}</p>
    </div>
  );
}

/** Accessible modal dialog with body-scroll lock. */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={cn(
              "my-auto w-full rounded-lg bg-white shadow-e3",
              wide ? "max-w-2xl" : "max-w-lg",
            )}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate hover:bg-cloud"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Destructive-action button with an in-app animated confirm dialog (no browser confirm). */
export function ConfirmButton({
  onConfirm,
  children,
  message = "Are you sure? This action cannot be undone.",
  title = "Please confirm",
  confirmLabel = "Delete",
  className,
}: {
  onConfirm: () => void;
  children: ReactNode;
  message?: string;
  title?: string;
  confirmLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-e3"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="mx-auto mb-4 inline-flex rounded-pill bg-prelli-pink/10 p-3">
                <AlertTriangle className="h-6 w-6 text-prelli-pink" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{message}</p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] rounded-pill border border-line px-5 font-medium text-ink transition-colors hover:bg-cloud"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onConfirm();
                  }}
                  className="min-h-[44px] rounded-pill bg-prelli-pink px-5 font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Primary submit button with loading state for admin forms. */
export function SubmitButton({
  busy,
  children,
}: {
  busy?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pill bg-prelli-green px-6 font-semibold text-white transition-colors hover:bg-prelli-green-600 disabled:opacity-60"
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white p-10 text-center text-slate">
      {children}
    </div>
  );
}

export function LoadingRow() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-prelli-green" />
    </div>
  );
}
