"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, HandHeart, Loader2 } from "lucide-react";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { submitPledge } from "@/lib/submissions";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "done" | "error";
type Currency = "usd" | "ngn";

const presets: Record<Currency, { symbol: string; label: string; amounts: { value: number; display: string }[] }> = {
  usd: {
    symbol: "$",
    label: "US Dollar",
    amounts: [
      { value: 50, display: "$50" },
      { value: 200, display: "$200" },
      { value: 1000, display: "$1,000" },
    ],
  },
  ngn: {
    symbol: "₦",
    label: "Naira",
    amounts: [
      { value: 50000, display: "₦50k" },
      { value: 200000, display: "₦200k" },
      { value: 1000000, display: "₦1M" },
    ],
  },
};

export function PledgeForm() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [currency, setCurrency] = useState<Currency>("ngn");
  const [amount, setAmount] = useState<number | null>(50000);
  const [custom, setCustom] = useState("");

  const cfg = presets[currency];

  function pickCurrency(c: Currency) {
    setCurrency(c);
    setAmount(presets[c].amounts[0].value);
    setCustom("");
  }

  function pickPreset(v: number) {
    setAmount(v);
    setCustom("");
  }

  const effectiveAmount = custom ? `${cfg.symbol}${custom}` : amount ? `${cfg.symbol}${amount.toLocaleString()}` : "";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return; // honeypot

    setStatus("sending");
    try {
      await submitPledge({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        amount: `${effectiveAmount} (${cfg.label})`,
        message: String(fd.get("message") || ""),
      });
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-lg border border-prelli-green/30 bg-prelli-green-50 p-8 text-center"
      >
        <motion.div
          initial={reduce ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        >
          <CheckCircle2 className="mx-auto h-14 w-14 text-prelli-green-600" />
        </motion.div>
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">Thank you for your pledge!</h3>
        <p className="mt-2 text-slate">
          Our team will reach out to arrange your {effectiveAmount && <b>{effectiveAmount}</b>} gift personally.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px]" aria-hidden />

      {/* Currency tabs */}
      <div>
        <Label htmlFor="">Choose currency</Label>
        <div className="relative grid grid-cols-2 gap-1 rounded-pill border border-line bg-cloud p-1">
          {(["ngn", "usd"] as Currency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => pickCurrency(c)}
              className={cn(
                "relative z-10 min-h-[44px] rounded-pill text-sm font-semibold transition-colors",
                currency === c ? "text-white" : "text-slate hover:text-ink",
              )}
            >
              {currency === c && (
                <motion.span
                  layoutId="curr-pill"
                  className="absolute inset-0 -z-10 rounded-pill bg-prelli-green"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              {presets[c].symbol} {presets[c].label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset amounts */}
      <div>
        <Label htmlFor="">Select an amount</Label>
        <AnimatePresence mode="wait">
          <motion.div
            key={currency}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-3 gap-3"
          >
            {cfg.amounts.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => pickPreset(a.value)}
                className={cn(
                  "min-h-[56px] rounded-md border-2 font-display text-lg font-bold transition-all duration-200",
                  amount === a.value && !custom
                    ? "border-prelli-green bg-prelli-green-50 text-prelli-green-600 shadow-e1"
                    : "border-line bg-white text-ink hover:border-prelli-green/50 hover:-translate-y-0.5",
                )}
              >
                {a.display}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="mt-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate">
              {cfg.symbol}
            </span>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Or enter a custom amount"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value.replace(/[^0-9]/g, ""));
                setAmount(null);
              }}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-name">Your name</Label>
          <Input id="p-name" name="name" required maxLength={120} />
        </div>
        <div>
          <Label htmlFor="p-email">Email</Label>
          <Input id="p-email" name="email" type="email" required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="p-phone">Phone</Label>
          <Input id="p-phone" name="phone" type="tel" inputMode="tel" />
        </div>
      </div>
      <div>
        <Label htmlFor="p-message">Anything else? (optional)</Label>
        <Textarea id="p-message" name="message" maxLength={4000} className="min-h-[90px]" />
      </div>

      {status === "error" && <p className="text-sm text-prelli-pink">Something went wrong. Please try again.</p>}

      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full">
        {status === "sending" ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</>
        ) : (
          <><HandHeart className="h-5 w-5" /> Pledge {effectiveAmount || "your support"}</>
        )}
      </Button>
    </form>
  );
}
