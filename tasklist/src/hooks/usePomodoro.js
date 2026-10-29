import { useEffect, useReducer } from "react";
import {
  initialState,
  pomodoroReducer,
  secondsLeft,
} from "../lib/pomodoro";

export function usePomodoro() {
  const [state, dispatch] = useReducer(pomodoroReducer, undefined, initialState);

  // Enquanto roda, confere o relógio quatro vezes por segundo.
  useEffect(() => {
    if (!state.running) return;
    const id = setInterval(
      () => dispatch({ type: "TICK", now: Date.now() }),
      250,
    );
    return () => clearInterval(id);
  }, [state.running]);

  return {
    ...state,
    secondsLeft: secondsLeft(state),
    start: () => dispatch({ type: "START", now: Date.now() }),
    pause: () => dispatch({ type: "PAUSE", now: Date.now() }),
    reset: () => dispatch({ type: "RESET" }),
    skip: () => dispatch({ type: "SKIP" }),
    setMode: (mode) => dispatch({ type: "SET_MODE", mode }),
  };
}