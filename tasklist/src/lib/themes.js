// "dark: true" liga também a classe .dark, para os componentes que ainda
// usam as variantes dark: do Tailwind (vamos migrando aos poucos).
export const THEMES = [
  { id: "claro", label: "Claro", dark: false, emoji: "", info: "Limpo e neutro" },
  { id: "escuro", label: "Escuro", dark: true, emoji: "", info: "Confortável à noite" },
  { id: "halloween", label: "Halloween", dark: true, emoji: "🎃", info: "Roxo e laranja" },
  { id: "natal", label: "Natal", dark: true, emoji: "🎄", info: "Verde e vermelho" },
  { id: "translucido", label: "Translúcido", dark: true, emoji: "", info: "Vidro desfocado" },
];

export const DEFAULT_THEME = "escuro";

export const getTheme = (id) =>
  THEMES.find((t) => t.id === id) ?? THEMES.find((t) => t.id === DEFAULT_THEME);
