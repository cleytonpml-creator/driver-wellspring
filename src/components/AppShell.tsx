import { Link } from "@tanstack/react-router";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  tone?: "neon" | "electric" | "mint";
  children: ReactNode;
};

const toneMap = {
  neon: "text-neon shadow-neon bg-neon/10",
  electric: "text-electric shadow-electric bg-electric/15",
  mint: "text-mint shadow-mint bg-mint/10",
};

export function AppShell({ title, subtitle, icon: Icon, tone = "neon", children }: Props) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 pb-8 pt-4 sm:px-6">
      <header className="glass sticky top-3 z-20 mb-5 flex items-center gap-3 rounded-2xl px-3 py-3 animate-rise">
        <Link
          to="/"
          aria-label="Voltar ao início"
          className="tap flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="size-6" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold leading-tight">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
