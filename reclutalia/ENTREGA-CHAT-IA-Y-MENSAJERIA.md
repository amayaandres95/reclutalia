# Entrega para integración — Chat con IA (preguntas por rol/etapa) + Mensajería formador↔candidato

> **Propósito de este archivo.** Sirve como *input* para otro chat de Claude Code que está
> desarrollando la funcionalidad de **chat con IA** en Reclutalia. Contiene:
>
> 1. El **catálogo de preguntas/mensajes predefinidos** que existen hoy en `main` (verbatim, con su
>    ubicación y variables de plantilla).
> 2. Un **matriz de preguntas sugeridas a la IA por ROL × ETAPA** (el entregable principal: qué
>    preguntas precargadas mostrar según dónde esté el candidato / formador / administrador).
> 3. La **especificación + código de referencia** para habilitar un **chat persona-a-persona entre
>    formador y candidato** (sección separada del chat con IA), que se activa cuando el candidato
>    **pasa el primer filtro de postulación**.
>
> ⚠️ **Nota de alcance honesta:** la sección 3 (mensajería entre personas) **NO existe aún** en
> `main`. Lo que hoy existe son mensajes de **una sola vía** (mensaje de invitación del formador y
> mensaje de postulación del candidato) y un **bot FAQ** transversal. Por eso la sección 3 se entrega
> como *diseño + implementación de referencia* siguiendo las convenciones del repo, para que la
> integres, no como código ya presente.

---

## 0. Contexto mínimo del proyecto (para el chat integrador)

- **App:** `reclutalia/src/App.jsx` — archivo único (~2.9k líneas), React 19 + Vite, sin backend.
  Estado global en un objeto `db` (`{candidatos, vacantes, formadores, notifs}`) en `useState`.
- **Regla de oro:** toda mutación pasa por `run(fn)` (hace `structuredClone(db)`, aplica `fn`, re-render).
  Las acciones viven en el objeto **`ACT`**; cada una suele emitir notificaciones con `notify(...)`.
- **Roles:** `candidato`, `formador`, `admin`.
- **Tono UI:** 100% español de México, institucional, sin inglés visible. Índigo `--ai` **solo** para IA.
- **Estados del pipeline del candidato** (`PIPE_IDX`, en el banner `CATÁLOGOS`):

  | Índice | Estado | Etiqueta (`EstadoChip`) |
  |---|---|---|
  | 0 | `invitado` | Invitado a postularse |
  | 1 | `postulado` | Postulado |
  | 2 | `filtros_ok` | Filtros aprobados ← **habilita el chat P2P** |
  | 3 | `video_ia` | Video-IA en curso (transitorio) |
  | 4 | `evaluado` | Evaluado por IA |
  | 5 | `slots_enviados` / `agendado` | Esperando confirmación / Entrevista agendada |
  | 6 | `entrevistado` | Entrevistado |
  | 7 | `seleccionado` | Seleccionado |
  | 8 | `docs_completos` | Documentación completa |
  | 9 | `oferta_enviada` | Oferta enviada |
  | 10 | `contratado` | Contratado |
  | −1 | `descartado` / `filtrado` / `rechazado` | Descartado / No pasó filtros / Invitación rechazada |

- **Estados de la vacante** (rol formador/admin): `asignada` (pendiente de aprobación del formador),
  `cambios` (esperando al admin), `abierta` (búsqueda activa), `cerrada` (cubierta).
- **Fases del proceso** (`FASES`, helper `faseVacante(v)` → `{fase, subpaso, completados[]}`):
  1. **Búsqueda** → Descriptivo · Pool de talento
  2. **Selección** → Ranking y terna · Entrevistas · Selección y documentos
  3. **Contratación** → Carta oferta · Contratación

---

## 1. Preguntas / mensajes predefinidos que YA existen en `main` (verbatim)

Estas cadenas están hoy en el código. Se listan con su fuente y sus **variables de plantilla** entre
`{llaves}` para que las reutilices o las migres al nuevo chat. **No** son aún "preguntas a un asistente
de IA conversacional": son (a) FAQ del bot, (b) guiones de entrevista. El nuevo chat con IA debe
apoyarse en la **sección 2** para las sugerencias por etapa.

### 1.1 Bot de apoyo — FAQ transversal (`const BOT_FAQ`, banner `BOT DE APOYO`)
Pregunta → respuesta. Es transversal (lo ve formador y candidato). Sin variables.

1. **¿Qué es el pool de talento?** — "Es el marketplace de candidatos internos y externos preregistrados. Al aprobar tu vacante, la IA busca, filtra y ranquea automáticamente los perfiles más compatibles."
2. **¿Cómo funciona el ranking con IA?** — "El agente de IA compara especialidades, habilidades, nivel, experiencia y ubicación contra tu vacante y asigna un match de 0 a 100%. Se actualiza tras la video-entrevista y la entrevista contigo."
3. **¿Qué documentos sube el candidato?** — "Para filtros iniciales: constancias de empleos previos y el examen psicométrico (válido 6 meses). Para contratación: INE, CURP, RFC, comprobante de domicilio, comprobante de estudios y su cuenta bancaria para nómina. Solo PDF, máximo 1 MB por archivo."
4. **¿Puedo cambiar la vacante que me asignaron?** — "Sí. Antes de aprobarla puedes solicitar cambios al administrador desde la pestaña Descriptivo; recibirás una notificación cuando esté actualizada."
5. **¿Cómo agendo entrevistas?** — "Al invitar candidatos a entrevista conectas tu calendario de Outlook/Teams (simulado) y propones 3 horarios; el candidato confirma uno y ambos reciben el enlace de Teams."

### 1.2 Video-entrevista con IA — preguntas que la IA le hace al CANDIDATO (`VideoIAModal.pregs`)
Etapa: candidato en `filtros_ok` (justo tras pasar el primer filtro). 5 preguntas:

1. "Preséntate brevemente: trayectoria, especialidad y lo que buscas en tu siguiente reto."
2. "Esta vacante requiere `{req.hardSkills[0..1]}`. Cuéntame un proyecto donde los aplicaste."
3. "¿Cómo describirías tu nivel en `{req.espRequeridas[0] || req.area}`? Da un ejemplo concreto."
4. "Describe una situación difícil con un cliente o compañero y cómo la resolviste."
5. "¿Por qué te interesa esta posición y qué disponibilidad tienes?"

### 1.3 Copiloto de entrevista — preguntas sugeridas al FORMADOR (`EntrevistaModal.preguntasIA`)
Etapa: candidato `agendado` → durante la entrevista en vivo. 5 preguntas:

1. "Cuéntame de un logro concreto como `{cand.puesto}` y cómo lo mediste."
2. "¿Cómo aplicarías `{req.hardSkills[0] || 'tus herramientas'}` en los retos de este puesto?"
3. "Describe una situación donde demostraste `{req.softSkills[0] || 'comunicación efectiva'}`."
4. "¿Qué te motiva de esta posición (`{req.titulo}`) y del esquema `{req.modalidad}`?"
5. "¿Cuál es tu expectativa salarial y disponibilidad de ingreso?"

### 1.4 Resumen de la entrevista IA que revisa el FORMADOR (`VideoIAResumenModal.preguntas`)
Etapa: candidato `evaluado` (primer filtro, antes del ranking). Pares pregunta→respuesta simulada:

1. Q: "Preséntate: trayectoria, especialidad y lo que buscas en tu siguiente reto." / A: "`{nombre}` resumió `{cand.exp}` años en `{cand.esp[0]||cand.area}`…"
2. Q: "Cuéntame un proyecto donde aplicaste `{req.hardSkills[0..1]}`." / A: "Describió un caso concreto con resultados medibles…"
3. Q: "¿Cómo describirías tu nivel en `{req.espRequeridas[0]||req.area}`?" / A: "Se ubicó en un nivel `{cand.nivel}`…"
4. Q: "Describe una situación difícil con un cliente o compañero y cómo la resolviste." / A: "Mostró `{cand.soft[0]}`…"
5. Q: "¿Por qué te interesa esta posición y qué disponibilidad tienes?" / A: "Alineó su interés con `{req.titulo}`…"

### 1.5 Mensajes de una vía (NO son chat, pero son el precedente)
- **Invitación (formador → candidato)** `InvitarModal.def`: *"Hola `{nombre}`, revisé tu perfil y creo que encaja muy bien con la vacante "`{req.titulo}`" (`{req.modalidad}`, `{req.ubicacionTrabajo}`). Me encantaría invitarte a postularte. ¡Saludos!"*
- **Postulación (candidato → formador)** `AplicarModal.def`: *"Hola, soy `{nombre}` y me interesa mucho la vacante "`{req.titulo}`" (`{req.modalidad}`, `{req.ubicacionTrabajo}`). Considero que mi perfil es compatible y me encantaría participar en el proceso. ¡Saludos!"*
- **Preguntas filtro (killer questions):** son **por vacante** (`v.req.killer[]`, capturadas por el admin), no predefinidas por rol/etapa. Ej. semilla: "¿Cuentas con disponibilidad para laborar sábados medio día?".

---

## 2. ENTREGABLE PRINCIPAL — Preguntas sugeridas al chat con IA, por ROL × ETAPA

Formato listo para integrar como un catálogo. Sugerencia de estructura de datos (una entrada por
`rol` + `etapa`, con `match` sobre estado de vacante o `PIPE_IDX` del candidato). Todas en español MX.
Las `{variables}` son opcionales: si el chat IA tiene contexto de la vacante puede interpolarlas; si
no, deja el texto genérico.

```js
/* Preguntas precargadas del chat con IA, dependientes de rol y etapa.
   Clave de etapa: para CANDIDATO usa p.estado; para FORMADOR/ADMIN usa el estado de la vacante
   (asignada/cambios/abierta/cerrada) o la fase (faseVacante). */
const PREGUNTAS_IA = {
  candidato: {
    invitado: [
      "¿Qué implica esta vacante y qué se espera del puesto?",
      "¿Cómo es el proceso completo si acepto postularme?",
      "¿Qué son las preguntas filtro y por qué son obligatorias?",
      "¿Puedo rechazar la invitación sin afectar futuras oportunidades?",
    ],
    postulado: [
      "¿Qué documentos necesito para los filtros iniciales?",
      "¿Qué es el examen psicométrico y cuánto tiempo es válido?",
      "¿Para qué autorizo la revisión de mis empleos previos e historial?",
      "¿Qué pasa después de enviar mi documentación a validación?",
    ],
    filtros_ok: [
      "¿En qué consiste la video-entrevista con IA?",
      "¿Cómo me preparo para la video-entrevista?",
      "¿Cuánto tarda el formador en revisar mi candidatura?",
      "¿Ya puedo comunicarme con el formador de la vacante?",
    ],
    evaluado: [
      "¿Qué sigue después de la video-entrevista con IA?",
      "¿Cómo decide el formador a quién invita a entrevista?",
      "¿Puedo mejorar mi perfil mientras espero respuesta?",
    ],
    slots_enviados: [
      "¿Cómo elijo mi horario de entrevista?",
      "¿Qué pasa si ninguno de los horarios me acomoda?",
      "¿La entrevista es presencial o virtual (Teams)?",
    ],
    agendado: [
      "¿Cómo me uno a la reunión de Teams?",
      "¿Qué temas suele cubrir la entrevista con el formador?",
      "¿Puedo reagendar si tengo un imprevisto?",
    ],
    entrevistado: [
      "¿Cuándo sabré si fui seleccionado?",
      "¿Puedo pedir retroalimentación de mi entrevista?",
    ],
    seleccionado: [
      "¿Qué documentos necesito para mi contratación?",
      "¿Cómo registro mi cuenta bancaria para nómina?",
      "¿Cómo agendo y dónde presento mi examen médico?",
      "¿Cómo abro mi cuenta de nómina (enlace o QR)?",
    ],
    docs_completos: [
      "¿Cuándo recibiré mi carta oferta?",
      "¿Qué incluye la carta oferta?",
    ],
    oferta_enviada: [
      "¿Qué significa aceptar la oferta y la fecha de ingreso?",
      "¿Cuándo y dónde firmo mi contrato?",
      "¿Puedo proponer otra fecha de ingreso?",
    ],
    contratado: [
      "¿Qué necesito para mi primer día?",
      "¿Dónde veo mi kit de inducción y guía de bienvenida?",
      "¿Cómo contacto a mi formador de equipo?",
    ],
    // Estados terminales
    rechazado:  ["¿Dónde busco otras vacantes compatibles con mi perfil?"],
    descartado: ["¿Puedo ver la retroalimentación de mi proceso?", "¿Dónde busco más vacantes?"],
    filtrado:   ["¿Por qué no continué en el proceso?", "¿Dónde busco más vacantes?"],
  },

  formador: {
    asignada: [
      "¿Qué debo revisar antes de aprobar el descriptivo?",
      "¿Cómo solicito cambios de campos específicos al administrador?",
      "¿Qué pasa al aprobar la vacante e iniciar la búsqueda?",
    ],
    cambios: [
      "¿En qué estatus quedó mi solicitud de cambios?",
      "¿Puedo agregar más ajustes mientras el admin responde?",
    ],
    // Vacante abierta: sugerencias por sub-paso de la fase (faseVacante)
    pool: [
      "¿Cómo interpreto las bandas de ranking del pool?",
      "¿Cómo filtro el pool por habilidades o experiencia?",
      "¿Cómo archivo, categorizo o marco como favorito a un candidato?",
      "¿Cómo solicito más candidatos si el pool es insuficiente?",
    ],
    ranking: [
      "¿Cómo se recalcula el ranking tras la video-entrevista con IA?",
      "¿Puedo ver la grabación y el resumen de la entrevista con IA?",
      "¿A cuántos candidatos puedo invitar a entrevista a la vez?",
      "¿Cómo agendo entrevistas con mi calendario de Outlook/Teams?",
    ],
    entrevistas: [
      "¿Cómo uso el copiloto de IA durante la entrevista?",
      "¿Cómo registro una entrevista externa o presencial?",
      "¿Para qué sirve la calificación de 1 a 10 estrellas?",
    ],
    seleccion: [
      "¿Cómo elijo a mi candidato ideal y qué pasa con los demás?",
      "¿Cómo superviso los documentos que sube el candidato?",
      "¿Cómo envío un recordatorio de documentos pendientes?",
      "¿Cómo valido el examen médico del candidato?",
    ],
    oferta: [
      "¿Cómo preparo y envío la carta oferta?",
      "¿Cómo funciona la sugerencia de sueldo de la IA?",
      "¿Puedo definir una fecha de ingreso distinta a la quincena?",
    ],
    contratacion: [
      "¿Qué se genera automáticamente al firmar el contrato?",
      "¿Dónde está el kit de inducción del nuevo colaborador?",
    ],
    cerrada: [
      "¿Puedo consultar el historial del proceso ya cerrado?",
    ],
  },

  admin: {
    general: [
      "¿Cómo creo una vacante y la asigno a un formador?",
      "¿Qué campos del descriptivo son obligatorios por sección?",
      "¿Cómo agrego nuevas opciones a especialidades o habilidades?",
    ],
    cambios: [
      "¿Qué campos solicitó cambiar el formador?",
      "¿Cómo aplico o rechazo cada cambio solicitado?",
      "¿Cómo agrego una nota general al reenviar el descriptivo?",
    ],
    seguimiento: [
      "¿En qué etapa va cada vacante del listado?",
      "¿Qué significa el chip 'Candidato elegido'?",
      "¿Por qué una vacante confidencial no aparece en Buscar vacantes?",
    ],
    candidatos: [
      "¿Cómo subo o edito un candidato del marketplace?",
      "¿Qué campos lee el motor de match?",
    ],
  },
};
```

**Cómo elegir la lista en tiempo de ejecución (guía para el integrador):**
- **Candidato:** `PREGUNTAS_IA.candidato[p.estado]` donde `p = v.pipeline[candId]`.
- **Formador:** si `v.estado` es `asignada`/`cambios`/`cerrada`, usar esa clave; si `abierta`, derivar
  el sub-paso con `faseVacante(v).subpaso` y mapearlo a `pool|ranking|entrevistas|seleccion|oferta|contratacion`.
- **Admin:** por vista actual (`nueva`→general, edición con `v.cambios`→cambios, listado→seguimiento,
  `candidatos`→candidatos).
- Siempre puedes añadir el `BOT_FAQ` (sección 1.1) como preguntas "siempre disponibles" además de las de etapa.

---

## 3. Mensajería formador ↔ candidato (sección separada del chat con IA)

> **Estado actual:** NO existe en `main`. Abajo va la **especificación** y una **implementación de
> referencia** siguiendo las convenciones del repo (`db` → `run` → `ACT` → `notify`). El integrador
> puede pegarla casi tal cual y ajustar estilos.

### 3.1 Reglas de negocio
- La conversación es **por vacante y por candidato**: vive en `v.pipeline[cid].chat`.
- **Se habilita cuando el candidato pasa el primer filtro de postulación**, es decir cuando
  `PIPE_IDX[p.estado] >= PIPE_IDX.filtros_ok` (estado `filtros_ok` o posterior) y el proceso **no** está
  en un estado terminal (`descartado`/`filtrado`/`rechazado`).
- Es una **sección distinta** del chat con IA: mensajes entre **personas** (formador y candidato),
  sin respuestas automáticas. Cada mensaje enviado **notifica** a la otra parte.
- Incluye **preguntas/mensajes sugeridos precargados** propios (distintos de los de IA), para arrancar
  la conversación con un clic.

### 3.2 Modelo de datos
Cada mensaje: `{ de: 'formador'|'candidato', t: string, fecha: string }` en el arreglo
`v.pipeline[cid].chat`. Default: no existe hasta el primer mensaje (tratar `undefined` como `[]`).

### 3.3 Acción de negocio (agregar dentro de `ACT`)
```js
/* Chat persona-a-persona formador↔candidato (habilitado desde filtros_ok) */
enviarMensajeChat(db, vacId, cid, de, texto){
  const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
  if(!p.chat) p.chat=[];
  const t=String(texto||"").trim(); if(!t) return;
  p.chat.push({ de, t, fecha:hoy()+" · "+hora() });
  const c=db.candidatos.find(x=>x.id===cid);
  if(de==="formador"){
    notify(db,{tipo:"candidato",id:cid},"Nuevo mensaje del formador",
      `${db.formadores.find(f=>f.id===v.formadorId).nombre} te escribió sobre "${v.req.titulo}": "${t}"`,v.id);
  } else {
    notify(db,{tipo:"formador",id:v.formadorId},"Nuevo mensaje del candidato",
      `${c.nombre} te escribió sobre "${v.req.titulo}": "${t}"`,v.id);
  }
},
```

### 3.4 Helper de habilitación (a nivel módulo)
```js
/* El chat P2P se habilita al pasar el primer filtro y mientras el proceso siga activo */
const chatHabilitado=(p)=> (PIPE_IDX[p.estado] ?? -1) >= PIPE_IDX.filtros_ok
  && !["descartado","filtrado","rechazado"].includes(p.estado);
```

### 3.5 Mensajes sugeridos precargados (propios del chat P2P, NO IA)
```js
const CHAT_SUGERENCIAS = {
  candidato: [
    "Hola, quedo atento(a) a los siguientes pasos del proceso.",
    "¿Podrías contarme un poco más sobre el equipo y el día a día del puesto?",
    "Tengo disponibilidad para entrevista esta semana, ¿qué horarios te acomodan?",
    "¿Hay algo adicional que deba preparar para avanzar?",
  ],
  formador: [
    "Hola, gracias por tu interés. Tu perfil se ve muy alineado con la vacante.",
    "Me gustaría coordinar una entrevista contigo. Te enviaré horarios disponibles.",
    "¿Tienes alguna duda sobre el puesto o el proceso?",
    "Quedo al pendiente de tu documentación para avanzar.",
  ],
};
```

### 3.6 Componente de UI de referencia
Panel de conversación reutilizable por ambos roles. `yo` = `'formador'` o `'candidato'`.
```jsx
/* Chat persona-a-persona (formador↔candidato). Sección separada del asistente de IA. */
function ChatPersonas({p, yo, onEnviar}){
  const [txt,setTxt]=useState("");
  const chat=p.chat||[];
  const enviar=(t)=>{ const v=(t??txt).trim(); if(!v) return; onEnviar(v); setTxt(""); };
  return (
    <div className="card">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <MessageSquare size={16} color="var(--gold-dark)"/>
        <b style={{fontSize:13.5}}>Mensajes con {yo==="formador"?"el candidato":"tu formador"}</b>
        <span className="chip" style={{marginLeft:"auto"}}>Conversación directa</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:280,overflowY:"auto",marginBottom:10}}>
        {chat.length===0 && <p className="help">Aún no hay mensajes. Envía el primero o usa una sugerencia.</p>}
        {chat.map((m,i)=>(
          <div key={i} style={{alignSelf:m.de===yo?"flex-end":"flex-start",
            background:m.de===yo?"var(--gold-soft)":"var(--bg)",border:"1px solid var(--line)",
            borderRadius:12,padding:"8px 12px",fontSize:12.5,maxWidth:"85%"}}>
            <div>{m.t}</div>
            <div className="help" style={{marginTop:3}}>{m.de===yo?"Tú":(m.de==="formador"?"Formador":"Candidato")} · {m.fecha}</div>
          </div>
        ))}
      </div>
      {/* Sugerencias precargadas (no IA) */}
      <div className="tagpick" style={{marginBottom:8}}>
        {CHAT_SUGERENCIAS[yo].map((s,i)=><button key={i} className="tag" onClick={()=>enviar(s)}>{s}</button>)}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Escribe un mensaje…"
          onKeyDown={e=>{ if(e.key==="Enter") enviar(); }}/>
        <button className="btn gold" disabled={!txt.trim()} onClick={()=>enviar()}><Send size={15}/> Enviar</button>
      </div>
    </div>
  );
}
```

### 3.7 Puntos de integración en la UI existente
- **Candidato (`CandidatoHome`)** — dentro de la tarjeta de la vacante, cuando `chatHabilitado(p)`:
  ```jsx
  {chatHabilitado(p) && (
    <div style={{marginTop:12}}>
      <ChatPersonas p={p} yo="candidato"
        onEnviar={(t)=>run(d=>ACT.enviarMensajeChat(d,v.id,cand.id,"candidato",t))}/>
    </div>
  )}
  ```
- **Formador (`VacanteDetail`)** — al abrir la ficha de un candidato del pipeline (o como sub-sección
  en la tab de Ranking/Entrevistas), cuando `chatHabilitado(p)`:
  ```jsx
  {chatHabilitado(p) && (
    <ChatPersonas p={p} yo="formador"
      onEnviar={(t)=>run(d=>ACT.enviarMensajeChat(d,v.id,cid,"formador",t))}/>
  )}
  ```
- **Íconos lucide** ya importados y usados por este código: `MessageSquare`, `Send`. No requiere nuevos imports.

### 3.8 Checklist de aceptación
- [ ] El chat aparece **solo** desde `filtros_ok` en adelante y desaparece/queda de solo lectura en estados terminales.
- [ ] Formador y candidato ven la **misma** conversación (misma fuente `v.pipeline[cid].chat`).
- [ ] Cada mensaje genera **notificación** a la contraparte (aparece en su `NotifList`).
- [ ] Las **sugerencias** del chat P2P son distintas de las del chat con IA (sección separada).
- [ ] `structuredClone` no rompe: `chat` es un arreglo de objetos planos (OK).
- [ ] `npx vite build --logLevel error` en verde.

---

## 4. Prompt sugerido para el otro chat de Claude Code

> Copia/pega esto (junto con este archivo) en el chat que desarrolla la funcionalidad de IA:

```
Contexto: trabajo en Reclutalia (React + Vite, todo en src/App.jsx, estado en `db` mutado vía run(),
acciones en el objeto ACT, notificaciones con notify()). Adjunto ENTREGA-CHAT-IA-Y-MENSAJERIA.md.

Tarea 1 (Chat con IA): integra el catálogo `PREGUNTAS_IA` de la sección 2 como las preguntas
sugeridas que el usuario puede lanzar al asistente de IA, cambiando automáticamente según el ROL y la
ETAPA (usa p.estado del candidato; para formador/admin usa estado de vacante o faseVacante como se
indica en "Cómo elegir la lista en tiempo de ejecución"). Mantén el índigo --ai solo para IA y el
español MX. Conserva el BOT_FAQ como preguntas siempre disponibles.

Tarea 2 (Mensajería formador↔candidato): implementa la sección 3 (acción ACT.enviarMensajeChat,
helper chatHabilitado, componente ChatPersonas, sugerencias CHAT_SUGERENCIAS y los puntos de
integración en CandidatoHome y VacanteDetail). Debe habilitarse cuando el candidato pasa el primer
filtro (filtros_ok) y ser una sección separada del chat con IA. Corre `npx vite build --logLevel
error` al final y no rompas el flujo existente.
```

---

*Generado a partir de la revisión de `main` (`src/App.jsx`). Las secciones 1 y el modelo de datos son
verbatim del código; la sección 2 es un catálogo nuevo derivado del proceso; la sección 3 es diseño +
código de referencia para una funcionalidad que aún no existe en el repo.*
