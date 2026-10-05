import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownToLine, ArrowUpFromLine, Ban, Box, Eye, Footprints, Hand, HardHat, Layers, MoveDown,
  Package, Ruler, ScanSearch, ShieldAlert, Truck, Volume2, VolumeX, Weight, type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { speechLang } from "@/i18n";
import img01 from "@/assets/lift/01-avaliacao.jpg";
import img02 from "@/assets/lift/02-base.jpg";
import img03 from "@/assets/lift/03-agachamento.jpg";
import img04 from "@/assets/lift/04-carga-colada.jpg";
import img05 from "@/assets/lift/05-pegada.jpg";
import img06 from "@/assets/lift/06-impulso.jpg";
import img07 from "@/assets/lift/07-girar.jpg";
import img08 from "@/assets/lift/08-horizonte.jpg";
import img09 from "@/assets/lift/09-van.jpg";
import img10 from "@/assets/lift/10-borda.jpg";
import img11 from "@/assets/lift/11-altura.jpg";
import img12 from "@/assets/lift/12-alto.jpg";
import img13 from "@/assets/lift/13-descida.jpg";
import img14 from "@/assets/lift/14-desajeitado.jpg";
import img15 from "@/assets/lift/15-pes.jpg";
import img16 from "@/assets/lift/16-limite.jpg";

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

const images = [
  img01, img02, img03, img04, img05, img06, img07, img08,
  img09, img10, img11, img12, img13, img14, img15, img16,
];

function Lift() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState(0);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const tabs = t("lift.tabs", { returnObjects: true }) as string[];
  const tabsLong = t("lift.tabsLong", { returnObjects: true }) as string[];
  const tips = t("lift.tips", { returnObjects: true }) as { t: string; d: string }[];
  const slice = tips.slice(tab * 6, tab * 6 + 6);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const toggleSpeak = (n: number, tip: { t: string; d: string }) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speaking === n) {
      synth.cancel();
      setSpeaking(null);
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(`${tip.t}. ${tip.d}`);
    u.lang = speechLang(i18n.language);
    u.onend = () => setSpeaking((s) => (s === n ? null : s));
    u.onerror = () => setSpeaking((s) => (s === n ? null : s));
    setSpeaking(n);
    synth.speak(u);
  };

  return (
    <AppShell title={t("lift.title")} subtitle={t("lift.subtitle")} icon={HardHat} tone="amber">
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 animate-rise sm:mx-0 sm:px-0">
        {tabs.map((label, i) => (
          <button
            key={label}
            onClick={() => { window.speechSynthesis?.cancel(); setSpeaking(null); setTab(i); }}
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
          const isSpeaking = speaking === n;
          return (
            <article
              key={tip.t}
              style={{ animationDelay: `${i * 50}ms` }}
              className="glass overflow-hidden rounded-3xl animate-rise"
            >
              <div className="relative">
                <img
                  src={images[n]}
                  alt={tip.t}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-[4/3] w-full object-cover"
                />
                <span
                  className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs font-bold backdrop-blur ${
                    danger ? "bg-destructive/80 text-white" : "bg-background/70 text-amber"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {String(n + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold leading-tight">{tip.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tip.d}</p>
                <button
                  onClick={() => toggleSpeak(n, tip)}
                  className={`tap mt-3 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isSpeaking ? "bg-amber text-primary-foreground" : "bg-secondary/70 text-amber"
                  }`}
                >
                  {isSpeaking ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  {isSpeaking ? t("lift.stop") : t("lift.listen")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
