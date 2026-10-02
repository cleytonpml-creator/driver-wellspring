import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Home, MessageCircleHeart, Wind } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { useDriverName } from "@/hooks/useDriverName";

export const Route = createFileRoute("/casa")({
  head: () => ({
    meta: [
      { title: "Já Estou em Casa — DriverPulse" },
      { name: "description", content: "Relaxamento, respiração guiada e um parceiro de conversa para depois do turno." },
      { property: "og:title", content: "Já Estou em Casa — DriverPulse" },
      { property: "og:description", content: "Desacelere depois do expediente na van." },
    ],
  }),
  component: Casa,
});

function Casa() {
  const { t } = useTranslation();
  const { name } = useDriverName();
  const opts = [
    { to: "/casa-relaxar", key: "relax", icon: Wind, cls: "bg-mint/10 text-mint shadow-mint", glow: "[--glow-from:var(--mint)] [--glow-to:var(--neon)]" },
    { to: "/casa-conversa", key: "talk", icon: MessageCircleHeart, cls: "bg-amber/15 text-amber", glow: "[--glow-from:var(--amber)] [--glow-to:var(--neon)]" },
  ] as const;

  return (
    <AppShell title={t("casa.title")} subtitle={t("casa.subtitle")} icon={Home} tone="mint">
      <h2 className="text-2xl font-bold leading-tight animate-rise">
        {t("casa.hello", { name: name ?? t("home.driver") })}
      </h2>
      <div className="mt-6 flex flex-col gap-4">
        {opts.map((o, i) => (
          <Link
            key={o.to}
            to={o.to}
            style={{ animationDelay: `${100 + i * 90}ms` }}
            className={`glass neon-border tap group flex items-center gap-4 rounded-3xl p-6 animate-rise ${o.glow}`}
          >
            <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${o.cls}`}>
              <o.icon className="size-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold leading-tight">{t(`casa.${o.key}.title`)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(`casa.${o.key}.desc`)}</p>
            </div>
            <ChevronRight className="size-6 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
