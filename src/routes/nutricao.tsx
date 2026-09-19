import { createFileRoute } from "@tanstack/react-router";
import { Apple, Bot, CalendarDays, Cookie, Droplets, MapPin, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";

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
  { id: "lanches", label: "Lanches", icon: Cookie },
  { id: "marmitas", label: "Marmitas", icon: CalendarDays },
  { id: "ia", label: "IA Sugere", icon: Bot },
] as const;
type Tab = (typeof tabs)[number]["id"];

const snacks = [
  { emoji: "🥜", name: "Mix de castanhas", tip: "Dura semanas no porta-luvas. Punhado = energia sem pico de açúcar.", tag: "Energia" },
  { emoji: "🍌", name: "Banana + pasta de amendoim", tip: "Potássio contra cãibra. Leve sachês individuais.", tag: "Cãibra" },
  { emoji: "🥕", name: "Cenoura baby e pepino", tip: "Em pote com tampa. Crocante, hidrata e não suja.", tag: "Hidrata" },
  { emoji: "🍎", name: "Maçã", tip: "Não amassa, não estraga. Fibra que segura a fome.", tag: "Saciedade" },
  { emoji: "🥚", name: "Ovos cozidos", tip: "Cozinhe 6 no domingo. Proteína barata e prática.", tag: "Proteína" },
  { emoji: "🌾", name: "Barrinha de aveia caseira", tip: "Aveia, mel e banana no forno. Sem conservante.", tag: "Energia" },
  { emoji: "🧀", name: "Queijo em cubos + torrada integral", tip: "Em bolsa térmica pequena. Ótimo no meio da tarde.", tag: "Proteína" },
];

const week = [
  { day: "Seg", dish: "Frango grelhado + arroz integral + brócolis", prep: "Grelhe 1kg de peito de uma vez", kcal: 520 },
  { day: "Ter", dish: "Carne moída com legumes + batata-doce", prep: "Refogue com cenoura e abobrinha", kcal: 560 },
  { day: "Qua", dish: "Omelete de forno + salada de grão-de-bico", prep: "Assa em 20 min, rende 4 porções", kcal: 480 },
  { day: "Qui", dish: "Peixe assado + purê de mandioquinha", prep: "Tilápia com limão e ervas", kcal: 500 },
  { day: "Sex", dish: "Strogonoff light + arroz + salada", prep: "Iogurte no lugar do creme", kcal: 540 },
  { day: "Sáb", dish: "Macarrão integral com frango e molho de tomate", prep: "Molho caseiro em lote", kcal: 580 },
  { day: "Dom", dish: "Dia de preparo: cozinhe grãos e proteínas da semana", prep: "2h que salvam a semana", kcal: 0 },
];

function suggest(input: string) {
  const t = input.toLowerCase();
  if (/(posto|estrada|rodovia)/.test(t))
    return {
      title: "No posto de gasolina",
      items: ["Pão de queijo pequeno + café sem açúcar", "Água de coco ou água mineral (evite refrigerante)", "Banana ou maçã da gôndola", "Se tiver buffet: arroz, feijão, proteína grelhada e salada"],
      hydration: "Compre 1,5L de água agora. Meta: 1 gole a cada semáforo.",
    };
  if (/(padaria|café|cafe)/.test(t))
    return {
      title: "Na padaria",
      items: ["Pão integral com ovo mexido", "Iogurte natural com granola", "Suco natural sem açúcar", "Evite salgados fritos — pesam na digestão ao dirigir"],
      hydration: "Peça um copo de água junto com o café. Café não conta como hidratação.",
    };
  if (/(lanchonete|fast|hamb|hambúrguer|hamburguer)/.test(t))
    return {
      title: "Na lanchonete",
      items: ["Sanduíche de frango grelhado sem maionese", "Troque batata frita por salada ou milho", "Água ou suco natural em vez de refri", "Coma devagar: 15 min parado vale mais que engolir dirigindo"],
      hydration: "Refrigerante desidrata. Peça água com limão.",
    };
  if (/(arroz|frango|ovo|feij|pão|pao|banana|fruta|marmita)/.test(t))
    return {
      title: "Com o que você tem em mãos",
      items: [`Monte um prato: ${input} + uma fonte de fibra (salada ou fruta)`, "Proteína primeiro, carboidrato depois: menos sono pós-almoço", "Porção do tamanho da sua mão fechada para o carboidrato", "Guarde metade se estiver muito cheio — é o lanche das 16h"],
      hydration: "Beba 1 copo de água antes de comer. Ajuda na saciedade.",
    };
  return {
    title: "Escolha inteligente para agora",
    items: ["Priorize: proteína magra + vegetal + carboidrato integral", "Evite frituras e açúcar antes de dirigir longos trechos", "Se só tiver o mercadinho: iogurte, fruta, castanha e água", "Coma a cada 3–4h para manter atenção no volante"],
    hydration: "Meta diária: 2 a 3 litros. Mantenha uma garrafa visível no painel.",
  };
}

function Nutricao() {
  const [tab, setTab] = useState<Tab>("lanches");
  const [q, setQ] = useState("");
  const [result, setResult] = useState<ReturnType<typeof suggest> | null>(null);
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
    <AppShell title="Nutrição na Rota" subtitle="Dieta & marmitas para entregadores" icon={Apple} tone="mint">
      <div className="glass grid grid-cols-3 gap-1 rounded-2xl p-1 animate-rise">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`tap flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                active ? "bg-mint text-primary-foreground shadow-mint" : "text-muted-foreground"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "lanches" && (
        <div key="l" className="mt-5 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground animate-rise">Snacks que aguentam calor e horas no carro.</p>
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
          <p className="text-sm text-muted-foreground animate-rise">Prepare no domingo, coma bem a semana toda.</p>
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
              <h2 className="font-bold">Me diga onde está ou o que tem em mãos</h2>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); ask(q); }}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-background/60 p-2"
            >
              <MapPin className="ml-2 size-5 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ex: estou num posto na rodovia…"
                className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" aria-label="Pedir sugestão" disabled={!q.trim()} className="tap flex size-11 shrink-0 items-center justify-center rounded-xl bg-mint text-primary-foreground shadow-mint disabled:opacity-40">
                <Send className="size-5" />
              </button>
            </form>
            <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
              {["Posto na estrada", "Padaria", "Lanchonete", "Tenho arroz e ovo"].map((s) => (
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
              analisando opções…
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
                <p><span className="font-bold text-electric">Hidratação: </span>{result.hydration}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
