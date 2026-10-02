import { createFileRoute } from "@tanstack/react-router";
import { Armchair, Footprints, Pause, Play, RotateCcw, User, Wind, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/casa-relaxar")({
  head: () => ({
    meta: [
      { title: "Exercícios de Relaxamento — DriverPulse" },
      { name: "description", content: "Respiração quadrada guiada e alongamentos pós-expediente para lombar, pernas, pescoço e ciático." },
      { property: "og:title", content: "Exercícios de Relaxamento — DriverPulse" },
      { property: "og:description", content: "Solte o corpo depois de um dia na van." },
    ],
  }),
  component: Relax,
});

const PHASE_S = 4;
const postIcons: LucideIcon[] = [Armchair, Footprints, User, Wind];

function BoxBreathing() {
  const { t } = useTranslation();
  const phases = t("casa.breath.phases", { returnObjects: true }) as string[];
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [left, setLeft] = useState(PHASE_S);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      if (left > 1) return setLeft((l) => l - 1);
      setLeft(PHASE_S);
      setPhase((p) => {
        const next = (p + 1) % 4;
        if (next === 0) setCycles((c) => c + 1);
        return next;
      });
    }, 1000);
    return () => clearTimeout(id);
  }, [running, left]);

  // inhale grows, hold stays big, exhale shrinks, hold stays small
  const big = running && (phase === 0 || phase === 1);
  const reset = () => { setRunning(false); setPhase(0); setLeft(PHASE_S); setCycles(0); };

  return (
    <section className="glass neon-border rounded-3xl p-5 animate-rise [--glow-from:var(--mint)] [--glow-to:var(--neon)]">
      <h2 className="text-lg font-bold">{t("casa.breath.title")}</h2>
      <p className="text-sm text-muted-foreground">{t("casa.breath.desc")}</p>

      <div className="relative mx-auto my-6 flex size-60 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-mint/25" />
        <div
          className="absolute rounded-full bg-mint/20 shadow-mint ease-in-out"
          style={{
            width: "100%", height: "100%",
            transform: `scale(${big ? 1 : 0.5})`,
            transition: `transform ${running ? PHASE_S : 0.4}s ease-in-out`,
          }}
        />
        <div className="relative text-center">
          <p className="font-display text-2xl font-bold text-mint">{running ? phases[phase] : t("casa.breath.ready")}</p>
          {running && <p className="font-display text-5xl font-extrabold tabular-nums">{left}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className={`tap flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold ${running ? "bg-secondary" : "bg-mint text-primary-foreground shadow-mint"}`}
        >
          {running ? <Pause className="size-5" /> : <Play className="size-5" fill="currentColor" />}
          {running ? t("casa.breath.pause") : t("casa.breath.start")}
        </button>
        <button onClick={reset} aria-label={t("casa.breath.reset")} className="tap flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
          <RotateCcw className="size-5" />
        </button>
        <span className="rounded-full bg-mint/10 px-3 py-2 text-sm font-bold text-mint">{t("casa.breath.cycles", { n: cycles })}</span>
      </div>
    </section>
  );
}

function Relax() {
  const { t } = useTranslation();
  const post = t("casa.post", { returnObjects: true }) as { name: string; pose: string; dur: string; d: string }[];
  return (
    <AppShell title={t("casa.relax.title")} subtitle={t("casa.subtitle")} icon={Wind} tone="mint" backTo="/casa">
      <BoxBreathing />
      <h2 className="mt-7 text-xl font-bold">{t("casa.postTitle")}</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {post.map((p, i) => {
          const Icon = postIcons[i]!;
          return (
            <article key={p.name} style={{ animationDelay: `${i * 60}ms` }} className="glass flex gap-4 rounded-3xl p-4 animate-rise">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                <Icon className="size-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold leading-tight">{p.name}</h3>
                  <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mint">{p.dur}</span>
                </div>
                <p className="text-xs font-semibold text-neon">{p.pose}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
