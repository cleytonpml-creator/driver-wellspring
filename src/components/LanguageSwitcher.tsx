import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown } from "lucide-react";
import { LANGS, LANG_KEY, LANG_COOKIE } from "@/i18n";

/** Persists language changes to localStorage + cookie (cookie lets SSR render the same language). */
export function LanguageSync() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const onChange = (lng: string) => {
      localStorage.setItem(LANG_KEY, lng);
      document.cookie = `${LANG_COOKIE}=${lng}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = lng === "pt" ? "pt-BR" : lng;
    };
    i18n.on("languageChanged", onChange);
    return () => i18n.off("languageChanged", onChange);
  }, [i18n]);
  return null;
}

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === i18n.language) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("common.language")}
        aria-expanded={open}
        className="tap flex h-11 items-center gap-1 rounded-xl bg-secondary px-2.5 text-xl"
      >
        <span>{current.flag}</span>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="glass absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl p-1 animate-rise">
          {LANGS.map((l) => {
            const active = l.code === current.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  void i18n.changeLanguage(l.code);
                  setOpen(false);
                }}
                className={`tap flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
                  active ? "bg-neon/10 text-neon" : "text-foreground hover:bg-secondary"
                }`}
              >
                <span className="text-xl">{l.flag}</span>
                <span className="flex-1">{l.label}</span>
                {active && <Check className="size-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
