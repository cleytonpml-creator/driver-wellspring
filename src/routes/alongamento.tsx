import { createFileRoute } from "@tanstack/react-router";
import { Activity, Armchair, CheckCircle2, Dumbbell, Footprints, Pause, Play, RotateCcw, Timer, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useTranslation } from "react-i18next";
import { speechLang } from "@/i18n";
import imgPelvica from "@/assets/ex/pelvica.jpg";
import imgTorcao from "@/assets/ex/torcao.jpg";
import imgGatoVaca from "@/assets/ex/gatovaca.jpg";
import imgFlexao from "@/assets/ex/flexao.jpg";
import imgPeito from "@/assets/ex/peito.jpg";
import imgRotacao from "@/assets/ex/rotacao.jpg";
import imgTrapezio from "@/assets/ex/trapezio.jpg";
import imgCruzado from "@/assets/ex/cruzado.jpg";
import imgTriceps from "@/assets/ex/triceps.jpg";
import imgPunhos from "@/assets/ex/punhos.jpg";
import imgQuadriceps from "@/assets/ex/quadriceps.jpg";
import imgPanturrilha from "@/assets/ex/panturrilha.jpg";
import imgPosterior from "@/assets/ex/posterior.jpg";
import imgAgachamento from "@/assets/ex/agachamento.jpg";
import imgElevacao from "@/assets/ex/elevacao.jpg";
import imgBalanco from "@/assets/ex/balanco.jpg";

export const Route = createFileRoute("/alongamento")({
  head: () => ({
    meta: [
      { title: "Alongamento e Mobilidade — DriverPulse" },
      { name: "description", content: "Rotinas de 3 a 5 minutos para lombar, ombros e pernas, com ilustrações e cronômetro integrado." },
      { property: "og:title", content: "Alongamento e Mobilidade — DriverPulse" },
      { property: "og:description", content: "Alívio rápido para o corpo de quem dirige e carrega o dia todo." },
    ],
  }),
  component: Alongamento,
});

type Ex = { id: string; secs: number; img: string };
type Cat = { id: string; icon: LucideIcon; total: string; exs: Ex[] };

const cats: Cat[] = [
  {
    id: "lombar",
    icon: Armchair,
    total: "4 min",
    exs: [
      { id: "pelvica", secs: 45, img: imgPelvica },
      { id: "torcao", secs: 40, img: imgTorcao },
      { id: "gatovaca", secs: 45, img: imgGatoVaca },
      { id: "flexao", secs: 40, img: imgFlexao },
      { id: "peito", secs: 30, img: imgPeito },
    ],
  },
  {
    id: "ombros",
    icon: Dumbbell,
    total: "3 min",
    exs: [
      { id: "rotacao", secs: 30, img: imgRotacao },
      { id: "trapezio", secs: 40, img: imgTrapezio },
      { id: "cruzado", secs: 40, img: imgCruzado },
      { id: "triceps", secs: 40, img: imgTriceps },
      { id: "punhos", secs: 30, img: imgPunhos },
    ],
  },
  {
    id: "pernas",
    icon: Footprints,
    total: "5 min",
    exs: [
      { id: "quadriceps", secs: 50, img: imgQuadriceps },
      { id: "panturrilha", secs: 50, img: imgPanturrilha },
      { id: "posterior", secs: 50, img: imgPosterior },
      { id: "agachamento", secs: 40, img: imgAgachamento },
      { id: "elevacao", secs: 40, img: imgElevacao },
      { id: "balanco", secs: 40, img: imgBalanco },
    ],
  },
];

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function speak(text: string, lang = "pt-BR") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 1;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith(lang.slice(0, 2)));
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

function beep(freq = 880, dur = 0.25) {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
  osc.onended = () => ctx.close();
}

function ExerciseCard({ ex, index, done, onDone }: { ex: Ex; index: number; done: boolean; onDone: () => void }) {
  const { t, i18n } = useTranslation();
  const lang = speechLang(i18n.language);
  const name = t(`stretch.ex.${ex.id}.name`);
  const steps = t(`stretch.ex.${ex.id}.steps`, { returnObjects: true }) as string[];
  const [left, setLeft] = useState(ex.secs);
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      beep(880, 0.3);
      setTimeout(() => beep(1320, 0.35), 250);
      speak(t("stretch.vDone"), lang);
      onDone();
      return;
    }
    if (left === 10) speak(t("stretch.vLast"), lang);
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [running, left, onDone, t, lang]);

  const toggle = () => {
    if (left === 0) setLeft(ex.secs);
    setRunning((v) => {
      if (!v) speak(`${name}. ${steps.join(". ")}. ${t("stretch.vStart")}`, lang);
      else window.speechSynthesis?.cancel();
      return !v;
    });
  };

  const pct = ((ex.secs - left) / ex.secs) * 100;
  const r = 30;
  const c = 2 * Math.PI * r;

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className={`glass flex flex-col overflow-hidden rounded-3xl animate-rise transition-all ${running ? "neon-border shadow-electric" : ""} ${done ? "opacity-80" : ""}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <img
          src={ex.img}
          alt={t("stretch.alt", { name })}
          loading="lazy"
          width={816}
          height={816}
          className="size-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-background/70 px-3 py-1 text-xs font-bold text-neon backdrop-blur">
          {t("stretch.hold", { s: ex.secs })}
        </span>
        {done && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-mint/15 px-3 py-1 text-xs font-bold text-mint backdrop-blur">
            <CheckCircle2 className="size-4" /> {t("stretch.done")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 p-4">
        <div className="relative flex size-[68px] shrink-0 items-center justify-center">
          <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90">
            <circle cx="38" cy="38" r={r} className="fill-none stroke-secondary" strokeWidth="5" />
            <circle
              cx="38" cy="38" r={r}
              className={`fill-none transition-[stroke-dashoffset] duration-1000 ease-linear ${done ? "stroke-mint" : "stroke-electric"}`}
              strokeWidth="5" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
            />
          </svg>
          <span className={`font-display text-lg font-bold tabular-nums ${running ? "text-electric" : "text-muted-foreground"}`}>
            {fmt(left)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-tight">{name}</h3>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-1 text-xs font-semibold text-neon"
          >
            {open ? t("stretch.hide") : t("stretch.show")}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggle}
            aria-label={running ? t("stretch.pause") : t("stretch.start")}
            className={`tap flex size-14 items-center justify-center rounded-2xl ${running ? "bg-secondary text-foreground" : "bg-electric text-accent-foreground shadow-electric"}`}
          >
            {running ? <Pause className="size-6" /> : <Play className="size-6 translate-x-0.5" fill="currentColor" />}
          </button>
          <button
            onClick={() => { setRunning(false); setLeft(ex.secs); window.speechSynthesis?.cancel(); }}
            aria-label={t("stretch.reset")}
            className="tap flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground"
          >
            <RotateCcw className="size-5" />
          </button>
        </div>
      </div>

      {(open || running) && (
        <ol className="space-y-2 border-t border-border px-4 pb-4 pt-3 animate-rise">
          {steps.map((s, i) => (
            <li key={s} className="flex items-start gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-electric/15 text-xs font-bold text-electric">{i + 1}</span>
              <span className="text-foreground/90">{s}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Alongamento() {
  const { t } = useTranslation();
  const [catId, setCatId] = useState("lombar");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const cat = cats.find((c) => c.id === catId) ?? cats[0]!;
  const doneCount = cat.exs.filter((e) => done[`${cat.id}-${e.id}`]).length;

  return (
    <AppShell title={t("stretch.title")} subtitle={t("stretch.subtitle")} icon={Activity} tone="electric">
      <div className="grid grid-cols-3 gap-2 animate-rise">
        {cats.map((c) => {
          const active = c.id === catId;
          return (
            <button
              key={c.id}
              onClick={() => setCatId(c.id)}
              className={`tap flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-center transition-all ${
                active ? "neon-border glass text-electric shadow-electric" : "bg-secondary/60 text-muted-foreground"
              }`}
            >
              <c.icon className="size-6" />
              <span className="text-xs font-bold leading-tight">{t(`stretch.cats.${c.id}.short`)}</span>
              <span className="text-[10px] opacity-70">{c.total}</span>
            </button>
          );
        })}
      </div>

      <div key={cat.id} className="mt-5 flex items-end justify-between animate-rise">
        <div>
          <h2 className="text-xl font-bold">{t(`stretch.cats.${cat.id}.label`)}</h2>
          <p className="text-sm text-muted-foreground">{t("stretch.count", { n: cat.exs.length })}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-mint/10 px-3 py-1 text-xs font-bold text-mint">
          <Timer className="size-3.5" /> {doneCount}/{cat.exs.length}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cat.exs.map((ex, i) => {
          const key = `${cat.id}-${ex.id}`;
          return (
            <ExerciseCard
              key={key}
              ex={ex}
              index={i}
              done={!!done[key]}
              onDone={() => setDone((d) => ({ ...d, [key]: true }))}
            />
          );
        })}
      </div>
    </AppShell>
  );
}
