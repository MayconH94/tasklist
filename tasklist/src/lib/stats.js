import { addDays, lastDays, todayKey } from "./dates";

const wrote = (entry) => Boolean(entry?.notes?.trim());

// Dias seguidos com diário escrito. Se hoje ainda está vazio,
// a sequência de ontem continua valendo (você ainda pode escrever hoje).
export function journalStreak(entries, today = todayKey()) {
  let day = wrote(entries[today]) ? today : addDays(today, -1);
  let count = 0;
  while (wrote(entries[day])) {
    count++;
    day = addDays(day, -1);
  }
  return count;
}

// Humor médio dos últimos "n" dias (null se não houver registro)
export function averageMood(entries, n = 7, today = todayKey()) {
  const moods = lastDays(n, today)
    .map((d) => entries[d]?.mood)
    .filter(Boolean);
  if (moods.length === 0) return null;
  return moods.reduce((a, b) => a + b, 0) / moods.length;
}

export function taskStats(tasks, today = todayKey()) {
  const done = tasks.filter((t) => t.done).length;
  const overdue = tasks.filter(
    (t) => t.dueDate && !t.done && t.dueDate < today,
  ).length;
  const pomodoros = tasks.reduce((sum, t) => sum + (t.pomodoros ?? 0), 0);
  const byCategory = {};
  for (const t of tasks) {
    const c = t.category ?? "pessoal";
    byCategory[c] = (byCategory[c] ?? 0) + 1;
  }
  return {
    total: tasks.length,
    done,
    pending: tasks.length - done,
    overdue,
    pomodoros,
    byCategory,
  };
}
