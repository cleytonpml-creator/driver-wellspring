import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Mic, Send, Sparkles, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/apoio")({
  head: () => ({
    meta: [
      { title: "Apoio & Desabafo — DriverPulse" },
      { name: "description", content: "Converse com uma IA empática sobre cansaço, estresse da rota e ansiedade." },
      { property: "og:title", content: "Apoio & Desabafo — DriverPulse" },
      { property: "og:description", content: "Um espaço seguro para desabafar durante a rota." },
    ],
  }),
  component: Apoio,
});

type Msg = { id: number; from: "ai" | "me"; text: string; breath?: boolean };

const quick = ["Estou exausto", "Trânsito me estressou", "Ansioso com prazos", "Só quero desabafar"];

function reply(input: string): Msg[] {
  const t = input.toLowerCase();
  const n = () => Date.now() + Math.random();
  if (/(cansa|exaust|sono|esgot)/.test(t))
    return [
      { id: n(), from: "ai", text: "Sinto que o dia está pesando. Cansaço assim é sinal de que você deu muito de si — não de fraqueza." },
      { id: n(), from: "ai", text: "Se puder, pare 2 minutos num lugar seguro. Vamos fazer uma respiração rápida juntos:", breath: true },
    ];
  if (/(trânsito|transito|engarraf|buzin|motorista)/.test(t))
    return [
      { id: n(), from: "ai", text: "O trânsito tira a paciência de qualquer um. Você não controla a rua, mas controla o seu ritmo dentro da van." },
      { id: n(), from: "ai", text: "Solte os ombros, afrouxe as mãos no volante e tente esta respiração 4-4-6:", breath: true },
    ];
  if (/(ansi|prazo|atras|pressão|pressao|medo)/.test(t))
    return [
      { id: n(), from: "ai", text: "Ansiedade por prazo é comum quando tudo depende de você. Uma entrega de cada vez — é só isso que existe agora." },
      { id: n(), from: "ai", text: "Nomeie 3 coisas que você vê, 2 que ouve e 1 que sente. Isso traz a mente de volta para o presente." },
    ];
  if (/(triste|sozinho|sozinha|chor|desanim)/.test(t))
    return [
      { id: n(), from: "ai", text: "Obrigado por confiar isso a mim. Passar horas sozinho na estrada pesa mesmo. Você não está sozinho aqui." },
      { id: n(), from: "ai", text: "Que tal mandar uma mensagem para alguém que gosta de você no próximo ponto? Conexão é combustível." },
    ];
  return [
    { id: n(), from: "ai", text: "Entendi. Estou aqui com você. Quer me contar um pouco mais sobre o que está sentindo agora?" },
    { id: n(), from: "ai", text: "Lembre: você já venceu 100% dos dias difíceis até hoje. Esse também vai passar. 💙" },
  ];
}

function Breath() {
  const [phase, setPhase] = useState(0);
  const phases = ["Inspire · 4s", "Segure · 4s", "Solte · 6s"];
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 3), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mt-3 flex items-center gap-4 rounded-2xl bg-background/50 p-3">
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-neon/30 animate-breathe" />
        <Wind className="relative size-6 text-neon" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Respiração guiada</p>
        <p className="font-display text-lg font-bold text-neon">{phases[phase]}</p>
      </div>
    </div>
  );
}

function Apoio() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, from: "ai", text: "Oi! Sou seu apoio de bordo. Como você está se sentindo agora? Pode falar sem filtro — aqui é um espaço seguro." },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (value: string) => {
    const v = value.trim();
    if (!v || typing) return;
    setMsgs((m) => [...m, { id: Date.now(), from: "me", text: v }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, ...reply(v)]);
      setTyping(false);
    }, 1100);
  };

  const toggleMic = () => {
    if (listening) return;
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setText("Estou muito cansado hoje, o trânsito estava pesado");
    }, 1800);
  };

  return (
    <AppShell title="Como Você Está Hoje?" subtitle="IA empática · sempre disponível" icon={HeartHandshake} tone="neon">
      <div className="flex flex-1 flex-col gap-3 pb-36">
        {msgs.map((m) => (
          <div key={m.id} className={`flex animate-rise ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            {m.from === "ai" && (
              <div className="mr-2 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">
                <Sparkles className="size-4" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-3xl px-4 py-3 text-[15px] leading-relaxed ${
                m.from === "me"
                  ? "rounded-br-md bg-electric text-accent-foreground shadow-electric"
                  : "glass rounded-bl-md"
              }`}
            >
              {m.text}
              {m.breath && <Breath />}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2 pl-10 text-sm text-muted-foreground animate-rise">
            <span className="flex gap-1">
              <span className="size-2 animate-bounce rounded-full bg-neon" />
              <span className="size-2 animate-bounce rounded-full bg-neon [animation-delay:120ms]" />
              <span className="size-2 animate-bounce rounded-full bg-neon [animation-delay:240ms]" />
            </span>
            pensando com carinho…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-2xl px-4 pb-4 sm:px-6">
        <div className="scrollbar-none mb-2 flex gap-2 overflow-x-auto">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="tap shrink-0 rounded-full border border-neon/30 bg-background/80 px-4 py-2 text-sm font-medium text-neon backdrop-blur hover:bg-neon/10"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
          className="glass neon-border flex items-center gap-2 rounded-3xl p-2"
        >
          <button
            type="button"
            onClick={toggleMic}
            aria-label="Falar por áudio"
            className={`tap flex size-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
              listening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-secondary text-neon"
            }`}
          >
            <Mic className="size-6" />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={listening ? "Ouvindo…" : "Escreva ou fale como está…"}
            className="h-12 min-w-0 flex-1 bg-transparent px-2 text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Enviar"
            disabled={!text.trim()}
            className="tap flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neon text-primary-foreground shadow-neon disabled:opacity-40"
          >
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
