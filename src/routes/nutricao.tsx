import { createFileRoute } from "@tanstack/react-router";
import { Apple, Bot, CalendarDays, Cookie, Droplets, MapPin, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export const Route = createFileRoute("/nutricao")({
  head: () => ({
    meta: [
      { title: "Nutrição na Rota — DriverPulse" },
      { name: "description", content: "Lanches de cabine, plano semanal de marmitas e sugestões de refeição por IA para entregadores." },
      { property: "og:title", content: "Nutrição na Rota — DriverPulse" },
      { property: "og:description", content: "Comer bem mesmo com a van em movimento." },
    ],
  }),
  component: Nutricao,
});

const tabs = [
  { id: "lanches", icon: Cookie },
  { id: "marmitas", icon: CalendarDays },
  { id: "ia", icon: Bot },
] as const;
type Tab = (typeof tabs)[number]["id"];

const emojis = ["🥜", "🍌", "🥕", "🍎", "🥚", "🌾", "🧀"];
const kcals = [520, 560, 480, 500, 540, 580, 0];
type Result = { title: string; items: string[]; hydration: string };

function suggest(input: string): Result {
  const t = input.toLowerCase();
  let k = "default";
  if (/(posto|estrada|rodovia|gas|highway|gasolinera|carretera|autopista)/.test(t)) k = "posto";
  else if (/(padaria|café|cafe|bakery|panader)/.test(t)) k = "padaria";
  else if (/(lanchonete|fast|hamb|burger|r[aá]pida)/.test(t)) k = "lanchonete";
  else if (/(arroz|rice|frango|chicken|pollo|ovo|egg|huevo|feij|bean|pão|pao|bread|pan|banana|pl[aá]tano|fruta|fruit|marmita)/.test(t)) k = "maos";
  return i18n.t(`nutri.r.${k}`, { returnObjects: true, input }) as Result;
}

function Nutricao() {
  const { t } = useTranslation();
  const tabLabels = t("nutri.tabs", { returnObjects: true }) as string[];
  const snacks = (t("nutri.snacks", { returnObjects: true }) as { name: string; tip: string; tag: string }[]).map((s, i) => ({ ...s, emoji: emojis[i] }));
  const week = (t("nutri.week", { returnObjects: true }) as { day: string; dish: string; prep: string }[]).map((w, i) => ({ ...w, kcal: kcals[i]! }));
  const chips = t("nutri.chips", { returnObjects: true }) as string[];
  const [tab, setTab] = useState<Tab>("lanches");
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const ask = (value: string) => {
    if (!value.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(suggest(value));
      setLoading(false);
    }, 900);
  };

  return (
    <AppShell title={t("nutri.title")} subtitle={t("nutri.subtitle")} icon={Apple} tone="mint">
      <div className="glass grid grid-cols-3 gap-1 rounded-2xl p-1 animate-rise">
        {tabs.map((tb, ti) => {
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`tap flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                active ? "bg-mint text-primary-foreground shadow-mint" : "text-muted-foreground"
              }`}
            >
              <tb.icon className="size-4" />
              {tabLabels[ti]}
            </button>
          );
        })}
      </div>

      {tab === "lanches" && (
        <div key="l" className="mt-5 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground animate-rise">{t("nutri.snacksIntro")}</p>
          {snacks.map((s, i) => (
            <div key={s.name} style={{ animationDelay: `${i * 50}ms` }} className="glass flex items-center gap-4 rounded-3xl p-4 animate-rise">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-mint/10 text-3xl">{s.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{s.name}</h3>
                  <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mint">{s.tag}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.tip}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "marmitas" && (
        <div key="m" className="mt-5 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground animate-rise">{t("nutri.weekIntro")}</p>
          {week.map((w, i) => (
            <div key={w.day} style={{ animationDelay: `${i * 50}ms` }} className={`glass flex items-center gap-4 rounded-3xl p-4 animate-rise ${w.kcal === 0 ? "neon-border [--glow-from:var(--mint)] [--glow-to:var(--neon)]" : ""}`}>
              <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-secondary font-display">
                <span className="text-sm font-extrabold text-mint">{w.day}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold leading-tight">{w.dish}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.prep}</p>
              </div>
              {w.kcal > 0 && <span className="shrink-0 text-xs font-bold text-muted-foreground">~{w.kcal} kcal</span>}
            </div>
          ))}
        </div>
      )}

      {tab === "ia" && (
        <div key="i" className="mt-5 flex flex-col gap-4">
          <div className="glass neon-border rounded-3xl p-5 animate-rise [--glow-from:var(--mint)] [--glow-to:var(--neon)]">
            <div className="flex items-center gap-2 text-mint">
              <Sparkles className="size-5" />
              <h2 className="font-bold">{t("nutri.iaTitle")}</h2>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); ask(q); }}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-background/60 p-2"
            >
              <MapPin className="ml-2 size-5 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("nutri.placeholder")}
                className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" aria-label={t("nutri.ask")} disabled={!q.trim()} className="tap flex size-11 shrink-0 items-center justify-center rounded-xl bg-mint text-primary-foreground shadow-mint disabled:opacity-40">
                <Send className="size-5" />
              </button>
            </form>
            <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
              {chips.map((s) => (
                <button key={s} onClick={() => { setQ(s); ask(s); }} className="tap shrink-0 rounded-full border border-mint/30 px-3 py-1.5 text-xs font-semibold text-mint">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-rise">
              <span className="flex gap-1">
                <span className="size-2 animate-bounce rounded-full bg-mint" />
                <span className="size-2 animate-bounce rounded-full bg-mint [animation-delay:120ms]" />
                <span className="size-2 animate-bounce rounded-full bg-mint [animation-delay:240ms]" />
              </span>
              {t("nutri.analyzing")}
            </div>
          )}

          {result && (
            <div className="glass rounded-3xl p-5 animate-rise">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-mint/15 text-mint"><Bot className="size-5" /></div>
                <h3 className="font-bold">{result.title}</h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {result.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-mint" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-electric/10 p-3 text-sm">
                <Droplets className="mt-0.5 size-5 shrink-0 text-electric" />
                <p><span className="font-bold text-electric">{t("nutri.hydration")}</span>{result.hydration}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
