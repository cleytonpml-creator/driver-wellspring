import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownToLine, ArrowUpFromLine, Ban, Box, Eye, Footprints, Hand, HardHat, Layers, MoveDown,
  Package, Ruler, ScanSearch, ShieldAlert, Truck, Weight, type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/levantar-caixas")({
  head: () => ({
    meta: [
      { title: "Como Levantar Caixas Pesadas — DriverPulse" },
      { name: "description", content: "16 técnicas ergonômicas para erguer, carregar e descarregar caixas da van sem machucar a coluna." },
      { property: "og:title", content: "Como Levantar Caixas Pesadas — DriverPulse" },
      { property: "og:description", content: "Guia rápido de ergonomia para entregadores de van." },
    ],
  }),
  component: Lift,
});

const icons: LucideIcon[] = [
  ScanSearch, Footprints, MoveDown, Package, Hand, ArrowUpFromLine,
  Ban, Eye, Truck, Layers, Ruler, ShieldAlert,
  ArrowDownToLine, Box, HardHat, Weight,
];

function Lift() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const tabs = t("lift.tabs", { returnObjects: true }) as string[];
  const tabsLong = t("lift.tabsLong", { returnObjects: true }) as string[];
  const tips = t("lift.tips", { returnObjects: true }) as { t: string; d: string }[];
  const slice = tips.slice(tab * 6, tab * 6 + 6);

  return (
    <AppShell title={t("lift.title")} subtitle={t("lift.subtitle")} icon={HardHat} tone="amber">
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 animate-rise sm:mx-0 sm:px-0">
        {tabs.map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(i)}
            className={`tap shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
              tab === i ? "bg-amber text-primary-foreground" : "bg-secondary/70 text-muted-foreground"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <p key={`h${tab}`} className="mt-4 text-sm text-muted-foreground animate-rise">{tabsLong[tab]}</p>

      <div key={tab} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {slice.map((tip, i) => {
          const n = tab * 6 + i;
          const Icon = icons[n]!;
          const danger = n === 6 || n === 15;
          return (
            <article
              key={tip.t}
              style={{ animationDelay: `${i * 50}ms` }}
              className="glass flex gap-4 rounded-3xl p-4 animate-rise"
            >
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div className={`flex size-12 items-center justify-center rounded-2xl ${danger ? "bg-destructive/15 text-destructive" : "bg-amber/15 text-amber"}`}>
                  <Icon className="size-6" />
                </div>
                <span className="font-display text-xs font-bold text-muted-foreground">{String(n + 1).padStart(2, "0")}</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold leading-tight">{tip.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tip.d}</p>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
