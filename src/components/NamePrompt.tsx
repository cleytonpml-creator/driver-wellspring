import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useDriverName } from "@/hooks/useDriverName";

export function NamePrompt({
  forceOpen,
  onClose,
}: {
  forceOpen?: boolean;
  onClose?: () => void;
}) {
  const { name, setName, ready } = useDriverName();
  const [value, setValue] = useState("");

  const open = ready && (forceOpen || !name);

  useEffect(() => {
    if (open) setValue(name ?? "");
  }, [open, name]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          setName(value);
          onClose?.();
        }}
        className="glass neon-border w-full max-w-md rounded-3xl p-6 animate-rise"
      >
        <div className="flex size-14 items-center justify-center rounded-2xl bg-neon/10 text-neon shadow-neon">
          <UserRound className="size-7" />
        </div>
        <h2 className="mt-4 text-2xl font-bold leading-tight">Como você gostaria de ser chamado(a)?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Assim eu falo com você pelo nome nos lembretes e no apoio de bordo.
        </p>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ex.: Cleyton"
          maxLength={24}
          className="mt-5 h-14 w-full rounded-2xl bg-secondary px-4 text-lg outline-none ring-neon/60 placeholder:text-muted-foreground focus:ring-2"
        />
        <div className="mt-4 flex gap-2">
          {name && (
            <button
              type="button"
              onClick={() => onClose?.()}
              className="tap h-14 flex-1 rounded-2xl bg-secondary text-base font-bold text-muted-foreground"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={!value.trim()}
            className="tap h-14 flex-[2] rounded-2xl bg-neon text-base font-bold text-primary-foreground shadow-neon disabled:opacity-40"
          >
            Salvar e começar
          </button>
        </div>
      </form>
    </div>
  );
}
