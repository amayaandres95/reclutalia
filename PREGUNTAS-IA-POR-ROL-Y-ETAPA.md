# Preguntas predefinidas por ROL y ETAPA — para integrar en el chat con IA

> **Documento de entrega (input para otro chat de Claude Code).**
> Contiene el catálogo completo de preguntas predefinidas que hoy vive en la rama `main`
> del prototipo **Reclutalia** (`reclutalia/src/App.jsx`), extraído para que otro desarrollo
> —que ya tiene su propio chat con IA— las integre como **preguntas sugeridas que se le pueden
> hacer automáticamente a la IA**, cambiando según la **etapa** en la que se encuentra el
> **candidato**, el **formador** o el **administrador**.

---

## 1. Qué es esto y qué se pide integrar

En Reclutalia existe un **asistente de soporte flotante** (`BotSoporte`) que muestra un set de
preguntas frecuentes **contextual**: el listado de preguntas **cambia automáticamente** según el
rol activo y la etapa/pantalla en la que está la persona. Ese catálogo es la constante
**`BOT_FAQ`** y se resuelve con `faqPara(ctxKey)`, donde `ctxKey` se calcula en tiempo real
(`botCtx`) a partir del **rol + estado del pipeline / vista actual**.

**Lo que se pide al otro branch:** tomar este catálogo (rol → etapa → preguntas) e integrarlo en
su chat con IA de modo que, según la etapa detectada del usuario, se ofrezcan **exactamente estas
preguntas** como sugerencias que el usuario puede lanzar a la IA con un clic (chips / quick
replies). Cada pregunta trae una **respuesta de referencia** (la que hoy da el prototipo), útil
como *grounding* / respuesta base para la IA.

### Cómo se decide la etapa (lógica de `botCtx`, referencia)

- **Candidato:** si está en "Buscar vacantes" → `cand_buscar`. Si no tiene procesos → `cand_sin`.
  Si tiene procesos, se toma el proceso **más avanzado** y su estado del pipeline define la clave
  `cand_<estado>`. Si el proceso está cerrado (descartado/filtrado/rechazado) → `cand_cerrado`.
- **Formador:** en Notificaciones → `form_notif`. Dentro de una vacante → `form_sub<subpaso>`
  (0–6, según el sub-paso de las 3 fases del proceso). En cualquier otra vista → `form_home`.
- **Administrador:** en Notificaciones → `admin_notif`. En otras vistas → `admin_<vista>`
  (`vacantes`, `nueva`, `candidatos`).
- Si no hay coincidencia → set `default`.

### Catálogo de etapas del pipeline del candidato (para referencia de mapeo)

`invitado → postulado → filtros_ok → evaluado (video-IA) → slots_enviados → agendado →
entrevistado → seleccionado → docs_completos → oferta_enviada → contratado`
(estados terminales: `filtrado`, `descartado`, `rechazado` → se agrupan como "proceso cerrado").

### Sub-pasos del proceso del formador (3 fases)

| subpaso | Fase | Sub-paso |
|---|---|---|
| 0 | Búsqueda | Descriptivo |
| 1 | Búsqueda | Pool de talento |
| 2 | Selección | Ranking y terna |
| 3 | Selección | Entrevistas |
| 4 | Selección | Selección y documentos |
| 5 | Contratación | Carta oferta |
| 6 | Contratación | Contratación |

---

## 2. Catálogo de preguntas por ROL y ETAPA (legible)

### 2.0 · General (fallback — `default`)
*Se muestra cuando no aplica ninguna etapa específica.*

1. **¿Qué es Reclutalia?**
   Es la plataforma para cubrir vacantes de forma autónoma y auto-gestionable, con apoyo de IA en la búsqueda, el filtrado y las entrevistas. Tú, como jefe directo, gestionas todo el proceso.
2. **¿Cómo cambio de rol en la demo?**
   En el menú lateral (o el cajón hamburguesa en móvil) usa 'VISTA DEMO — CAMBIAR ROL' para alternar entre Formador, Administrador y Candidato.

---

### 2.1 · CANDIDATO

#### Etapa: Sin postulaciones activas — `cand_sin`
1. **¿Cómo empiezo a buscar vacantes?** — Entra a 'Buscar vacantes' en el menú. Verás las vacantes abiertas con tu porcentaje de compatibilidad; puedes filtrar por ubicación, nivel, área y sueldo, guardar favoritas con el corazón y postularte directo.
2. **¿Conviene completar mi perfil primero?** — Sí. Toca tu avatar (arriba a la derecha) para abrir 'Editar perfil': completa experiencia, educación, habilidades y sube tus documentos (INE, CURP, RFC, comprobantes). Esos datos se reutilizan al postularte.
3. **¿Cómo mejoro mi compatibilidad?** — El match compara tus especialidades, herramientas, habilidades, nivel, experiencia y ubicación contra cada vacante. Mientras más completo y preciso tu perfil, mejor tu porcentaje.

#### Etapa: Buscando vacantes — `cand_buscar`
1. **¿Qué significa el porcentaje de cada vacante?** — Es tu compatibilidad estimada (0–100%) según cómo embona tu perfil con el descriptivo: especialidades, herramientas, habilidades, nivel, experiencia, ubicación y modalidad.
2. **¿Cómo me postulo?** — Abre el detalle de la vacante y usa 'Aplicar'. Si tiene preguntas filtro (killer questions), respóndelas; si cumples, tu postulación llega al formador.
3. **¿Para qué sirve el corazón?** — Guarda la vacante en tus favoritos para volver a ella fácilmente. No te postula todavía; solo la marca.
4. **No veo el código de la vacante** — Por diseño no mostramos el código interno en la búsqueda; te guías por el título, el área y la ubicación.

#### Etapa: Invitado a un proceso — `cand_invitado`
1. **Me invitaron a un proceso, ¿qué hago?** — Un formador te invitó a su vacante. Revisa el detalle y confirma tu interés postulándote; si no te interesa, puedes rechazar la invitación.
2. **¿Puedo rechazar la invitación?** — Sí. En la invitación encontrarás la opción para rechazarla; el motivo es opcional y el formador será notificado.

#### Etapa: Postulado / filtros iniciales — `cand_postulado`
1. **¿Qué documentos piden en los filtros iniciales?** — Constancias de tus empleos previos (uno o varios PDF) y el examen psicométrico. También debes marcar la casilla de autorización para validar tu información.
2. **¿El examen psicométrico caduca?** — Tiene vigencia de 6 meses. Si ya lo realizaste para otra vacante dentro de ese periodo, se reutiliza automáticamente.
3. **¿Cuándo puedo enviar a validación?** — El botón 'Enviar a validación automática' se habilita con al menos una constancia, tu psicométrico vigente y la casilla de autorización marcada.

#### Etapa: Filtros superados (pre video-entrevista) — `cand_filtros_ok`
1. **Pasé los filtros, ¿qué sigue?** — Sigue tu video-entrevista con IA: respondes unas preguntas grabadas y la IA analiza tus respuestas para actualizar tu ranking en la vacante.
2. **¿Es obligatoria la video-entrevista?** — Es el paso para que el formador te considere en su terna. Puedes hacerla desde tu panel cuando estés listo, en un lugar tranquilo y con buena conexión.

#### Etapa: Video-entrevista completada / en ranking — `cand_evaluado`
1. **Terminé la video-entrevista, ¿ahora qué?** — El formador revisa a los mejores perfiles (su terna). Si avanzas, recibirás una invitación con horarios para entrevistarte con él.
2. **¿Puedo ver mi nuevo ranking?** — Tu compatibilidad se actualiza tras la video-entrevista. El detalle del ranking lo administra el formador; tú verás tu avance en 'Mis procesos'.

#### Etapa: Horarios de entrevista recibidos — `cand_slots_enviados`
1. **El formador me envió horarios, ¿cómo elijo?** — En 'Mis procesos' verás 3 horarios propuestos. Elige el que te convenga; se generará automáticamente la reunión de Teams y ambos recibirán el enlace.
2. **¿Qué pasa si un horario ya no está disponible?** — Si otro candidato tomó ese horario, aparecerá como 'No disponible'. Simplemente elige otro de los horarios libres.

#### Etapa: Entrevista agendada — `cand_agendado`
1. **Ya agendé mi entrevista, ¿dónde está el enlace?** — Dentro de tu proceso, en 'Mis procesos', encontrarás el enlace de Teams. Conéctate a la hora acordada.
2. **¿Puedo reagendar o dudar algo con el formador?** — Sí. Usa la pestaña 'Mensajes' de este asistente para escribirle directamente al formador de tu proceso.

#### Etapa: Entrevistado (esperando decisión) — `cand_entrevistado`
1. **Ya me entrevisté, ¿cuándo sabré el resultado?** — El formador registra su retroalimentación y su decisión. Si eres seleccionado, se te pedirá completar tu documentación; te llegará una notificación.

#### Etapa: Seleccionado / documentación — `cand_seleccionado`
1. **¡Me seleccionaron! ¿Qué documentos subo?** — INE, CURP, RFC, comprobante de domicilio y comprobante de estudios (PDF, máx 1 MB c/u), más tu cuenta bancaria para nómina. Si la vacante lo requiere, también agendarás tu examen médico.
2. **¿Cómo registro mi cuenta bancaria?** — En el checklist usa 'Ingresar/editar número de cuenta' y captura tu número de cuenta o CLABE. Si no tienes cuenta, puedes abrir una desde el mismo panel.
3. **¿Cómo agendo el examen médico?** — Cuando la vacante lo pide, captura tu ubicación, busca sucursales, elige una y una fecha de la próxima semana. El formador validará el resultado positivo.

#### Etapa: Documentación completa — `cand_docs_completos`
1. **Ya completé mi documentación, ¿qué sigue?** — El formador revisa que todo esté en orden y te enviará la carta oferta con el sueldo, la fecha de ingreso y la ubicación de presentación.

#### Etapa: Carta oferta recibida — `cand_oferta_enviada`
1. **Recibí mi carta oferta, ¿qué incluye?** — El puesto, el sueldo, tu fecha de ingreso y la ubicación donde te presentarás el primer día (con enlace a Google Maps). Revísala con calma.
2. **¿Cómo acepto la oferta?** — Desde tu panel confirmas la oferta. A partir de ahí recibirás tu bienvenida y los detalles de tu primer día.

#### Etapa: Contratado — `cand_contratado`
1. **¡Ya estoy contratado! ¿Cuándo y dónde me presento?** — En tu bienvenida verás tu fecha de ingreso y la ubicación de presentación con enlace a Google Maps. La firma del contrato es presencial ese primer día.
2. **¿Qué llevo el primer día?** — Tus documentos originales. Recibirás también el kit de inducción y la guía de bienvenida.

#### Etapa: Proceso cerrado — `cand_cerrado`
1. **Mi proceso se cerró, ¿puedo aplicar a otra vacante?** — Claro, y agradecemos tu participación. En 'Buscar vacantes' encontrarás otras oportunidades acordes a tu perfil.
2. **¿Puedo ver retroalimentación?** — En 'Mis procesos' usa 'Ver mi feedback' para conocer los comentarios de tu entrevista, cuando estén disponibles.

---

### 2.2 · FORMADOR

#### Etapa: Inicio / Mis vacantes — `form_home`
1. **¿Qué veo en 'Mis vacantes'?** — El listado de las vacantes asignadas a ti, con su etapa actual del proceso. Ábrelas para gestionarlas paso a paso.
2. **¿Cómo funciona el proceso?** — Son 3 fases: Búsqueda (descriptivo y pool), Selección (ranking, entrevistas y documentos) y Contratación (carta oferta y alta). La barra de fases te ubica en cada paso.

#### Etapa: Notificaciones — `form_notif`
1. **¿Qué notificaciones recibo?** — Cuando se te asigna una vacante, cuando un candidato acepta un horario, completa filtros, sube documentos o acepta tu oferta. Toca una notificación para ir a la vacante.

#### Etapa: Búsqueda · Descriptivo — `form_sub0`
1. **¿Puedo cambiar el descriptivo de la vacante?** — Sí. Antes de aprobarla, solicita cambios por campo al administrador desde la pestaña Descriptivo; puedes anotar cada ajuste y enviarlos a revisión.
2. **¿Cómo inicio la búsqueda?** — Cuando el descriptivo esté correcto, aprueba la vacante. La IA comenzará a buscar, filtrar y ranquear candidatos en tu pool.

#### Etapa: Búsqueda · Pool de talento — `form_sub1`
1. **¿Qué es el pool de talento?** — Es el marketplace de candidatos internos y externos que la IA busca, filtra y ranquea para tu vacante al aprobarla.
2. **¿Cómo organizo a los candidatos?** — Puedes marcarlos como favoritos, agruparlos en categorías, archivar los que no te interesan y filtrar por habilidades, experiencia mínima, estudios o tipo (interno/externo).
3. **¿Y si quiero más candidatos?** — Usa 'Solicitar más candidatos'; puedes activar Multiposting para ampliar la difusión de la vacante a plataformas de terceros (simulado).
4. **¿Cómo invito a alguien?** — Abre el perfil del candidato y usa la invitación directa; entrará a tu proceso y podrás avanzarlo por las etapas.

#### Etapa: Selección · Ranking y terna — `form_sub2`
1. **¿Cómo leo el ranking?** — Las bandas son: ideales (≥90%), adecuados (70–89%) y adicionales (<70%). El porcentaje combina el descriptivo con el perfil y la video-entrevista de IA.
2. **¿Puedo ver la video-entrevista de IA?** — Sí. En 'Ranking y terna' usa 'Ver entrevista IA' para revisar la grabación y el resumen automático de cada candidato.

#### Etapa: Selección · Entrevistas — `form_sub3`
1. **¿Cómo agendo entrevistas?** — Invitas al candidato y propones 3 horarios conectando tu Outlook/Teams (simulado). El candidato confirma uno y se genera la reunión.
2. **¿Cómo registro la entrevista?** — Durante la entrevista la IA toma notas; tú agregas las tuyas, das una calificación y tu retroalimentación. Eso actualiza el ranking final del candidato.

#### Etapa: Selección · Selección y documentos — `form_sub4`
1. **¿Cómo selecciono al candidato ideal?** — Compara tu terna y elige al candidato. Se le pedirá automáticamente subir su documentación, con recordatorios.
2. **¿Qué reviso de su documentación?** — Ves su checklist (INE, CURP, RFC, domicilio, estudios y cuenta bancaria) en solo lectura. Si la vacante pide examen médico, validas aquí el resultado positivo.

#### Etapa: Contratación · Carta oferta — `form_sub5`
1. **¿Cómo genero la carta oferta?** — Se arma desde el tabulador de la vacante: defines el sueldo, la fecha de ingreso y la ubicación de presentación del primer día. El candidato la recibe al instante.

#### Etapa: Contratación · Contratación — `form_sub6`
1. **¿Qué pasa cuando el candidato acepta?** — Queda contratado. Verás la confirmación con su fecha de ingreso y ubicación (con enlace a Google Maps). La firma del contrato es presencial el primer día.

---

### 2.3 · ADMINISTRADOR (RH)

#### Etapa: Vacantes — `admin_vacantes`
1. **¿Qué administro aquí?** — El catálogo de vacantes: creas nuevas, revisas sus datos y atiendes las solicitudes de cambio que envían los formadores.
2. **¿Cómo atiendo una solicitud de cambios?** — Cuando un formador pide ajustes por campo, los revisas uno a uno y los aceptas o rechazas; el historial queda registrado y el formador es notificado al reenviar.

#### Etapa: Nueva vacante — `admin_nueva`
1. **¿Qué datos lleva una vacante?** — Título, área, nivel, sede, unidad, tipo de contratación, rango de edad, especialidades, habilidades, herramientas, sueldo y condiciones (por ejemplo, si requiere examen médico). El formulario valida por sección.
2. **¿Qué son los campos 'no relevantes'?** — Son requisitos que marcas como no determinantes para el match, de modo que no penalicen a candidatos que no los cumplan.

#### Etapa: Pool de candidatos — `admin_candidatos`
1. **¿Qué veo en el pool de candidatos?** — El padrón de candidatos internos y externos preregistrados que alimenta el match de las vacantes. Puedes darlos de alta y editarlos.

#### Etapa: Notificaciones — `admin_notif`
1. **¿Qué notificaciones recibe el administrador?** — Avisos relacionados con las vacantes que administras, como solicitudes de cambio de los formadores. Toca una para ir al detalle.

---

## 3. Datos listos para integrar (JSON)

> Estructura sugerida para consumir programáticamente. `role` = rol; `stageKey` = la clave de
> etapa (`ctxKey`); `stageLabel` = etiqueta legible; `trigger` = condición que activa esa etapa;
> `questions[]` = `{ q, a }` donde `q` es la pregunta sugerida y `a` la respuesta de referencia.

```json
{
  "meta": {
    "source": "reclutalia/src/App.jsx · const BOT_FAQ / faqPara(ctxKey)",
    "branch": "main",
    "descripcion": "Preguntas predefinidas contextuales por rol y etapa. El set cambia automáticamente según rol + estado del pipeline / vista.",
    "pipelineCandidato": ["invitado","postulado","filtros_ok","evaluado","slots_enviados","agendado","entrevistado","seleccionado","docs_completos","oferta_enviada","contratado","(cerrado: filtrado|descartado|rechazado)"],
    "subpasosFormador": {"0":"Búsqueda·Descriptivo","1":"Búsqueda·Pool de talento","2":"Selección·Ranking y terna","3":"Selección·Entrevistas","4":"Selección·Selección y documentos","5":"Contratación·Carta oferta","6":"Contratación·Contratación"}
  },
  "sets": [
    {
      "role": "general",
      "stageKey": "default",
      "stageLabel": "General (fallback)",
      "trigger": "Ninguna etapa específica coincide",
      "questions": [
        {"q": "¿Qué es Reclutalia?", "a": "Es la plataforma para cubrir vacantes de forma autónoma y auto-gestionable, con apoyo de IA en la búsqueda, el filtrado y las entrevistas. Tú, como jefe directo, gestionas todo el proceso."},
        {"q": "¿Cómo cambio de rol en la demo?", "a": "En el menú lateral (o el cajón hamburguesa en móvil) usa 'VISTA DEMO — CAMBIAR ROL' para alternar entre Formador, Administrador y Candidato."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_sin",
      "stageLabel": "Sin postulaciones activas",
      "trigger": "Candidato sin procesos en el pipeline",
      "questions": [
        {"q": "¿Cómo empiezo a buscar vacantes?", "a": "Entra a 'Buscar vacantes' en el menú. Verás las vacantes abiertas con tu porcentaje de compatibilidad; puedes filtrar por ubicación, nivel, área y sueldo, guardar favoritas con el corazón y postularte directo."},
        {"q": "¿Conviene completar mi perfil primero?", "a": "Sí. Toca tu avatar (arriba a la derecha) para abrir 'Editar perfil': completa experiencia, educación, habilidades y sube tus documentos (INE, CURP, RFC, comprobantes). Esos datos se reutilizan al postularte."},
        {"q": "¿Cómo mejoro mi compatibilidad?", "a": "El match compara tus especialidades, herramientas, habilidades, nivel, experiencia y ubicación contra cada vacante. Mientras más completo y preciso tu perfil, mejor tu porcentaje."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_buscar",
      "stageLabel": "Buscando vacantes",
      "trigger": "Vista 'Buscar vacantes'",
      "questions": [
        {"q": "¿Qué significa el porcentaje de cada vacante?", "a": "Es tu compatibilidad estimada (0–100%) según cómo embona tu perfil con el descriptivo: especialidades, herramientas, habilidades, nivel, experiencia, ubicación y modalidad."},
        {"q": "¿Cómo me postulo?", "a": "Abre el detalle de la vacante y usa 'Aplicar'. Si tiene preguntas filtro (killer questions), respóndelas; si cumples, tu postulación llega al formador."},
        {"q": "¿Para qué sirve el corazón?", "a": "Guarda la vacante en tus favoritos para volver a ella fácilmente. No te postula todavía; solo la marca."},
        {"q": "No veo el código de la vacante", "a": "Por diseño no mostramos el código interno en la búsqueda; te guías por el título, el área y la ubicación."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_invitado",
      "stageLabel": "Invitado a un proceso",
      "trigger": "Estado del pipeline: invitado",
      "questions": [
        {"q": "Me invitaron a un proceso, ¿qué hago?", "a": "Un formador te invitó a su vacante. Revisa el detalle y confirma tu interés postulándote; si no te interesa, puedes rechazar la invitación."},
        {"q": "¿Puedo rechazar la invitación?", "a": "Sí. En la invitación encontrarás la opción para rechazarla; el motivo es opcional y el formador será notificado."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_postulado",
      "stageLabel": "Postulado / filtros iniciales",
      "trigger": "Estado del pipeline: postulado",
      "questions": [
        {"q": "¿Qué documentos piden en los filtros iniciales?", "a": "Constancias de tus empleos previos (uno o varios PDF) y el examen psicométrico. También debes marcar la casilla de autorización para validar tu información."},
        {"q": "¿El examen psicométrico caduca?", "a": "Tiene vigencia de 6 meses. Si ya lo realizaste para otra vacante dentro de ese periodo, se reutiliza automáticamente."},
        {"q": "¿Cuándo puedo enviar a validación?", "a": "El botón 'Enviar a validación automática' se habilita con al menos una constancia, tu psicométrico vigente y la casilla de autorización marcada."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_filtros_ok",
      "stageLabel": "Filtros superados (pre video-entrevista)",
      "trigger": "Estado del pipeline: filtros_ok",
      "questions": [
        {"q": "Pasé los filtros, ¿qué sigue?", "a": "Sigue tu video-entrevista con IA: respondes unas preguntas grabadas y la IA analiza tus respuestas para actualizar tu ranking en la vacante."},
        {"q": "¿Es obligatoria la video-entrevista?", "a": "Es el paso para que el formador te considere en su terna. Puedes hacerla desde tu panel cuando estés listo, en un lugar tranquilo y con buena conexión."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_evaluado",
      "stageLabel": "Video-entrevista completada / en ranking",
      "trigger": "Estado del pipeline: evaluado",
      "questions": [
        {"q": "Terminé la video-entrevista, ¿ahora qué?", "a": "El formador revisa a los mejores perfiles (su terna). Si avanzas, recibirás una invitación con horarios para entrevistarte con él."},
        {"q": "¿Puedo ver mi nuevo ranking?", "a": "Tu compatibilidad se actualiza tras la video-entrevista. El detalle del ranking lo administra el formador; tú verás tu avance en 'Mis procesos'."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_slots_enviados",
      "stageLabel": "Horarios de entrevista recibidos",
      "trigger": "Estado del pipeline: slots_enviados",
      "questions": [
        {"q": "El formador me envió horarios, ¿cómo elijo?", "a": "En 'Mis procesos' verás 3 horarios propuestos. Elige el que te convenga; se generará automáticamente la reunión de Teams y ambos recibirán el enlace."},
        {"q": "¿Qué pasa si un horario ya no está disponible?", "a": "Si otro candidato tomó ese horario, aparecerá como 'No disponible'. Simplemente elige otro de los horarios libres."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_agendado",
      "stageLabel": "Entrevista agendada",
      "trigger": "Estado del pipeline: agendado",
      "questions": [
        {"q": "Ya agendé mi entrevista, ¿dónde está el enlace?", "a": "Dentro de tu proceso, en 'Mis procesos', encontrarás el enlace de Teams. Conéctate a la hora acordada."},
        {"q": "¿Puedo reagendar o dudar algo con el formador?", "a": "Sí. Usa la pestaña 'Mensajes' de este asistente para escribirle directamente al formador de tu proceso."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_entrevistado",
      "stageLabel": "Entrevistado (esperando decisión)",
      "trigger": "Estado del pipeline: entrevistado",
      "questions": [
        {"q": "Ya me entrevisté, ¿cuándo sabré el resultado?", "a": "El formador registra su retroalimentación y su decisión. Si eres seleccionado, se te pedirá completar tu documentación; te llegará una notificación."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_seleccionado",
      "stageLabel": "Seleccionado / documentación",
      "trigger": "Estado del pipeline: seleccionado",
      "questions": [
        {"q": "¡Me seleccionaron! ¿Qué documentos subo?", "a": "INE, CURP, RFC, comprobante de domicilio y comprobante de estudios (PDF, máx 1 MB c/u), más tu cuenta bancaria para nómina. Si la vacante lo requiere, también agendarás tu examen médico."},
        {"q": "¿Cómo registro mi cuenta bancaria?", "a": "En el checklist usa 'Ingresar/editar número de cuenta' y captura tu número de cuenta o CLABE. Si no tienes cuenta, puedes abrir una desde el mismo panel."},
        {"q": "¿Cómo agendo el examen médico?", "a": "Cuando la vacante lo pide, captura tu ubicación, busca sucursales, elige una y una fecha de la próxima semana. El formador validará el resultado positivo."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_docs_completos",
      "stageLabel": "Documentación completa",
      "trigger": "Estado del pipeline: docs_completos",
      "questions": [
        {"q": "Ya completé mi documentación, ¿qué sigue?", "a": "El formador revisa que todo esté en orden y te enviará la carta oferta con el sueldo, la fecha de ingreso y la ubicación de presentación."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_oferta_enviada",
      "stageLabel": "Carta oferta recibida",
      "trigger": "Estado del pipeline: oferta_enviada / oferta_aceptada",
      "questions": [
        {"q": "Recibí mi carta oferta, ¿qué incluye?", "a": "El puesto, el sueldo, tu fecha de ingreso y la ubicación donde te presentarás el primer día (con enlace a Google Maps). Revísala con calma."},
        {"q": "¿Cómo acepto la oferta?", "a": "Desde tu panel confirmas la oferta. A partir de ahí recibirás tu bienvenida y los detalles de tu primer día."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_contratado",
      "stageLabel": "Contratado",
      "trigger": "Estado del pipeline: contratado",
      "questions": [
        {"q": "¡Ya estoy contratado! ¿Cuándo y dónde me presento?", "a": "En tu bienvenida verás tu fecha de ingreso y la ubicación de presentación con enlace a Google Maps. La firma del contrato es presencial ese primer día."},
        {"q": "¿Qué llevo el primer día?", "a": "Tus documentos originales. Recibirás también el kit de inducción y la guía de bienvenida."}
      ]
    },
    {
      "role": "candidato",
      "stageKey": "cand_cerrado",
      "stageLabel": "Proceso cerrado",
      "trigger": "Estado terminal: filtrado / descartado / rechazado",
      "questions": [
        {"q": "Mi proceso se cerró, ¿puedo aplicar a otra vacante?", "a": "Claro, y agradecemos tu participación. En 'Buscar vacantes' encontrarás otras oportunidades acordes a tu perfil."},
        {"q": "¿Puedo ver retroalimentación?", "a": "En 'Mis procesos' usa 'Ver mi feedback' para conocer los comentarios de tu entrevista, cuando estén disponibles."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_home",
      "stageLabel": "Inicio / Mis vacantes",
      "trigger": "Vista inicio (Mis vacantes)",
      "questions": [
        {"q": "¿Qué veo en 'Mis vacantes'?", "a": "El listado de las vacantes asignadas a ti, con su etapa actual del proceso. Ábrelas para gestionarlas paso a paso."},
        {"q": "¿Cómo funciona el proceso?", "a": "Son 3 fases: Búsqueda (descriptivo y pool), Selección (ranking, entrevistas y documentos) y Contratación (carta oferta y alta). La barra de fases te ubica en cada paso."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_notif",
      "stageLabel": "Notificaciones",
      "trigger": "Vista Notificaciones",
      "questions": [
        {"q": "¿Qué notificaciones recibo?", "a": "Cuando se te asigna una vacante, cuando un candidato acepta un horario, completa filtros, sube documentos o acepta tu oferta. Toca una notificación para ir a la vacante."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub0",
      "stageLabel": "Búsqueda · Descriptivo",
      "trigger": "Vacante en subpaso 0",
      "questions": [
        {"q": "¿Puedo cambiar el descriptivo de la vacante?", "a": "Sí. Antes de aprobarla, solicita cambios por campo al administrador desde la pestaña Descriptivo; puedes anotar cada ajuste y enviarlos a revisión."},
        {"q": "¿Cómo inicio la búsqueda?", "a": "Cuando el descriptivo esté correcto, aprueba la vacante. La IA comenzará a buscar, filtrar y ranquear candidatos en tu pool."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub1",
      "stageLabel": "Búsqueda · Pool de talento",
      "trigger": "Vacante en subpaso 1",
      "questions": [
        {"q": "¿Qué es el pool de talento?", "a": "Es el marketplace de candidatos internos y externos que la IA busca, filtra y ranquea para tu vacante al aprobarla."},
        {"q": "¿Cómo organizo a los candidatos?", "a": "Puedes marcarlos como favoritos, agruparlos en categorías, archivar los que no te interesan y filtrar por habilidades, experiencia mínima, estudios o tipo (interno/externo)."},
        {"q": "¿Y si quiero más candidatos?", "a": "Usa 'Solicitar más candidatos'; puedes activar Multiposting para ampliar la difusión de la vacante a plataformas de terceros (simulado)."},
        {"q": "¿Cómo invito a alguien?", "a": "Abre el perfil del candidato y usa la invitación directa; entrará a tu proceso y podrás avanzarlo por las etapas."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub2",
      "stageLabel": "Selección · Ranking y terna",
      "trigger": "Vacante en subpaso 2",
      "questions": [
        {"q": "¿Cómo leo el ranking?", "a": "Las bandas son: ideales (≥90%), adecuados (70–89%) y adicionales (<70%). El porcentaje combina el descriptivo con el perfil y la video-entrevista de IA."},
        {"q": "¿Puedo ver la video-entrevista de IA?", "a": "Sí. En 'Ranking y terna' usa 'Ver entrevista IA' para revisar la grabación y el resumen automático de cada candidato."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub3",
      "stageLabel": "Selección · Entrevistas",
      "trigger": "Vacante en subpaso 3",
      "questions": [
        {"q": "¿Cómo agendo entrevistas?", "a": "Invitas al candidato y propones 3 horarios conectando tu Outlook/Teams (simulado). El candidato confirma uno y se genera la reunión."},
        {"q": "¿Cómo registro la entrevista?", "a": "Durante la entrevista la IA toma notas; tú agregas las tuyas, das una calificación y tu retroalimentación. Eso actualiza el ranking final del candidato."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub4",
      "stageLabel": "Selección · Selección y documentos",
      "trigger": "Vacante en subpaso 4",
      "questions": [
        {"q": "¿Cómo selecciono al candidato ideal?", "a": "Compara tu terna y elige al candidato. Se le pedirá automáticamente subir su documentación, con recordatorios."},
        {"q": "¿Qué reviso de su documentación?", "a": "Ves su checklist (INE, CURP, RFC, domicilio, estudios y cuenta bancaria) en solo lectura. Si la vacante pide examen médico, validas aquí el resultado positivo."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub5",
      "stageLabel": "Contratación · Carta oferta",
      "trigger": "Vacante en subpaso 5",
      "questions": [
        {"q": "¿Cómo genero la carta oferta?", "a": "Se arma desde el tabulador de la vacante: defines el sueldo, la fecha de ingreso y la ubicación de presentación del primer día. El candidato la recibe al instante."}
      ]
    },
    {
      "role": "formador",
      "stageKey": "form_sub6",
      "stageLabel": "Contratación · Contratación",
      "trigger": "Vacante en subpaso 6",
      "questions": [
        {"q": "¿Qué pasa cuando el candidato acepta?", "a": "Queda contratado. Verás la confirmación con su fecha de ingreso y ubicación (con enlace a Google Maps). La firma del contrato es presencial el primer día."}
      ]
    },
    {
      "role": "admin",
      "stageKey": "admin_vacantes",
      "stageLabel": "Vacantes",
      "trigger": "Vista Vacantes (inicio)",
      "questions": [
        {"q": "¿Qué administro aquí?", "a": "El catálogo de vacantes: creas nuevas, revisas sus datos y atiendes las solicitudes de cambio que envían los formadores."},
        {"q": "¿Cómo atiendo una solicitud de cambios?", "a": "Cuando un formador pide ajustes por campo, los revisas uno a uno y los aceptas o rechazas; el historial queda registrado y el formador es notificado al reenviar."}
      ]
    },
    {
      "role": "admin",
      "stageKey": "admin_nueva",
      "stageLabel": "Nueva vacante",
      "trigger": "Vista Nueva vacante",
      "questions": [
        {"q": "¿Qué datos lleva una vacante?", "a": "Título, área, nivel, sede, unidad, tipo de contratación, rango de edad, especialidades, habilidades, herramientas, sueldo y condiciones (por ejemplo, si requiere examen médico). El formulario valida por sección."},
        {"q": "¿Qué son los campos 'no relevantes'?", "a": "Son requisitos que marcas como no determinantes para el match, de modo que no penalicen a candidatos que no los cumplan."}
      ]
    },
    {
      "role": "admin",
      "stageKey": "admin_candidatos",
      "stageLabel": "Pool de candidatos",
      "trigger": "Vista Pool de candidatos",
      "questions": [
        {"q": "¿Qué veo en el pool de candidatos?", "a": "El padrón de candidatos internos y externos preregistrados que alimenta el match de las vacantes. Puedes darlos de alta y editarlos."}
      ]
    },
    {
      "role": "admin",
      "stageKey": "admin_notif",
      "stageLabel": "Notificaciones",
      "trigger": "Vista Notificaciones",
      "questions": [
        {"q": "¿Qué notificaciones recibe el administrador?", "a": "Avisos relacionados con las vacantes que administras, como solicitudes de cambio de los formadores. Toca una para ir al detalle."}
      ]
    }
  ]
}
```

---

## 4. (Anexo) Otros dos sets de preguntas de IA existentes en `main`

Además del catálogo contextual de arriba (el que se pide integrar), el prototipo tiene **otras dos
listas de preguntas relacionadas con IA** que **NO cambian por etapa del usuario**, sino que se
**generan dinámicamente** a partir de la vacante y el perfil del candidato durante las entrevistas.
Se incluyen aquí solo como referencia por si el otro desarrollo quiere reutilizarlas:

### 4.1 Preguntas sugeridas por la IA durante la entrevista en vivo (`EntrevistaModal` → `preguntasIA`)
Se generan con plantillas según la vacante/candidato:
1. `Cuéntame de un logro concreto como {puesto} y cómo lo mediste.`
2. `¿Cómo aplicarías {primera hard skill de la vacante} en los retos de este puesto?`
3. `Describe una situación donde demostraste {primera soft skill de la vacante}.`
4. `¿Qué te motiva de esta posición ({título de la vacante}) y del esquema {modalidad}?`
5. `¿Cuál es tu expectativa salarial y disponibilidad de ingreso?`

### 4.2 Preguntas de la video-entrevista con IA — primer filtro (`VideoIAResumenModal` → `preguntas`)
Guion de la transcripción simulada (pregunta + respuesta modelo generada del perfil):
1. `Preséntate: trayectoria, especialidad y lo que buscas en tu siguiente reto.`
2. `Cuéntame un proyecto donde aplicaste {hard skills de la vacante}.`
3. `¿Cómo describirías tu nivel en {especialidad requerida / área}?`
4. `Describe una situación difícil con un cliente o compañero y cómo la resolviste.`
5. `¿Por qué te interesa esta posición y qué disponibilidad tienes?`

> **Nota:** estas dos listas son para el **formador durante entrevistas** y son plantillas
> dinámicas, no un catálogo fijo por etapa. El pedido principal ("preguntas que cambian según la
> etapa del candidato/formador/administrador") corresponde a la **Sección 2/3 (`BOT_FAQ`)**.

---

## 5. Solicitud sugerida para el otro chat de Claude Code

> Copia/pega el siguiente encargo (junto con este archivo) en el otro branch:

**Encargo:** "Integra en nuestro chat con IA el catálogo de preguntas sugeridas por rol y etapa
del archivo `PREGUNTAS-IA-POR-ROL-Y-ETAPA.md` (Sección 3, JSON). El comportamiento esperado:
1. Detectar la **etapa actual** del usuario (rol + estado del pipeline / vista) siguiendo la lógica
   descrita en la Sección 1.
2. Mostrar como **sugerencias clicables** (chips / quick replies) únicamente las `questions[]` del
   `stageKey` correspondiente; si no hay match, usar el set `default`.
3. Al hacer clic en una pregunta, enviarla a la IA. Usar el campo `a` (respuesta de referencia)
   como *grounding* / respuesta base para asegurar consistencia con el prototipo.
4. Actualizar automáticamente el set de sugerencias cada vez que el usuario cambia de etapa.
Mantén el tono institucional en español de México. No hace falta conservar las respuestas textuales
si la IA genera respuestas equivalentes, pero las preguntas deben aparecer tal cual por etapa."
