import { useEffect, useState } from "react";
import { todayKey } from "../lib/dates";

// Devolve a data de hoje e se atualiza sozinho quando a meia-noite passa
// (ou quando o computador volta de suspensão com o app aberto).
export function useToday() {
  const [today, setToday] = useState(todayKey);

  useEffect(() => {
    let timer;

    function scheduleMidnight() {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      timer = setTimeout(
        () => {
          setToday(todayKey());
          scheduleMidnight();
        },
        midnight - now + 500,
      );
    }

    const refresh = () => setToday(todayKey());

    scheduleMidnight();
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return today;
}
