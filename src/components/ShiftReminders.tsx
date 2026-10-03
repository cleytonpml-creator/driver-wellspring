import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Coffee, Droplets, Moon, Sun } from "lucide-react";
import { useDriverName } from "@/hooks/useDriverName";
import i18n from "@/i18n";

type Shift = "dawn" | "morning" | "afternoon" | "night";

function shiftOf(h: number): Shift {
  if (h < 5) return "dawn";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "night";
}

const icons: Record<Shift, (typeof Sun)[]> = {
  dawn: [Moon, Droplets, Coffee],
  morning: [Sun, Droplets, Coffee],
  afternoon: [Coffee, Droplets, Sun],
  night: [Moon, Droplets, Coffee],
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
      const list = i18n.t(`reminders.${shift}`, { returnObjects: true, name: nameRef }) as string[];
      const k = idx.current % list.length;
      idx.current += 1;
      localStorage.setItem(LAST_KEY, String(Date.now()));
      const Icon = icons[shift][k]!;
      toast(list[k], {
        duration: 12000,
        icon: <Icon className="size-5 text-neon" />,
        action: { label: i18n.t("reminders.action"), onClick: () => (window.location.href = "/alongamento") },
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
