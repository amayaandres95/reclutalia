# PLAN DE CAMBIOS — Proceso del Candidato

Plan por batches para ejecutar en Claude Code. Cada batch es autocontenido y se ejecuta
en su propio turno. **Leer primero las Reglas generales.** Marcar cada batch como ✅ al
terminarlo (editar este archivo).

**Estado:** Batch 1 ✅ · Batch 2 ⬜ · Batch 3 ⬜ · Batch 4 ⬜ · Batch 5 ⬜ · Batch 6 ⬜

---

## Reglas generales (aplican a TODOS los batches)

1. Leer `CLAUDE.md` antes de empezar. Todo el código vive en `src/App.jsx`; ubicar secciones
   por sus banners de comentario `/* ===== ... ===== */`.
2. Respetar las convenciones existentes: UI 100% en español de México, tono institucional;
   mutaciones de estado solo vía `run(...)`; acciones nuevas dentro del objeto `ACT`;
   índigo `--ai` solo para IA; reutilizar clases CSS y componentes existentes
   (`Modal`, `Chip`, `TagPicker`, `UploadPDF`, `trow`, `check-item`, etc.).
3. El motor de match (`matchScore`) debe seguir siendo determinístico y sus entradas
   (`c.esp`, `c.hard`, `c.soft`, `c.nivel`, `c.exp`, `c.ciudad`, `c.modalidad`) no deben
   romperse. Si un batch agrega campos al candidato, son ADICIONALES.
4. Al terminar cada batch:
   a. Verificar que `npm run dev` compile y corra sin errores ni warnings de consola.
   b. Probar en el navegador el flujo afectado (rol Candidato y los botones ⚡ de simulación).
   c. **Actualizar `CLAUDE.md`** si el batch cambió: mapa de secciones de App.jsx, estados del
      pipeline, campos del modelo de datos, nuevas vistas del sidebar, o convenciones.
   d. **Actualizar este archivo** marcando el batch como ✅.
   e. Resumir los cambios y ESPERAR confirmación del usuario antes de `git commit` / `git push`.
5. No hacer cambios fuera del alcance del batch en turno. Si algo del batch entra en
   conflicto con código existente, proponer la solución y preguntar antes de decidir.

### Glosario de pantallas (para evitar ambigüedad)

- **"Documentos de filtros iniciales"** = pantalla del candidato en estados `postulado`/`filtros_ok`
  (hoy pide 2 documentos: buró y historial). El usuario la llama "paso 2 de 2".
- **"Checklist de contratación"** = pantalla del candidato en estados `seleccionado`/`docs_completos`
  (INE, CURP, RFC, domicilio, estudios). El usuario la llama "paso 8".
- **"Pantalla de bienvenida"** = estado `contratado` (celebración). El usuario la llama "paso 11 de 11".

---

## BATCH 1 — Ajustes rápidos de texto y filtros ✅

Cambios pequeños y de bajo riesgo (puntos 1, 2 y 6 del listado original).

**1.1 Renombrar "Mi proceso" → "Mis procesos".**
En el sidebar del rol candidato (`NavItem` en la sección `APP`) y en el mapa `titulos`
(clave `inicio` para rol candidato). Verificar que no quede ninguna otra mención singular.

**1.2 Filtro de procesos en "Mis procesos" (`CandidatoHome`).**
Agregar arriba de la lista un filtro con 3 opciones tipo pestañas o chips: **Todos** (default),
**Activos** y **Cerrados**.
- Activos = procesos en curso: estados con `PIPE_IDX >= 0` excepto `contratado`.
- Cerrados = procesos concluidos: `contratado`, `descartado`, `filtrado`.
- Mostrar contador por categoría (ej. "Activos (2)"). Si un filtro queda vacío, mostrar un
  estado vacío amable.

**1.3 Nota de apoyo en TODAS las cargas de PDF.**
En el componente `UploadPDF` (sección `SUBIDA DE ARCHIVO`), agregar debajo del texto de ayuda
existente la nota: *"Puedes convertir y comprimir tus archivos utilizando herramientas
gratuitas en línea."* — con estilo discreto (clase `help`). Al estar en el componente compartido,
aplica automáticamente a todas las pantallas que suben PDF.

**1.4 Cierre positivo en verde — lado candidato.**
En "Mis procesos" (`CandidatoHome`), cuando el proceso del candidato está en estado
`contratado`, la tarjeta (`.card`) de ese proceso debe tener **borde verde** usando los verdes
existentes de estado (`--ok` #1E7A3C / `--ok-soft` #E7F4EB — mismos tonos que los chips de
estado exitoso). Opcionalmente un fondo verde muy sutil (`--ok-soft` o similar) para reforzar.
Así, aunque aparezca bajo el filtro "Cerrados", queda claro que fue un proceso positivo.
Los procesos cerrados negativos (`descartado`/`filtrado`) conservan su estilo actual.

**1.5 Cierre positivo en verde — lado formador.**
Cuando una vacante tiene estado `cerrada` (cubierta):
- La tarjeta de la vacante debe verse con **borde verde** (mismos tonos `--ok`/`--ok-soft`),
  tanto en la lista de `FormadorHome` como en la tarjeta de encabezado de `VacanteDetail`.
  Aplicar el mismo criterio en la lista de vacantes del Admin para consistencia.
- La **barra del journey (`JourneyBar`) debe mostrarse 100% completa** (las 10 etapas llenas,
  sin segmento parcial) **y en color verde** en lugar de dorado. Implementarlo como prop o
  estado del componente (ej. `completa`) activado cuando `v.estado === "cerrada"`, de modo que
  aplique también a la versión compacta (Admin) sin duplicar lógica.

**Commit sugerido:** `Candidato: renombrar Mis procesos, filtro Todos/Activos/Cerrados, nota de ayuda en PDFs y cierre positivo en verde`

---

## BATCH 2 — Perfil editable del candidato + Mis documentos ⬜

(Punto 4.) Funcionalidad nueva grande. **Recomendado ejecutar en modo plan primero.**

**2.1 Acceso.** En el `topbar`, cuando el rol es candidato, el bloque de avatar + nombre debe
ser clickeable y abrir el editor de perfil (modal `wide` o vista dedicada, decidir según lo que
mejor se integre). Agregar también un botón visible "Editar perfil".

**2.2 Editor de perfil — pestaña "Mi perfil".** Secciones en este orden visual (sin numerarlas
en la UI):

| Sección | Especificación |
|---|---|
| Nombre completo | Input de texto. Texto de ayuda: debe ser su nombre tal cual aparece en su identificación oficial. Edita `c.nombre`. |
| Título | Input. Placeholder con ejemplo: "Ejecutivo de ventas \| Marketing \| Estrategia E-commerce". Edita `c.puesto`. |
| Descripción | Textarea para un párrafo describiéndose. Edita `c.resumen`. |
| Correo y contacto | Inputs para `c.email` y `c.tel`. |
| Experiencia | Lista dinámica, una fila por puesto: nombre del puesto, empresa, fecha inicio y fin (mes y año cada una). Botones agregar/eliminar fila. **Campo NUEVO** `c.experiencia` (array). |
| Educación | Lista dinámica, una fila por entrada: institución, nombre del título, fechas inicio y fin. **Campo NUEVO** `c.educacion` (array). Nota: ya existe `c.edu` (nivel de estudios, usado por match) — conservarlo como select aparte "Nivel máximo de estudios". |
| Habilidades | Input para escribir la habilidad + confirmar (Enter o botón) → se agrega como tag redondeado. Al hacer hover sobre el tag aparece una ✕ para eliminarla. **Máx. 10.** Texto de ayuda con ejemplos de qué es una habilidad (ej. "Negociación, liderazgo, análisis de datos, comunicación efectiva"). **Mapear a `c.soft`** (así el match sigue funcionando). |
| Herramientas | Mismo mecanismo de tags con hover-✕. **Máx. 10.** Ejemplos en la ayuda: "Excel, Office, Power BI, ChatGPT, Salesforce, SAP". **Mapear a `c.hard`.** |
| Intereses | 3 opciones tipo tag seleccionable: **Emplearme**, **Crecer mi puesto**, **Cambiar de área**. Campo NUEVO `c.intereses`. |

- Crear un componente reutilizable de "tag input" con hover-✕ (nuevo, estilo consistente con
  `TagPicker`/`.tag`), porque se usa en Habilidades y Herramientas.
- Botón "Guardar cambios" que persista vía `run(...)` (puede reutilizar/extender
  `ACT.guardarCandidato`). Toast de confirmación.
- Poblar `experiencia`/`educacion`/`intereses` con datos plausibles en 2–3 candidatos semilla
  (los usados en demos, ej. ids 1 y 5) para que la pantalla no se vea vacía.

**2.3 Editor de perfil — pestaña "Mis documentos".** Repositorio personal de documentos
REUTILIZABLES (los que no dependen de una vacante). Categorización propuesta (ajustable después):
- **Identidad:** INE, CURP, Constancia de situación fiscal (RFC).
- **Domicilio:** Comprobante de domicilio.
- **Formación:** Comprobante de estudios / título, diplomados o certificaciones (múltiples).
- **CV:** Currículum actualizado.

Cada documento: subir (reutilizar `UploadPDF` con sus validaciones PDF/1MB), ver nombre del
archivo cargado, y eliminar. Campo NUEVO `c.docsPerfil` (objeto). *(Estos documentos se
aprovecharán en el Batch 4 — dejar el dato listo.)*

**Actualizar CLAUDE.md:** nuevos campos del modelo candidato y nueva sección/componentes.

**Commit sugerido:** `Candidato: perfil editable completo con Mis documentos`

---

## BATCH 3 — Buscar Vacantes, favoritos y cierre amable de procesos ⬜

(Puntos 5 y 3 — van juntos porque el punto 3 necesita que exista "Buscar Vacantes".)
**Recomendado ejecutar en modo plan primero.**

**3.1 Nueva sección "Buscar Vacantes" en el sidebar del candidato.**
- Muestra las vacantes con estado `abierta` en **tarjetas, máximo 3 por fila** (grid responsivo).
- Cada tarjeta: título, área, ubicación + modalidad, nivel, rango salarial, resumen corto de la
  descripción, **anillo de compatibilidad** (`MatchRing`) calculado con
  `matchScore(candidatoActual, v.req)` — el mismo motor del pool. **Sin el código de la vacante**
  (no mostrar V-1042 etc.).
- **Filtros:** ubicación, nivel de puesto, rango de sueldo y área.
- **Ordenamiento** ascendente/descendente por: ranking (compatibilidad), tiempo de publicación,
  título (A–Z) y sueldo.
- **Favoritos:** icono de corazón en cada tarjeta para guardar/quitar (campo NUEVO
  `c.favoritos` = array de ids de vacante). Botón accesible en esta sección para ver solo
  "Mis vacantes guardadas".
- **Detalle:** acción destacada "Ver detalles" que abre popup o pantalla con el descriptivo
  completo. Dentro del detalle, botón **"Aplicar a la vacante"** que abre popup con mensaje
  predeterminado o personalizable (mismo patrón que `InvitarModal` del formador).
- Al aplicar: si la vacante tiene killer questions, responderlas (reutilizar la lógica de
  `PostulacionForm`); crear la entrada en `v.pipeline` (nueva acción `ACT` tipo
  `postularDirecto`: estado `postulado` si pasa killers, `filtrado` si no) y notificar al
  formador. Si el candidato ya está en el pipeline de esa vacante, mostrar su estado en la
  tarjeta en lugar del botón de aplicar.

**3.2 Cierre amable en "Mis procesos" (punto 3).**
Cuando el candidato está `descartado` o `filtrado`, reemplazar los textos actuales por:
**"La vacante concluyó, gracias por aplicar."** con dos botones:
- **"Ver mi feedback"** → popup: si existe `p.entrevista.feedback` mostrarlo; si no, mensaje
  genérico amable (ej. agradecimiento + que su perfil seguirá siendo considerado por la IA para
  vacantes compatibles).
- **"Ver más vacantes"** → navega a la nueva sección "Buscar Vacantes".

**Actualizar CLAUDE.md:** nueva vista del sidebar, `ACT.postularDirecto`, campo `favoritos`.

**Commit sugerido:** `Candidato: sección Buscar Vacantes con filtros, favoritos y aplicación directa; cierre amable de procesos`

---

## BATCH 4 — Rework de documentos de filtros iniciales ⬜

(Puntos 9 y 10 — misma pantalla: estados `postulado`/`filtros_ok` del candidato.)
Requiere Batch 2 terminado (usa los documentos del perfil).

**4.1 Quitar el requisito "Autorización de consulta a buró de crédito"** (documento 1 actual).

**4.2 Renombrar el documento 2** a **"Constancias de empleos previos"** y permitir subir
**varios archivos** (lista de PDFs con las mismas validaciones; poder eliminar cada uno).
Ajustar `ACT.simular` y cualquier verificación de `docsFiltro` para que siga funcionando.

**4.3 Nuevo requisito "Examen psicométrico".**
- Botón que al hacer click simula que el candidato lo completa (no mostrar resultados, solo
  el hecho de completarlo).
- Al completarlo, mostrar: el resultado es **válido para otras aplicaciones de vacantes
  durante 6 meses**.
- Guardarlo a NIVEL CANDIDATO (no por vacante): campo `c.psicometrico = { fecha }`. Si el
  candidato ya lo tiene vigente (<6 meses), este requisito aparece pre-completado en otras
  vacantes con la leyenda de vigencia.

**4.4 Nota de datos del perfil.** Debajo de los requisitos, nota: los datos y documentos del
perfil del candidato (INE, RFC y constancias educativas cargadas en su perfil) se utilizarán
al aplicar a la vacante.

**4.5 Checkbox de autorización (obligatorio).** El candidato debe marcar que autoriza procesar
sus documentos y revisar su historial de crédito y de empleos previos. El botón
"Enviar a validación automática" queda deshabilitado hasta que: constancias subidas (≥1) +
psicométrico completado + checkbox marcado.

**Actualizar CLAUDE.md:** nuevos requisitos del flujo de filtros y campo `psicometrico`.

**Commit sugerido:** `Candidato: rework de documentos de filtros (constancias múltiples, examen psicométrico, autorización)`

---

## BATCH 5 — Contratación: cuenta bancaria y ubicación de ingreso ⬜

(Puntos 7 y 8 — etapa de contratación.)

**5.1 Cuenta bancaria para nómina (punto 7).**
En el checklist de contratación del candidato (estado `seleccionado`), agregar un requisito
adicional "Cuenta bancaria para nómina" con instrucciones claras de qué debe hacer el usuario
y 3 acciones:
1. Botón con icono de link → abre (simulado) la página de apertura de cuenta.
2. Botón con icono de QR → popup mostrando un QR genérico (puede generarse como SVG estático).
3. Botón "Ingresar número de cuenta" → popup con campo para capturar el número; al guardarlo
   se completa el requisito. El candidato puede modificarlo después (botón editar).
- El requisito se completa SOLO con el número de cuenta capturado (guardar en el pipeline,
  ej. `p.cuentaBanco`). Integrarlo a la validación de "documentación completa" y a
  `ACT.simular`. El formador lo ve como recibido en su checklist de solo lectura.

**5.2 Ubicación de presentación (punto 8).**
- En `OfertaTool` (formador, al preparar la carta oferta): campo nuevo para capturar la
  **ubicación donde el candidato debe presentarse** (dirección en texto). Guardarla en
  `p.oferta.ubicacion`.
- En la pantalla de bienvenida del candidato (estado `contratado`): mostrar debajo de la fecha
  de ingreso la ubicación donde debe presentarse + botón **"Ver en Google Maps"** que abra
  `https://www.google.com/maps/search/?api=1&query=<dirección URL-encoded>` en pestaña nueva.
- Mostrar la ubicación también en la carta oferta que ve el candidato (estado `oferta_enviada`)
  y en la pantalla de celebración del formador.
- Dar un valor por defecto razonable al campo (ej. dirección corporativa demo) para que la
  demo fluya.

**Actualizar CLAUDE.md:** campos `cuentaBanco` y `oferta.ubicacion`.

**Commit sugerido:** `Contratación: cuenta bancaria para nómina y ubicación de ingreso con Google Maps`

---

## BATCH 6 — Examen médico condicional por vacante ⬜

(Punto 11.) Cruza los 3 roles. **Recomendado ejecutar en modo plan primero.**

**6.1 En el formulario de vacante** (`VacanteForm`, sección "4 · Condiciones"): checkbox
**"¿Esta vacante requiere examen médico al candidato seleccionado?"** → campo
`req.examenMedico` (boolean, default false). Visible también en el descriptivo
(`VistaDescriptivo`) cuando esté activo.

**6.2 Flujo del candidato** (solo si `req.examenMedico`): en el checklist de contratación
(estado `seleccionado`) aparece el requisito **"Examen médico"**:
- Instrucción: agendar una fecha **dentro de la próxima semana** en una sucursal autorizada
  cerca de su ubicación.
- El candidato captura su ubicación: estado, ciudad y municipio (inputs/selects simples).
- Al "buscar", mostrar SIEMPRE la misma lista simulada de **5 sucursales precargadas**
  (nombres/direcciones ficticias creíbles) — es pura simulación, sin datos reales.
- El candidato elige sucursal + fecha (solo fechas de los próximos 7 días) y agenda.
- Al agendar, el requisito queda **en estado pendiente con color amarillo/ámbar** (usar
  `--warn`/dorado, estilo distinguible de completado-verde) con la leyenda de que está en
  espera de validación del resultado.

**6.3 Validación del formador:** en su tab "Selección y documentos", cuando el candidato ya
agendó, el formador ve sucursal + fecha y un botón **"Validar resultado positivo del examen"**.
Al validarlo, el requisito del candidato pasa a completado (verde) y se le notifica.

**6.4 Reglas:** la documentación del candidato NO se considera completa (`docs_completos`)
hasta que el examen esté validado (cuando la vacante lo requiere). Integrar a `ACT.simular`
para poder demostrar el flujo completo. Activar `examenMedico` en UNA vacante semilla para
poder demostrarlo.

**Actualizar CLAUDE.md:** campo `req.examenMedico`, sub-estados del requisito y el paso de
validación del formador.

**Commit sugerido:** `Examen médico condicional: checkbox en vacante, agendado del candidato y validación del formador`
