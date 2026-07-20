/** Punto de entrada: arranca el servidor HTTP. */
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { API_PREFIX } from "./config/constants.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Reclutalia API escuchando en http://localhost:${env.port}${API_PREFIX}`);
});
