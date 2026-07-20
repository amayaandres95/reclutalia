import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// Multi-página: la plataforma (index.html → /) y la landing promocional (landing.html → /landing).
// El proyecto es ESM: rutas con fileURLToPath(new URL(...)), no __dirname.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        landing: fileURLToPath(new URL("./landing.html", import.meta.url)),
      },
    },
  },
});
