import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Apple, ChevronRight, HardHat, HeartHandshake, Home, Pencil, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
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

function greetKey(h: number) {
  if (h < 5) return "dawn";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "night";
}

const cards = [
  {
    to: "/apoio",
    key: "apoio",
    icon: HeartHandshake,
    tone: "neon",
    iconCls: "bg-neon/10 text-neon shadow-neon",
    glow: { "--glow-from": "var(--neon)", "--glow-to": "var(--electric)" },
  },
  {
    to: "/alongamento",
    key: "alongamento",
    icon: Activity,
    tone: "electric",
    iconCls: "bg-electric/15 text-electric shadow-electric",
    glow: { "--glow-from": "var(--electric)", "--glow-to": "var(--neon)" },
  },
  {
    to: "/nutricao",
    key: "nutricao",
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
      setTime(d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  const { t, i18n } = useTranslation();
  const gk = greetKey(hour);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 pb-10 pt-5 sm:px-6">
      <NamePrompt forceOpen={editName} onClose={() => setEditName(false)} />
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-80" />

      <header className="relative z-10 flex items-center animate-rise">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-neon/10 text-neon shadow-neon">
            <Zap className="size-6" fill="currentColor" />
          </div>
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight">
              Driver<span className="text-neon text-glow">Pulse</span>
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t("home.tagline")}</p>
          </div>
        </div>
        <div className="ml-auto mr-2 glass hidden min-[400px]:flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
          <span className="size-2 rounded-full bg-mint animate-pulse-dot" />
          <span className="text-mint">{t("home.online")}</span>
          {time && <span className="text-muted-foreground">· {time}</span>}
        </div>
        <LanguageSwitcher />
      </header>

      <section className="relative z-10 mt-10 animate-rise [animation-delay:80ms]">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            {t(`home.g.${gk}.hi`)}, {name ?? t("home.driver")} 👋
          </p>
          <button
            onClick={() => setEditName(true)}
            aria-label={t("home.editName")}
            className="tap flex size-7 items-center justify-center rounded-full bg-secondary text-neon"
          >
            <Pencil className="size-3.5" />
          </button>
        </div>
        <h1 className="mt-1 text-3xl font-bold leading-tight sm:text-4xl">{t(`home.g.${gk}.msg`)}</h1>
      </section>

      <section key={i18n.language} className="relative z-10 mt-8 grid grid-cols-2 gap-3">
        <Link
          to="/levantar-caixas"
          className="tap group relative flex flex-col gap-3 overflow-hidden rounded-3xl bg-amber p-4 text-primary-foreground animate-rise [animation-delay:120ms] active:brightness-110"
        >
          <HardHat className="size-9" />
          <div>
            <h2 className="font-display text-base font-extrabold leading-tight">{t("home.lift.title")}</h2>
            <p className="mt-1 text-xs font-semibold opacity-80">{t("home.lift.desc")}</p>
          </div>
        </Link>
        <Link
          to="/casa"
          className="tap group relative flex flex-col gap-3 overflow-hidden rounded-3xl bg-mint p-4 text-primary-foreground animate-rise [animation-delay:160ms] active:brightness-110"
        >
          <Home className="size-9" />
          <div>
            <h2 className="font-display text-base font-extrabold leading-tight">{t("home.home.title")}</h2>
            <p className="mt-1 text-xs font-semibold opacity-80">{t("home.home.desc")}</p>
          </div>
        </Link>
      </section>

      <section className="relative z-10 mt-4 flex flex-col gap-4">
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
              <h2 className="text-lg font-bold leading-tight sm:text-xl">{t(`home.cards.${c.key}.title`)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t(`home.cards.${c.key}.desc`)}</p>
            </div>
            <ChevronRight className="size-6 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </section>

      <footer className="relative z-10 mt-auto pt-10 text-center text-xs text-muted-foreground">
        {t("home.footer")}
      </footer>
    </div>
  );
}
