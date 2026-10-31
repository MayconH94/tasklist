import { defineConfig } from "vite";
import React from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  base: "./", // o app empacotado (Electron) carrega os arquivos por caminho relativo
  plugins: [React(), tailwindcss()],
  // Porta fixa só deste projeto: se estiver ocupada, o Vite avisa em vez de
  // pular para outra porta (e você acabar abrindo outro projeto).
  server: { port: 5180, strictPort: true },
});