import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Mic, Send, Sparkles, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { NamePrompt } from "@/components/NamePrompt";
import { useDriverName } from "@/hooks/useDriverName";

export const Route = createFileRoute("/apoio")({
  head: () => ({
    meta: [
      { title: "Apoio & Desabafo — DriverPulse" },
      { name: "description", content: "Converse livremente com uma IA empática sobre cansaço, estresse da rota e ansiedade." },
      { property: "og:title", content: "Apoio & Desabafo — DriverPulse" },
      { property: "og:description", content: "Um espaço seguro para desabafar durante a rota." },
    ],
  }),
  component: Apoio,
});

type Msg = { id: string; role: "user" | "assistant"; text: string };

const quick = ["Estou exausto", "Trânsito me estressou", "Ansioso com prazos", "Só quero desabafar"];

function Breath() {
  const [phase, setPhase] = useState(0);
  const phases = ["Inspire · 4s", "Segure · 4s", "Solte · 6s"];
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 3), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="glass mt-3 flex items-center gap-4 rounded-2xl p-3">
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-neon/30 animate-breathe" />
        <Wind className="relative size-6 text-neon" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Respiração guiada 4-4-6</p>
        <p className="font-display text-lg font-bold text-neon">{phases[phase]}</p>
      </div>
    </div>
  );
}

function Apoio() {
  const { name } = useDriverName();
  const [editName, setEditName] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [breath, setBreath] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    setMsgs([
      {
        id: "intro",
        role: "assistant",
        text: `Oi${name ? `, ${name}` : ""}! Sou seu apoio de bordo. Pode escrever o que quiser, do jeito que vier — cansaço, estresse, dor nas costas, ansiedade. Estou aqui.`,
      },
    ]);
  }, [name]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  const send = async (value: string) => {
    const v = value.trim();
    if (!v || busy) return;
    setError(null);
    const history = [...msgs.filter((m) => m.id !== "intro"), { id: crypto.randomUUID(), role: "user" as const, text: v }];
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "user", text: v }]);
    setText("");
    setBusy(true);

    const replyId = crypto.randomUUID();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          messages: history.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok || !res.body) {
        setError((await res.text().catch(() => "")) || "Não consegui responder agora. Tente de novo.");
        setBusy(false);
        return;
      }

      setMsgs((m) => [...m, { id: replyId, role: "assistant", text: "" }]);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((m) => m.map((msg) => (msg.id === replyId ? { ...msg, text: acc } : msg)));
      }
      if (!acc.trim()) {
        setMsgs((m) =>
          m.map((msg) =>
            msg.id === replyId ? { ...msg, text: "Estou aqui com você. Pode me contar um pouco mais?" } : msg,
          ),
        );
      }
    } catch {
      setError("Sem conexão no momento. Tente novamente quando o sinal voltar.");
    } finally {
      setBusy(false);
    }
  };

  const toggleMic = () => {
    type SR = new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      start: () => void;
      stop: () => void;
      onresult: ((e: { results: { 0: { transcript: string } }[] }) => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
    };
    const w = window as unknown as { SpeechRecognition?: SR; webkitSpeechRecognition?: SR };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setError("Seu navegador não suporta ditado por voz. Pode escrever sua mensagem.");
      return;
    }
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new Ctor();
    recRef.current = rec;
    rec.lang = "pt-BR";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      const t = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setText(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  };

  return (
    <AppShell title="Como Você Está Hoje?" subtitle="IA empática · sempre disponível" icon={HeartHandshake} tone="neon">
      {editName && <NamePrompt forceOpen onClose={() => setEditName(false)} />}

      <div className="flex flex-1 flex-col gap-3 pb-40">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Falando com {name ?? "você"}</span>
          <button onClick={() => setEditName(true)} className="tap rounded-full bg-secondary px-3 py-1 font-semibold text-neon">
            {name ? "Trocar nome" : "Dizer meu nome"}
          </button>
          <button
            onClick={() => setBreath((b) => !b)}
            className="tap rounded-full bg-secondary px-3 py-1 font-semibold text-neon"
          >
            {breath ? "Fechar respiração" : "Respiração guiada"}
          </button>
        </div>

        {breath && <Breath />}

        {msgs.map((m) => (
          <div key={m.id} className={`flex animate-rise ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="mr-2 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">
                <Sparkles className="size-4" />
              </div>
            )}
            <div
              className={`max-w-[82%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-[15px] leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-electric text-accent-foreground shadow-electric"
                  : "glass rounded-bl-md"
              }`}
            >
              {m.text || "…"}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex items-center gap-2 pl-10 text-sm text-muted-foreground animate-rise">
            <span className="flex gap-1">
              <span className="size-2 animate-bounce rounded-full bg-neon" />
              <span className="size-2 animate-bounce rounded-full bg-neon [animation-delay:120ms]" />
              <span className="size-2 animate-bounce rounded-full bg-neon [animation-delay:240ms]" />
            </span>
            pensando com carinho…
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
            {error}
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
              disabled={busy}
              className="tap shrink-0 rounded-full border border-neon/30 bg-background/80 px-4 py-2 text-sm font-medium text-neon backdrop-blur hover:bg-neon/10 disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(text);
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
            placeholder={listening ? "Ouvindo…" : "Escreva ou fale o que quiser…"}
            className="h-12 min-w-0 flex-1 bg-transparent px-2 text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Enviar"
            disabled={!text.trim() || busy}
            className="tap flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neon text-primary-foreground shadow-neon disabled:opacity-40"
          >
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
