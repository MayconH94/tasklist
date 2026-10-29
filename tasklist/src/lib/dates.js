// datas do app: sempre texto "AAAA-MM-DD" no fuso local.

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const toKey = (date) => date.toLocaleDateString("sv-SE");

export const todayKey = () => toKey(new Date());

export function fromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

// Do dia mais antigo ao mais novo, terminando em "from" (padrão: hoje).
export function lastDays(n, from = todayKey()) {
  return Array.from({ length: n }, (_, i) => addDays(from, i - (n - 1)));
}

export function formatLong(key) {
  return capitalize(
    fromKey(key).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );
}

export function formatShort(key) {
  return capitalize(
    fromKey(key).toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
  );
}