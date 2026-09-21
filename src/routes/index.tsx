import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Apple, ChevronRight, HeartHandshake, Pencil, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { NamePrompt } from "@/components/NamePrompt";
import { useDriverName } from "@/hooks/useDriverName";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DriverPulse — Saúde física e mental para motoristas de van" },
      {
        name: "description",
        content:
          "Apoio emocional com IA, alongamentos rápidos e nutrição prática para motoristas e entregadores de van.",
      },
      { property: "og:title", content: "DriverPulse — Saúde na rota" },
      {
        property: "og:description",
        content: "Apoio emocional, alongamentos com cronômetro e nutrição prática para quem vive na estrada.",
      },
    ],
  }),
  component: Index,
});

function getGreeting(h: number) {
  if (h < 5) return { hi: "Boa madrugada", msg: "Rota noturna exige atenção dobrada. Você está indo bem." };
  if (h < 12) return { hi: "Bom dia", msg: "Respira fundo. Cada entrega é um passo. Bora com calma." };
  if (h < 18) return { hi: "Boa tarde", msg: "Metade do caminho feito. Hidrate-se e ajuste a postura." };
  return { hi: "Boa noite", msg: "Você aguentou o dia inteiro. Hora de cuidar de você." };
}

const cards = [
  {
    to: "/apoio",
    title: "Como Você Está Hoje?",
    desc: "Apoio & desabafo com IA empática",
    icon: HeartHandshake,
    tone: "neon",
    iconCls: "bg-neon/10 text-neon shadow-neon",
    glow: { "--glow-from": "var(--neon)", "--glow-to": "var(--electric)" },
  },
  {
    to: "/alongamento",
    title: "Alongamento e Mobilidade",
    desc: "Corpo & alívio em 3 a 5 minutos",
    icon: Activity,
    tone: "electric",
    iconCls: "bg-electric/15 text-electric shadow-electric",
    glow: { "--glow-from": "var(--electric)", "--glow-to": "var(--neon)" },
  },
  {
    to: "/nutricao",
    title: "Nutrição na Rota",
    desc: "Lanches, marmitas & sugestões IA",
    icon: Apple,
    tone: "mint",
    iconCls: "bg-mint/10 text-mint shadow-mint",
    glow: { "--glow-from": "var(--mint)", "--glow-to": "var(--neon)" },
  },
] as const;

function Index() {
  const [hour, setHour] = useState(9);
  const [time, setTime] = useState("");
  const { name } = useDriverName();
  const [editName, setEditName] = useState(false);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setHour(d.getHours());
      setTime(d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  const g = getGreeting(hour);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 pb-10 pt-5 sm:px-6">
      <NamePrompt forceOpen={editName} onClose={() => setEditName(false)} />
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-80" />

      <header className="relative z-10 flex items-center justify-between animate-rise">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-neon/10 text-neon shadow-neon">
            <Zap className="size-6" fill="currentColor" />
          </div>
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">
              Driver<span className="text-neon text-glow">Pulse</span>
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Saúde na rota</p>
          </div>
        </div>
        <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
          <span className="size-2 rounded-full bg-mint animate-pulse-dot" />
          <span className="text-mint">Online</span>
          {time && <span className="text-muted-foreground">· {time}</span>}
        </div>
      </header>

      <section className="relative z-10 mt-10 animate-rise [animation-delay:80ms]">
        <p className="text-sm font-medium text-muted-foreground">{g.hi}, motorista 👋</p>
        <h1 className="mt-1 text-3xl font-bold leading-tight sm:text-4xl">{g.msg}</h1>
      </section>

      <section className="relative z-10 mt-8 flex flex-col gap-4">
        {cards.map((c, i) => (
          <Link
            key={c.to}
            to={c.to}
            style={{ ...c.glow, animationDelay: `${160 + i * 90}ms` } as React.CSSProperties}
            className="glass neon-border tap group flex items-center gap-4 rounded-3xl p-5 animate-rise hover:brightness-110 active:brightness-125"
          >
            <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${c.iconCls} transition-transform group-active:scale-90`}>
              <c.icon className="size-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold leading-tight sm:text-xl">{c.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </div>
            <ChevronRight className="size-6 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </section>

      <footer className="relative z-10 mt-auto pt-10 text-center text-xs text-muted-foreground">
        Feito para quem carrega o dia nas costas. Dirija com segurança.
      </footer>
    </div>
  );
}
