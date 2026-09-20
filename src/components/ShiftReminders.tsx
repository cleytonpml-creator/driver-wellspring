import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Coffee, Droplets, Moon, Sun } from "lucide-react";
import { useDriverName } from "@/hooks/useDriverName";

type Shift = "madrugada" | "manha" | "tarde" | "noite";

function shiftOf(h: number): Shift {
  if (h < 5) return "madrugada";
  if (h < 12) return "manha";
  if (h < 18) return "tarde";
  return "noite";
}

const pool: Record<Shift, { icon: typeof Sun; text: (n: string) => string }[]> = {
  madrugada: [
    { icon: Moon, text: (n) => `${n}, rota noturna pede pausa. Pare em local seguro e alongue o pescoço por 30s.` },
    { icon: Droplets, text: (n) => `Água gelada ajuda a manter o alerta, ${n}. Beba alguns goles agora.` },
    { icon: Coffee, text: (n) => `Sono batendo? 15 minutos parado valem mais que 1 hora arriscada, ${n}.` },
  ],
  manha: [
    { icon: Sun, text: (n) => `Bom dia de trabalho, ${n}! Que tal soltar os ombros antes da próxima entrega?` },
    { icon: Droplets, text: (n) => `Hidratação, ${n}. Meio copo d'água agora evita a dor de cabeça da tarde.` },
    { icon: Coffee, text: (n) => `Hora da pausa, ${n}! Levante e faça um alongamento rápido de lombar.` },
  ],
  tarde: [
    { icon: Coffee, text: (n) => `Hora da pausa, ${n}! Que tal levantar e fazer um alongamento rápido?` },
    { icon: Droplets, text: (n) => `${n}, o calor desidrata rápido. Beba água antes de sentir sede.` },
    { icon: Sun, text: (n) => `Confere a postura, ${n}: coluna apoiada, ombros baixos, mãos leves no volante.` },
  ],
  noite: [
    { icon: Moon, text: (n) => `Dia longo, ${n}. Respire fundo 3 vezes antes de seguir viagem.` },
    { icon: Droplets, text: (n) => `Última hidratação do turno, ${n}. Seu corpo agradece amanhã.` },
    { icon: Coffee, text: (n) => `Pausa de 5 minutos, ${n}? Pernas e joelhos pedem movimento.` },
  ],
};

const INTERVAL_MS = 45 * 60 * 1000;
const FIRST_MS = 60 * 1000;
const LAST_KEY = "driverpulse:last-reminder";

export function ShiftReminders() {
  const { name } = useDriverName();
  const idx = useRef(0);
  const [nameRef, setNameRef] = useState<string | null>(null);

  useEffect(() => setNameRef(name), [name]);

  useEffect(() => {
    if (!nameRef) return;

    const fire = () => {
      const shift = shiftOf(new Date().getHours());
      const list = pool[shift];
      const item = list[idx.current % list.length]!;
      idx.current += 1;
      localStorage.setItem(LAST_KEY, String(Date.now()));
      const Icon = item.icon;
      toast(item.text(nameRef), {
        duration: 12000,
        icon: <Icon className="size-5 text-neon" />,
        action: { label: "Alongar", onClick: () => (window.location.href = "/alongamento") },
      });
    };

    const last = Number(localStorage.getItem(LAST_KEY) ?? 0);
    const elapsed = Date.now() - last;
    const firstDelay = last && elapsed < INTERVAL_MS ? INTERVAL_MS - elapsed : FIRST_MS;

    let interval: ReturnType<typeof setInterval> | null = null;
    const t = setTimeout(() => {
      fire();
      interval = setInterval(fire, INTERVAL_MS);
    }, firstDelay);

    return () => {
      clearTimeout(t);
      if (interval) clearInterval(interval);
    };
  }, [nameRef]);

  return null;
}
