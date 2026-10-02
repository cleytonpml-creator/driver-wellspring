import { createFileRoute } from "@tanstack/react-router";
import { Lock, MessageCircleHeart, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { useDriverName } from "@/hooks/useDriverName";
import { companionIntro, companionReply, type Lang } from "@/lib/companion";

export const Route = createFileRoute("/casa-conversa")({
  head: () => ({
    meta: [
      { title: "Fale Comigo — DriverPulse" },
      { name: "description", content: "Um parceiro de conversa bem-humorado e acolhedor para depois do turno, direto no seu aparelho." },
      { property: "og:title", content: "Fale Comigo — DriverPulse" },
      { property: "og:description", content: "Desabafe, conte do seu dia ou peça uma piada." },
    ],
  }),
  component: Talk,
});

type Msg = { id: string; role: "user" | "bot"; text: string };

function Talk() {
  const { t, i18n } = useTranslation();
  const lang = (["pt", "en", "es"].includes(i18n.language) ? i18n.language : "pt") as Lang;
  const { name } = useDriverName();
  const who = name ?? t("home.driver");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMsgs((m) => {
      const intro = { id: "intro", role: "bot" as const, text: companionIntro(lang, who) };
      return m.length <= 1 ? [intro] : m;
    });
  }, [lang, who]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (value: string) => {
    const v = value.trim();
    if (!v || typing) return;
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "user", text: v }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "bot", text: companionReply(v, lang, who) }]);
      setTyping(false);
      inputRef.current?.focus();
    }, 700 + Math.random() * 600);
  };

  const chips = t("talk.chips", { returnObjects: true }) as string[];

  return (
    <AppShell title={t("talk.title")} subtitle={t("talk.subtitle")} icon={MessageCircleHeart} tone="amber" backTo="/casa">
      <div className="flex flex-1 flex-col gap-3 pb-40">
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" /> {t("talk.local")}
        </p>
        {msgs.map((m) => (
          <div key={m.id} className={`flex animate-rise ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "bot" && (
              <div className="mr-2 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber/15 text-lg">🧢</div>
            )}
            <div
              className={`max-w-[82%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-[15px] leading-relaxed ${
                m.role === "user" ? "rounded-br-md bg-amber text-primary-foreground" : "glass rounded-bl-md"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2 pl-10 text-sm text-muted-foreground animate-rise">
            <span className="flex gap-1">
              <span className="size-2 animate-bounce rounded-full bg-amber" />
              <span className="size-2 animate-bounce rounded-full bg-amber [animation-delay:120ms]" />
              <span className="size-2 animate-bounce rounded-full bg-amber [animation-delay:240ms]" />
            </span>
            {t("talk.typing")}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-2xl px-4 pb-4 sm:px-6">
        <div className="scrollbar-none mb-2 flex gap-2 overflow-x-auto">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => send(c)}
              disabled={typing}
              className="tap shrink-0 rounded-full border border-amber/40 bg-background/80 px-4 py-2 text-sm font-medium text-amber backdrop-blur disabled:opacity-40"
            >
              {c}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(text); }}
          className="glass flex items-center gap-2 rounded-3xl border border-amber/30 p-2"
        >
          <input
            ref={inputRef}
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("talk.placeholder")}
            className="h-12 min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label={t("apoio.send")}
            disabled={!text.trim() || typing}
            className="tap flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber text-primary-foreground disabled:opacity-40"
          >
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
