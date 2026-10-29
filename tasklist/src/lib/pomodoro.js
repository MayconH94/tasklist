// Lógica do Pomodoro em funções puras (sem React), fáceis de testar.
//
// O tempo é calculado pelo HORÁRIO em que a fase termina (endsAt), e não
// contando "ticks": se o navegador atrasar o timer (aba em segundo plano,
// computador ocupado), o relógio continua certo.

export const DURATIONS = { foco: 25 * 60, pausa: 5 * 60, longa: 15 * 60 }; // segundos
export const MODE_LABEL = { foco: "Foco", pausa: "Pausa", longa: "Pausa longa" };
export const FOCUS_BEFORE_LONG_BREAK = 4;

export function initialState() {
  return {
    mode: "foco",
    running: false,
    endsAt: null, // instante (ms) em que a fase termina, só enquanto roda
    left: DURATIONS.foco, // segundos restantes, só enquanto pausado
    now: 0, // instante do último tick
    cycles: 0, // focos concluídos
    completed: 0, // fases concluídas (foco ou pausa): usado para tocar o alarme
  };
}

export function secondsLeft(state) {
  if (!state.running) return state.left;
  return Math.max(0, Math.ceil((state.endsAt - state.now) / 1000));
}

function switchMode(state, mode) {
  return { ...state, mode, running: false, endsAt: null, left: DURATIONS[mode] };
}

// A fase acabou sozinha: conta o foco e escolhe a próxima fase.
function complete(state) {
  const focusDone = state.mode === "foco";
  const cycles = state.cycles + (focusDone ? 1 : 0);
  const next = focusDone
    ? cycles % FOCUS_BEFORE_LONG_BREAK === 0
      ? "longa"
      : "pausa"
    : "foco";
  return {
    ...switchMode(state, next),
    cycles,
    completed: state.completed + 1,
  };
}

// Atualiza o relógio e verifica se a fase já terminou.
function advance(state, now) {
  if (!state.running) return state;
  if (now >= state.endsAt) return complete(state);
  return { ...state, now };
}

export function pomodoroReducer(state, action) {
  switch (action.type) {
    case "START":
      if (state.running) return state;
      return {
        ...state,
        running: true,
        now: action.now,
        endsAt: action.now + state.left * 1000,
      };

    case "PAUSE": {
      const s = advance(state, action.now);
      if (!s.running) return s; // terminou no mesmo instante
      return {
        ...s,
        running: false,
        endsAt: null,
        left: Math.max(1, Math.ceil((s.endsAt - action.now) / 1000)),
      };
    }

    case "TICK":
      return advance(state, action.now);

    case "RESET":
      return switchMode(state, state.mode);

    case "SKIP":
      return switchMode(state, state.mode === "foco" ? "pausa" : "foco");

    case "SET_MODE":
      return switchMode(state, action.mode);

    default:
      return state;
  }
}

export function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}