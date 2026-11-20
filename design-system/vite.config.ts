import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Montada, a tela abre por arquivo dentro do aplicativo, então os caminhos são relativos
  base: command === "build" ? "./" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
    // Uma só cópia do React. O pacote da rolagem de conversa trazia a dele no pré-empacotamento
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    exclude: ["@shadcn/react"],
  },
  build: {
    rollupOptions: {
      input: { index: resolve(import.meta.dirname, "index.html"), app: resolve(import.meta.dirname, "app.html") },
    },
  },
}))
