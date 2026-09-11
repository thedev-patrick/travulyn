"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
  isSupportedCurrency,
  type CurrencyCode,
} from "@/lib/currency";

function readCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): CurrencyCode {
  const stored = readCookie(CURRENCY_COOKIE);
  return isSupportedCurrency(stored) ? stored : DEFAULT_CURRENCY;
}

function getServerSnapshot(): CurrencyCode {
  return DEFAULT_CURRENCY;
}

export function CurrencySwitcher() {
  const router = useRouter();
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function handleChange(value: string | null) {
    if (!isSupportedCurrency(value)) return;
    document.cookie = `${CURRENCY_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    listeners.forEach((cb) => cb());
    router.refresh();
  }

  return (
    <Select value={currency} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="w-[4.5rem]" aria-label="Display currency">
        <SelectValue>{(value: string) => value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_CURRENCIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.code} — {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
