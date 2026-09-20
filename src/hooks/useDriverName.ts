import { useCallback, useEffect, useState } from "react";

const KEY = "driverpulse:name";
const EVT = "driverpulse:name-change";

export function useDriverName() {
  const [name, setNameState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => setNameState(localStorage.getItem(KEY));
    read();
    setReady(true);
    window.addEventListener(EVT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(EVT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  const setName = useCallback((value: string) => {
    const v = value.trim().slice(0, 24);
    if (!v) return;
    localStorage.setItem(KEY, v);
    window.dispatchEvent(new Event(EVT));
  }, []);

  const clearName = useCallback(() => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVT));
  }, []);

  return { name, setName, clearName, ready };
}
