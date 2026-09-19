import { createFileRoute } from "@tanstack/react-router";
import { Activity, Armchair, CheckCircle2, Dumbbell, Footprints, Pause, Play, RotateCcw, Timer, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/alongamento")({
  head: () => ({
    meta: [
      { title: "Alongamento e Mobilidade — DriverPulse" },
      { name: "description", content: "Rotinas de 3 a 5 minutos para lombar, ombros e pernas, com cronômetro integrado." },
      { property: "og:title", content: "Alongamento e Mobilidade — DriverPulse" },
      { property: "og:description", content: "Alívio rápido para o corpo de quem dirige e carrega o dia todo." },
    ],
  }),
  component: Alongamento,
});

type Ex = { name: string; secs: number; steps: string[]; emoji: string };
type Cat = { id: string; label: string; short: string; icon: LucideIcon; total: string; exs: Ex[] };

const cats: Cat[] = [
  {
    id: "lombar",
    label: "Lombar e Postura",
    short: "Lombar",
    icon: Armchair,
    total: "4 min",
    exs: [
      { name: "Inclinação pélvica sentado", secs: 45, emoji: "🪑", steps: ["Sente ereto, pés no chão", "Arqueie e arredonde a lombar devagar", "Respire fundo a cada movimento"] },
      { name: "Torção de tronco", secs: 40, emoji: "🔄", steps: ["Mão no encosto do banco", "Gire o tronco para o lado", "Troque de lado na metade"] },
      { name: "Gato-vaca em pé", secs: 45, emoji: "🐈", steps: ["Mãos apoiadas na van", "Arqueie as costas, olhe para cima", "Arredonde, queixo no peito"] },
      { name: "Flexão à frente", secs: 40, emoji: "🙇", steps: ["Pés na largura do quadril", "Solte o tronco para baixo", "Deixe a cabeça pesada e relaxe"] },
      { name: "Abertura de peito", secs: 30, emoji: "🌅", steps: ["Mãos entrelaçadas atrás", "Abra o peito e olhe à frente", "Ombros para trás e para baixo"] },
    ],
  },
  {
    id: "ombros",
    label: "Ombros, Braços e Trapézio",
    short: "Ombros",
    icon: Dumbbell,
    total: "3 min",
    exs: [
      { name: "Rotação de ombros", secs: 30, emoji: "🌀", steps: ["Circule os ombros para trás", "Movimentos grandes e lentos", "Inverta o sentido na metade"] },
      { name: "Alongamento de trapézio", secs: 40, emoji: "🧘", steps: ["Incline a cabeça para o lado", "Mão puxando levemente", "Troque de lado em 20s"] },
      { name: "Cruzado de braço", secs: 40, emoji: "🤗", steps: ["Braço cruzado no peito", "Puxe com o outro braço", "Troque de lado em 20s"] },
      { name: "Tríceps acima da cabeça", secs: 40, emoji: "💪", steps: ["Cotovelo apontando para cima", "Mão desce pelas costas", "Troque de lado em 20s"] },
      { name: "Chacoalhar mãos e punhos", secs: 30, emoji: "👋", steps: ["Solte punhos e dedos", "Abra e feche as mãos", "Alivia o aperto no volante"] },
    ],
  },
  {
    id: "pernas",
    label: "Pernas e Joelhos",
    short: "Pernas",
    icon: Footprints,
    total: "5 min",
    exs: [
      { name: "Quadríceps em pé", secs: 50, emoji: "🦵", steps: ["Apoie na van", "Puxe o calcanhar até o glúteo", "Troque de lado em 25s"] },
      { name: "Panturrilha na parede", secs: 50, emoji: "🧱", steps: ["Perna de trás esticada", "Calcanhar no chão", "Troque de lado em 25s"] },
      { name: "Posterior de coxa", secs: 50, emoji: "📐", steps: ["Pé no estribo da van", "Tronco inclinado à frente", "Troque de lado em 25s"] },
      { name: "Agachamento leve", secs: 40, emoji: "⬇️", steps: ["Pés afastados", "Desça devagar até onde der", "Joelhos alinhados aos pés"] },
      { name: "Elevação de panturrilha", secs: 40, emoji: "⬆️", steps: ["Suba nas pontas dos pés", "Segure 2 segundos", "Desça controlado"] },
      { name: "Balanço de perna", secs: 40, emoji: "🦿", steps: ["Segure na porta", "Balance a perna à frente e atrás", "Troque de lado em 20s"] },
    ],
  },
];

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function ExerciseCard({ ex, index, done, onDone }: { ex: Ex; index: number; done: boolean; onDone: () => void }) {
  const [left, setLeft] = useState(ex.secs);
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      onDone();
      return;
    }
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [running, left, onDone]);

  const pct = ((ex.secs - left) / ex.secs) * 100;
  const r = 30;
  const c = 2 * Math.PI * r;

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className={`glass rounded-3xl p-4 animate-rise transition-all ${running ? "neon-border shadow-electric" : ""} ${done ? "opacity-70" : ""}`}
    >
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-4 text-left">
        <div className="relative flex size-[76px] shrink-0 items-center justify-center">
          <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90">
            <circle cx="38" cy="38" r={r} className="fill-none stroke-secondary" strokeWidth="5" />
            <circle
              cx="38" cy="38" r={r}
              className={`fill-none transition-[stroke-dashoffset] duration-1000 ease-linear ${done ? "stroke-mint" : "stroke-electric"}`}
              strokeWidth="5" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
            />
          </svg>
          <span className="text-2xl">{done ? <CheckCircle2 className="size-8 text-mint" /> : ex.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-tight">{ex.name}</h3>
          <p className={`mt-1 font-display text-2xl font-bold tabular-nums ${running ? "text-electric" : "text-muted-foreground"}`}>
            {fmt(left)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); if (left === 0) setLeft(ex.secs); setRunning((v) => !v); }}
            aria-label={running ? "Pausar" : "Iniciar"}
            className={`tap flex size-14 items-center justify-center rounded-2xl ${running ? "bg-secondary text-foreground" : "bg-electric text-accent-foreground shadow-electric"}`}
          >
            {running ? <Pause className="size-6" /> : <Play className="size-6 translate-x-0.5" fill="currentColor" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setRunning(false); setLeft(ex.secs); }}
            aria-label="Reiniciar"
            className="tap flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground"
          >
            <RotateCcw className="size-5" />
          </button>
        </div>
      </button>
      {(open || running) && (
        <ol className="mt-4 space-y-2 border-t border-border pt-3 animate-rise">
          {ex.steps.map((s, i) => (
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
  const [catId, setCatId] = useState(cats[0].id);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const cat = cats.find((c) => c.id === catId)!;
  const doneCount = cat.exs.filter((e) => done[`${cat.id}-${e.name}`]).length;

  return (
    <AppShell title="Alongamento e Mobilidade" subtitle="Rotinas rápidas · 3 a 5 min" icon={Activity} tone="electric">
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
              <span className="text-xs font-bold leading-tight">{c.short}</span>
              <span className="text-[10px] opacity-70">{c.total}</span>
            </button>
          );
        })}
      </div>

      <div key={cat.id} className="mt-5 flex items-end justify-between animate-rise">
        <div>
          <h2 className="text-xl font-bold">{cat.label}</h2>
          <p className="text-sm text-muted-foreground">{cat.exs.length} exercícios · toque para ver o passo a passo</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-mint/10 px-3 py-1 text-xs font-bold text-mint">
          <Timer className="size-3.5" /> {doneCount}/{cat.exs.length}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {cat.exs.map((ex, i) => {
          const key = `${cat.id}-${ex.name}`;
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
