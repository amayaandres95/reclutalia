/*
  RECLUTALIA · Prototipo semifuncional (v1)
  Plataforma de cobertura de vacantes "TO BE — Formador de Equipo"
  ------------------------------------------------------------------
  Prototipo navegable en React (un solo archivo, migrable a Vite/Next).
  3 paneles: Formador (usuario principal), Admin y Candidato.
  Todo lo marcado con "IA" o integraciones (Outlook/Teams, SAP, buró,
  video-entrevista) está SIMULADO para validación con usuarios.
*/

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Bell, Search, Users, Briefcase, Calendar, FileText, Download, Plus,
  CheckCircle2, XCircle, Sparkles, Video, MapPin, Clock, ChevronRight,
  Send, Building2, GraduationCap, ShieldCheck, PartyPopper, Bot, X,
  Upload, AlertCircle, Edit3, Star, MessageSquare, User, LayoutGrid,
  ClipboardList, Zap, Link2, CalendarCheck, FileSignature, Home, Filter, Heart,
  QrCode, Landmark, ExternalLink, ClipboardCheck,
  Archive, ArchiveRestore, FolderPlus, Share2, Loader2, Check
} from "lucide-react";

/* ============================== ESTILOS ============================== */
const CSS = `
:root{
  --ink:#1A1A1A; --ink2:#3D3D3D; --paper:#FFFFFF; --bg:#F6F5F1;
  --gold:#FFB81C; --gold-soft:#FFF3D6; --gold-dark:#8A6400;
  --line:#E5E2DA; --gray:#8C8C8C; --ai:#4338CA; --ai-soft:#EEF0FF;
  --ok:#1E7A3C; --ok-soft:#E7F4EB; --bad:#B3261E; --bad-soft:#FCEBEA;
  --warn:#946F00;
}
*{box-sizing:border-box; margin:0; padding:0;}
.rk{font-family:'Segoe UI',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif;
  background:var(--bg); color:var(--ink); min-height:100vh; display:flex; font-size:14px;}
.rk h1,.rk h2,.rk h3{letter-spacing:-0.01em;}
.rk button{font-family:inherit; cursor:pointer;}
.rk input,.rk select,.rk textarea{font-family:inherit; font-size:14px; color:var(--ink);
  border:1px solid var(--line); border-radius:8px; padding:9px 12px; background:#fff; width:100%; outline:none;}
.rk input:focus,.rk select:focus,.rk textarea:focus{border-color:var(--gold); box-shadow:0 0 0 3px var(--gold-soft);}
.rk label{font-size:12px; font-weight:600; color:var(--ink2); display:block; margin-bottom:5px;}
.side{width:232px; background:#161616; color:#EDEAE2; padding:20px 14px; display:flex; flex-direction:column; gap:4px; flex-shrink:0; min-height:100vh; position:sticky; top:0;}
.logo{display:flex; align-items:center; gap:10px; padding:4px 8px 18px;}
.logo .mark{width:34px;height:34px;border-radius:9px;background:var(--gold);color:#161616;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;}
.logo b{font-size:17px;letter-spacing:0.02em;} .logo span{display:block;font-size:10px;color:#9E9E9E;letter-spacing:0.14em;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:9px;color:#C9C9C9;background:none;border:none;font-size:13.5px;font-weight:500;text-align:left;width:100%;}
.nav-item:hover{background:#242424;color:#fff;}
.nav-item.on{background:#2A2415;color:var(--gold);font-weight:700;}
.nav-item.on svg{color:var(--gold);}
.rolebox{margin-top:auto;background:#222;border-radius:12px;padding:12px;}
.rolebox p{font-size:10px;letter-spacing:0.12em;color:#9E9E9E;margin-bottom:8px;}
.rolebox select{background:#161616;color:#fff;border-color:#3D3D3D;font-size:13px;}
.main{flex:1;display:flex;flex-direction:column;min-width:0;}
.topbar{background:var(--paper);border-bottom:1px solid var(--line);padding:14px 28px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:40;}
.topbar h2{font-size:17px;font-weight:700;}
.crumb{font-size:12px;color:var(--gray);}
.iconbtn{position:relative;background:var(--bg);border:1px solid var(--line);border-radius:10px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;color:var(--ink2);}
.iconbtn:hover{border-color:var(--gold);}
.dot{position:absolute;top:-4px;right:-4px;background:var(--bad);color:#fff;font-size:10px;font-weight:700;border-radius:99px;min-width:17px;height:17px;display:flex;align-items:center;justify-content:center;padding:0 4px;}
.content{padding:24px 28px 80px;max-width:1180px;width:100%;margin:0 auto;}
.card{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:20px;}
.card+.card{margin-top:16px;}
.card.ok{border-color:var(--ok);background:var(--ok-soft);}
.btn{display:inline-flex;align-items:center;gap:7px;border-radius:9px;padding:9px 16px;font-size:13.5px;font-weight:600;border:1px solid transparent;}
.btn.gold{background:var(--gold);color:#1A1A1A;} .btn.gold:hover{background:#F0AC12;}
.btn.dark{background:var(--ink);color:#fff;} .btn.dark:hover{background:#000;}
.btn.ghost{background:#fff;border-color:var(--line);color:var(--ink2);} .btn.ghost:hover{border-color:var(--ink2);}
.btn.ai{background:var(--ai);color:#fff;} .btn.ai:hover{background:#3730A3;}
.btn.ok{background:var(--ok);color:#fff;}
.btn.danger{background:#fff;border-color:var(--bad);color:var(--bad);}
.btn.sm{padding:6px 11px;font-size:12.5px;border-radius:8px;}
.btn:disabled{opacity:0.45;cursor:not-allowed;}
.chip{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:3px 9px;border-radius:99px;background:var(--bg);border:1px solid var(--line);color:var(--ink2);}
.chip.gold{background:var(--gold-soft);border-color:#F2D089;color:var(--gold-dark);}
.chip.ai{background:var(--ai-soft);border-color:#C7CBF5;color:var(--ai);}
.chip.ok{background:var(--ok-soft);border-color:#BBDFC6;color:var(--ok);}
.chip.bad{background:var(--bad-soft);border-color:#F0C4C1;color:var(--bad);}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
@media(max-width:900px){.grid2,.grid3{grid-template-columns:1fr;}.side{display:none;}}
.modal-bg{position:fixed;inset:0;background:rgba(20,18,12,0.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:#fff;border-radius:16px;max-width:640px;width:100%;max-height:88vh;overflow:auto;padding:24px;position:relative;box-shadow:0 24px 60px rgba(0,0,0,0.25);}
.modal.wide{max-width:860px;}
.xclose{position:absolute;top:14px;right:14px;background:var(--bg);border:none;border-radius:8px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;color:var(--gray);}
/* Journey rail — elemento firma */
/* Barra de proceso en 3 fases (Batch 4 · F13) */
.fases{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch;}
.fase-box{flex:1;min-width:210px;border:1.5px solid var(--line);border-radius:12px;padding:9px 12px;background:var(--paper);}
.fase-box.now{border-color:var(--gold);background:#FFFDF6;}
.fase-box.done{border-color:#BFE3CB;background:#F6FBF7;}
.fase-hd{font-size:10.5px;font-weight:800;letter-spacing:0.07em;text-transform:uppercase;color:var(--gray);display:flex;align-items:center;gap:6px;margin-bottom:7px;}
.fase-box.now .fase-hd{color:var(--gold-dark);} .fase-box.done .fase-hd{color:var(--ok);}
.fase-n{width:16px;height:16px;border-radius:99px;border:1.5px solid currentColor;display:inline-flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;}
.fase-subs{display:flex;gap:5px;flex-wrap:wrap;}
.fase-sub{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:99px;border:1px solid var(--line);background:var(--paper);color:var(--ink2);}
.fase-sub.ok{border-color:#BFE3CB;color:var(--ok);background:#EFF7F1;}
.fase-sub.cur{border-color:var(--gold);color:var(--gold-dark);background:var(--gold-soft);}
button.fase-sub{cursor:pointer;font-family:inherit;}
button.fase-sub:disabled{opacity:0.45;cursor:not-allowed;}
button.fase-sub.on{background:var(--ink);border-color:var(--ink);color:#fff;}
.fases-c{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.fase-pill{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;border:1px solid var(--line);color:var(--gray);background:var(--paper);}
.fase-pill.now{border-color:var(--gold);color:var(--gold-dark);background:var(--gold-soft);}
.fase-pill.done{border-color:#BFE3CB;color:var(--ok);background:#EFF7F1;}
.fase-pill .fase-n{width:14px;height:14px;font-size:9px;}
.fase-txt{font-size:11.5px;font-weight:700;color:var(--gold-dark);}
.mini-pipe{display:flex;gap:3px;margin-top:6px;}
.mini-pipe i{height:4px;flex:1;border-radius:99px;background:var(--line);}
.mini-pipe i.f{background:var(--gold);}
.ring{position:relative;width:52px;height:52px;flex-shrink:0;}
.ring svg{transform:rotate(-90deg);}
.ring b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12.5px;}
.avatar{width:40px;height:40px;border-radius:99px;background:var(--ink);color:var(--gold);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;}
.trow{display:flex;align-items:center;gap:14px;padding:13px 14px;border:1px solid var(--line);border-radius:12px;background:#fff;}
.trow+.trow{margin-top:10px;}
.trow:hover{border-color:#CFC9BD;}
.notif{display:flex;gap:12px;padding:13px 14px;border-radius:12px;border:1px solid var(--line);background:#fff;align-items:flex-start;}
.notif.unread{background:var(--gold-soft);border-color:#F0D9A5;}
.notif+.notif{margin-top:8px;}
.check-item{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px dashed var(--line);border-radius:11px;}
.chk-inline{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--ink2);margin-top:6px;cursor:pointer;}
.chk-inline input{width:auto;margin:0;}
/* Solicitud de cambios por campo (Batch 6) */
.lapiz{background:none;border:1px solid var(--line);border-radius:6px;padding:2px 5px;cursor:pointer;color:var(--gray);vertical-align:middle;margin-left:6px;line-height:0;}
.lapiz:hover{border-color:var(--gold);color:var(--gold-dark);}
.lapiz.on{border-color:var(--gold);color:var(--gold-dark);background:var(--gold-soft);}
.anot{display:flex;gap:8px;align-items:center;background:var(--gold-soft);border:1px solid #F0D9A5;border-radius:9px;padding:7px 10px;margin-top:6px;font-size:12.5px;color:var(--gold-dark);flex-wrap:wrap;}
.anot.rej{background:var(--bg);border-color:var(--line);color:var(--gray);}
.check-item.done{border-style:solid;background:var(--ok-soft);border-color:#BBDFC6;}
.check-item+.check-item{margin-top:9px;}
.stat{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px;}
.stat b{font-size:26px;display:block;} .stat span{font-size:12px;color:var(--gray);}
.tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin-bottom:18px;overflow-x:auto;}
.tab{background:none;border:none;padding:10px 14px;font-size:13px;font-weight:600;color:var(--gray);border-bottom:2.5px solid transparent;white-space:nowrap;}
.tab.on{color:var(--ink);border-bottom-color:var(--gold);}
.tab:disabled{opacity:0.4;}
.field{margin-bottom:14px;}
.help{font-size:11.5px;color:var(--gray);margin-top:4px;}
.tagpick{display:flex;flex-wrap:wrap;gap:6px;}
.tag{border:1px solid var(--line);background:#fff;border-radius:99px;padding:5px 12px;font-size:12px;font-weight:500;color:var(--ink2);}
.tag.on{background:var(--ink);color:var(--gold);border-color:var(--ink);font-weight:700;}
img.avatar{object-fit:cover;}
.taginput{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.tagx{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);background:#fff;border-radius:99px;padding:5px 10px;font-size:12px;font-weight:500;color:var(--ink2);}
.tagx button{border:none;background:none;display:none;color:var(--gray);cursor:pointer;padding:0;line-height:1;}
.tagx:hover button{display:inline-flex;align-items:center;}
.fotoprev{width:76px;height:76px;border-radius:99px;object-fit:cover;border:1px solid var(--line);background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--gray);flex-shrink:0;}
.aibox{background:var(--ai-soft);border:1px solid #C7CBF5;border-radius:12px;padding:14px;}
.aibox .hd{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--ai);font-size:13px;margin-bottom:8px;}
.celebrate{background:linear-gradient(135deg,#1A1A1A 0%,#2A2415 100%);border-radius:18px;color:#fff;padding:44px 32px;text-align:center;position:relative;overflow:hidden;}
.confetti{position:absolute;width:9px;height:14px;top:-20px;animation:fall 3.4s linear infinite;border-radius:2px;}
@keyframes fall{to{transform:translateY(120vh) rotate(720deg);}}
.botfab{position:fixed;bottom:22px;right:22px;z-index:90;width:54px;height:54px;border-radius:99px;background:var(--ink);color:var(--gold);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px rgba(0,0,0,0.3);}
.botpanel{position:fixed;bottom:86px;right:22px;z-index:95;width:330px;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,0.22);overflow:hidden;display:flex;flex-direction:column;max-height:460px;}
.demo-hint{font-size:11px;color:var(--ai);background:var(--ai-soft);border:1px dashed #C7CBF5;border-radius:8px;padding:6px 10px;display:inline-flex;align-items:center;gap:6px;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:11px 20px;border-radius:99px;font-size:13px;font-weight:600;z-index:200;box-shadow:0 10px 30px rgba(0,0,0,0.3);display:flex;gap:8px;align-items:center;}
.slotbtn{border:1.5px solid var(--line);background:#fff;border-radius:10px;padding:10px;font-size:12.5px;text-align:center;font-weight:600;color:var(--ink2);}
.slotbtn.on{border-color:var(--gold);background:var(--gold-soft);color:var(--gold-dark);}
.table{width:100%;border-collapse:collapse;font-size:13px;}
.table th{text-align:left;font-size:11px;letter-spacing:0.06em;color:var(--gray);padding:8px 10px;border-bottom:1px solid var(--line);}
.table td{padding:10px;border-bottom:1px solid #F0EEE7;}
.vac-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:stretch;}
@media(max-width:1200px){.vac-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:900px){.vac-grid{grid-template-columns:1fr;}}
.heart{border:1px solid var(--line);background:#fff;border-radius:99px;width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;color:var(--gray);flex-shrink:0;}
.heart:hover{border-color:var(--bad);color:var(--bad);}
.heart.on{color:var(--bad);border-color:#F0C4C1;background:var(--bad-soft);}
/* Acciones de icono pequeñas en tarjetas de pool (Batch 1) */
.iconact{border:1px solid var(--line);background:#fff;border-radius:8px;width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;color:var(--gray);flex-shrink:0;}
.iconact:hover{border-color:var(--ink2);color:var(--ink2);}
.iconact.on{color:var(--gold-dark);border-color:#F2D089;background:var(--gold-soft);}
.iconact.fav.on{color:var(--bad);border-color:#F0C4C1;background:var(--bad-soft);}
/* Divisores por banda de ranking (Batch 1 · F14) */
.band-div{display:flex;align-items:center;gap:10px;margin:20px 0 12px;}
.band-div .ln{flex:1;height:2px;border-radius:2px;opacity:0.55;}
.band-div b{font-size:13px;font-weight:800;letter-spacing:0.01em;white-space:nowrap;}
.band-div .cnt{font-size:11px;color:var(--gray);font-weight:600;}
/* Panel de filtros del pool (Batch 1 · F1.5) */
.filtpanel{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:14px;}
/* Overlay de búsqueda con IA al aprobar (Batch 1 · F3) */
.ai-spin{animation:spin 0.9s linear infinite;color:var(--ai);}
@keyframes spin{to{transform:rotate(360deg);}}
.ai-search-msg{font-size:13.5px;color:var(--ai);font-weight:600;margin-top:14px;min-height:20px;transition:opacity .3s;}
`;

/* ============================== CATÁLOGOS ============================== */
const AREAS = ["Tecnología","Datos y Analítica","Ventas","Marketing","Finanzas","Recursos Humanos","Operaciones","Atención a Clientes","Legal","Producto"];
const NIVELES = ["Practicante","Junior","Semi-Senior","Senior","Gerente","Directivo"];
const EDUCACION = ["Bachillerato","Técnico Superior","Licenciatura trunca","Licenciatura titulado","Maestría","Doctorado"];
const CIUDADES = ["CDMX","Monterrey","Guadalajara","Puebla","Querétaro","Tijuana","Mérida","Toluca","León"];
const MODALIDADES = ["Presencial","Híbrido","Remoto"];
/* Tipo de sede y sedes simuladas (Batch 5 · A2) — 5 opciones fijas por tipo, siempre las mismas */
const TIPOS_SEDE = ["Corporativo","Sucursal"];
const SEDES = {
  Corporativo:["Corporativo Insurgentes Sur (CDMX)","Corporativo Reforma 222 (CDMX)","Corporativo Santa Fe (CDMX)","Corporativo Valle Oriente (MTY)","Corporativo Providencia (GDL)"],
  Sucursal:["Sucursal Centro Histórico (CDMX)","Sucursal Coapa (CDMX)","Sucursal Cumbres (MTY)","Sucursal Chapultepec (GDL)","Sucursal Angelópolis (PUE)"],
};
/* Tipo de vacante (Batch 5 · A4) — opción única */
const TIPOS_VACANTE = ["Estándar","Preventiva","Proactiva","Confidencial"];
/* Campos del descriptivo anotables en la solicitud de cambios por campo (Batch 6 · F15/A8).
   Clave canónica → etiqueta visible; v.cambios usa estas claves ({campo:anotación}). */
const CAMPOS_DESC = { titulo:"Título del puesto", descripcion:"Descripción", area:"Área", nivelPuesto:"Nivel del puesto",
  numVacantes:"Número de posiciones", ubicacionTrabajo:"Ubicación del trabajo", sede:"Sede", unidadNegocio:"Unidad de Negocio",
  tipoVacante:"Tipo de vacante", anosExp:"Años de experiencia", educacion:"Nivel de estudios", radio:"Radio de búsqueda",
  espRequeridas:"Especialidades requeridas", espOpcionales:"Especialidades opcionales", hardSkills:"Habilidades técnicas",
  softSkills:"Habilidades blandas", aptitudes:"Aptitudes", edad:"Rango de edad", killer:"Preguntas filtro",
  modalidad:"Modalidad", dias:"Días de trabajo", horario:"Horario", salario:"Rango salarial", examenMedico:"Examen médico" };
const ESPECIALIDADES = ["Ventas B2C","Ventas B2B","Desarrollo Frontend","Desarrollo Backend","Ciencia de Datos","Business Intelligence","Marketing Digital","CRM y Fidelización","Contabilidad","Planeación Financiera","Atracción de Talento","Capacitación","Logística","Cadena de Suministro","Servicio al Cliente","Cobranza","Derecho Corporativo","Cumplimiento (Compliance)","Gestión de Producto","UX/UI","Ciberseguridad","Infraestructura TI"];
const HARD_SKILLS = ["Excel avanzado","SQL","Python","Power BI","Tableau","React","Node.js","SAP","Salesforce","CRM","Google Ads","Meta Ads","SEO","Contabilidad NIF","Modelado financiero","Nómina","LMS","Zendesk","AutoCAD","Scrum","Figma","Redes Cisco","Inglés avanzado","Negociación comercial","Prospección en frío"];
const SOFT_SKILLS = ["Comunicación efectiva","Liderazgo","Trabajo en equipo","Orientación a resultados","Adaptabilidad","Pensamiento analítico","Empatía","Negociación","Atención al detalle","Gestión del tiempo","Resolución de conflictos","Proactividad"];
const APTITUDES = ["Razonamiento numérico","Razonamiento verbal","Razonamiento lógico","Atención al detalle","Orientación al servicio","Liderazgo de equipos","Tolerancia a la presión","Creatividad"];
const DIAS = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

/* Proceso de la vacante en 3 fases con sub-pasos (Batch 4 · F13 — sustituye al Journey de 10 pasos) */
const FASES = [
  { nombre:"Búsqueda",     subs:["Descriptivo","Pool de talento"] },
  { nombre:"Selección",    subs:["Ranking y terna","Entrevistas","Selección y documentos"] },
  { nombre:"Contratación", subs:["Carta oferta","Contratación"] },
];

/* Pipeline del candidato dentro de una vacante */
const PIPE = ["Invitado","Postulado","Filtros OK","Video-IA","Ranqueado","Entrevista agendada","Entrevistado","Seleccionado","Documentación","Oferta","Contratado"];
const PIPE_IDX = { invitado:0, postulado:1, filtros_ok:2, video_ia:3, evaluado:4, slots_enviados:5, agendado:5, entrevistado:6, seleccionado:7, docs_completos:8, oferta_enviada:9, oferta_aceptada:9, contratado:10, descartado:-1, filtrado:-1 };

/* ============================== DATOS SEMILLA ============================== */
const Cd = (id,nombre,tipo,area,puesto,nivel,exp,edu,ciudad,modalidad,salario,esp,hard,soft,resumen)=>(
  {id,nombre,tipo,area,puesto,nivel,exp,edu,ciudad,modalidad,salario,esp,hard,soft,resumen,
   email:nombre.toLowerCase().replace(/[^a-z ]/g,"").split(" ").slice(0,2).join(".")+"@mail.com",
   tel:"55"+String(30000000+id*137137).slice(0,8),
   // Campos de perfil editable (Batch 2) y favoritos (Batch 3). Aditivos: no los lee matchScore.
   experiencia:[], educacion:[], intereses:[], foto:null, favoritos:[],
   // Examen psicométrico a nivel candidato (Batch 4). Vigencia 6 meses; null = no realizado.
   psicometrico:null,
   docsPerfil:{ ine:null, curp:null, rfc:null, domicilio:null, estudios:null, certificaciones:[], cv:null }});

const SEED_CANDIDATOS = [
  Cd(1,"Valeria Ortiz Camacho","externo","Ventas","Ejecutiva de ventas retail","Semi-Senior",5,"Licenciatura titulado","CDMX","Presencial",16000,["Ventas B2C","Servicio al Cliente"],["CRM","Negociación comercial","Prospección en frío","Excel avanzado"],["Comunicación efectiva","Orientación a resultados","Empatía"],"5 años en piso de venta y telemarketing; top performer 2024 en cadena retail."),
  Cd(2,"Jorge Luis Peña Ríos","interno","Ventas","Asesor comercial","Junior",2,"Licenciatura trunca","CDMX","Híbrido",13000,["Ventas B2C"],["CRM","Prospección en frío"],["Proactividad","Trabajo en equipo"],"Asesor interno con 2 años en sucursal; busca crecer a ventas digitales."),
  Cd(3,"Mariana Gutiérrez Solís","externo","Ventas","Key Account Manager","Senior",8,"Licenciatura titulado","Monterrey","Híbrido",32000,["Ventas B2B","CRM y Fidelización"],["Salesforce","Negociación comercial","Inglés avanzado","Excel avanzado"],["Negociación","Liderazgo","Comunicación efectiva"],"Manejo de cuentas clave corporativas en el norte del país; cartera de $40M anuales."),
  Cd(4,"Ricardo Anaya Torres","externo","Ventas","Vendedor de campo","Junior",3,"Bachillerato","Puebla","Presencial",11000,["Ventas B2C"],["Prospección en frío"],["Adaptabilidad","Orientación a resultados"],"Ventas puerta a puerta de servicios financieros; excede cuota trimestral consistentemente."),
  Cd(5,"Ana Sofía Lira Medina","externo","Datos y Analítica","Analista de datos Sr","Senior",6,"Maestría","CDMX","Híbrido",42000,["Ciencia de Datos","Business Intelligence"],["Python","SQL","Power BI","Excel avanzado"],["Pensamiento analítico","Atención al detalle","Comunicación efectiva"],"Modelos de propensión y tableros ejecutivos para banca de consumo."),
  Cd(6,"Diego Ramírez Cline","interno","Datos y Analítica","Analista de BI","Semi-Senior",4,"Licenciatura titulado","CDMX","Híbrido",28000,["Business Intelligence"],["SQL","Power BI","Tableau","Excel avanzado"],["Pensamiento analítico","Gestión del tiempo"],"Colaborador interno del área de riesgos; automatizó el reporteo semanal de cartera."),
  Cd(7,"Fernanda Cabrera Núñez","externo","Datos y Analítica","Científica de datos","Semi-Senior",4,"Maestría","Guadalajara","Remoto",38000,["Ciencia de Datos"],["Python","SQL","Tableau"],["Pensamiento analítico","Proactividad","Adaptabilidad"],"NLP y modelos de churn en fintech; publicaciones en meetups de datos GDL."),
  Cd(8,"Héctor Salgado Ponce","externo","Datos y Analítica","Ingeniero de datos","Senior",7,"Licenciatura titulado","Querétaro","Remoto",45000,["Ciencia de Datos","Infraestructura TI"],["Python","SQL","SAP"],["Atención al detalle","Trabajo en equipo"],"Pipelines de datos sobre SAP BW y nube; migración de DWH bancario."),
  Cd(9,"Lucía Herrera Bautista","externo","Tecnología","Desarrolladora Frontend","Semi-Senior",4,"Licenciatura titulado","CDMX","Híbrido",34000,["Desarrollo Frontend","UX/UI"],["React","Figma","Node.js"],["Trabajo en equipo","Atención al detalle","Proactividad"],"SPAs bancarias con React; obsesionada con accesibilidad y design systems."),
  Cd(10,"Emilio Castañeda Vela","externo","Tecnología","Desarrollador Backend","Senior",7,"Licenciatura titulado","Monterrey","Remoto",48000,["Desarrollo Backend"],["Node.js","Python","SQL","Scrum"],["Pensamiento analítico","Gestión del tiempo","Liderazgo"],"APIs de alta concurrencia para pagos; lideró célula de 5 devs."),
  Cd(11,"Paola Reyes Ibarra","interno","Tecnología","Ingeniera de soporte","Junior",2,"Técnico Superior","CDMX","Presencial",15000,["Infraestructura TI"],["Redes Cisco","Excel avanzado"],["Orientación al servicio","Resolución de conflictos","Empatía"],"Soporte N2 interno; certificación CCNA en curso."),
  Cd(12,"Andrés Molina Farías","externo","Tecnología","Especialista en ciberseguridad","Senior",8,"Maestría","CDMX","Híbrido",55000,["Ciberseguridad","Infraestructura TI"],["Python","Redes Cisco","Inglés avanzado"],["Atención al detalle","Pensamiento analítico"],"Pentesting y respuesta a incidentes en sector financiero; CISSP."),
  Cd(13,"Gabriela Fuentes Roldán","externo","Marketing","Especialista en marketing digital","Semi-Senior",5,"Licenciatura titulado","CDMX","Híbrido",26000,["Marketing Digital","CRM y Fidelización"],["Google Ads","Meta Ads","SEO","CRM"],["Creatividad","Orientación a resultados","Comunicación efectiva"],"Campañas performance con ROAS 6x en e-commerce; certificada Google."),
  Cd(14,"Tomás Aguilar Prieto","externo","Marketing","Coordinador de contenido","Junior",3,"Licenciatura titulado","Mérida","Remoto",18000,["Marketing Digital"],["SEO","Meta Ads"],["Creatividad","Proactividad"],"Contenido orgánico y paid para marcas regionales del sureste."),
  Cd(15,"Renata Villaseñor Ochoa","interno","Marketing","Analista de CRM","Semi-Senior",4,"Licenciatura titulado","CDMX","Híbrido",24000,["CRM y Fidelización"],["CRM","SQL","Excel avanzado"],["Pensamiento analítico","Atención al detalle"],"Journeys de retención y segmentación de clientes en el área de lealtad del grupo."),
  Cd(16,"Sebastián Cordero Lima","externo","Finanzas","Analista financiero","Semi-Senior",5,"Licenciatura titulado","CDMX","Presencial",27000,["Planeación Financiera"],["Modelado financiero","Excel avanzado","SAP"],["Pensamiento analítico","Atención al detalle","Gestión del tiempo"],"Presupuestos y forecast para grupo industrial; usuario avanzado de SAP FI."),
  Cd(17,"Isabela Franco Duarte","externo","Finanzas","Contadora Sr","Senior",9,"Licenciatura titulado","Toluca","Híbrido",35000,["Contabilidad"],["Contabilidad NIF","SAP","Excel avanzado","Nómina"],["Atención al detalle","Gestión del tiempo"],"Cierres contables y auditorías en corporativo retail; NIF y fiscal."),
  Cd(18,"Óscar Beltrán Nava","interno","Finanzas","Auxiliar contable","Junior",2,"Licenciatura trunca","CDMX","Presencial",12500,["Contabilidad","Cobranza"],["Excel avanzado","Contabilidad NIF"],["Proactividad","Atención al detalle"],"Auxiliar interno en cuentas por pagar; estudia los fines de semana."),
  Cd(19,"Camila Estrada Peralta","externo","Recursos Humanos","Reclutadora IT","Semi-Senior",4,"Licenciatura titulado","Guadalajara","Remoto",22000,["Atracción de Talento"],["CRM","Inglés avanzado"],["Empatía","Comunicación efectiva","Negociación"],"Headhunting de perfiles tech; 90+ contrataciones cerradas en 2 años."),
  Cd(20,"Rodrigo Zamora Field","externo","Recursos Humanos","Especialista en capacitación","Senior",7,"Maestría","CDMX","Híbrido",30000,["Capacitación"],["LMS","Excel avanzado"],["Liderazgo","Comunicación efectiva","Empatía"],"Diseño instruccional y universidades corporativas; implementó LMS para 8,000 usuarios."),
  Cd(21,"Ximena Rosales Vidal","interno","Recursos Humanos","Generalista de RRHH","Semi-Senior",5,"Licenciatura titulado","Monterrey","Presencial",21000,["Atracción de Talento","Capacitación"],["Nómina","Excel avanzado","LMS"],["Empatía","Resolución de conflictos","Trabajo en equipo"],"Generalista de planta con foco en clima laboral y onboarding."),
  Cd(22,"Bruno Cervantes Haro","externo","Operaciones","Supervisor de logística","Semi-Senior",6,"Licenciatura titulado","León","Presencial",23000,["Logística","Cadena de Suministro"],["SAP","Excel avanzado"],["Liderazgo","Tolerancia a la presión","Gestión del tiempo"],"CEDIS de 120 personas; redujo mermas 18% en un año."),
  Cd(23,"Daniela Paredes Luna","externo","Operaciones","Analista de cadena de suministro","Junior",2,"Licenciatura titulado","Querétaro","Híbrido",16000,["Cadena de Suministro"],["Excel avanzado","SQL"],["Pensamiento analítico","Atención al detalle"],"Planeación de demanda en manufactura; egresada con honores del ITQ."),
  Cd(24,"Marcos Ibáñez Cruz","interno","Operaciones","Jefe de piso","Senior",9,"Bachillerato","CDMX","Presencial",19000,["Logística","Servicio al Cliente"],["Excel avanzado"],["Liderazgo","Resolución de conflictos","Tolerancia a la presión"],"12 años en tiendas del grupo; conoce la operación de punta a punta."),
  Cd(25,"Sofía Nieto Arellano","externo","Atención a Clientes","Ejecutiva de servicio","Junior",2,"Técnico Superior","CDMX","Presencial",11500,["Servicio al Cliente"],["Zendesk","CRM"],["Empatía","Comunicación efectiva","Orientación al servicio"],"Atención omnicanal en telecom; NPS personal de 92."),
  Cd(26,"Iván Quintero Mora","externo","Atención a Clientes","Coordinador de call center","Semi-Senior",6,"Licenciatura titulado","Tijuana","Presencial",20000,["Servicio al Cliente","Cobranza"],["Zendesk","CRM","Excel avanzado"],["Liderazgo","Tolerancia a la presión","Resolución de conflictos"],"Coordinó célula de 35 agentes bilingües; mejoró AHT 22%."),
  Cd(27,"Regina Salas Montaño","interno","Atención a Clientes","Agente senior","Semi-Senior",4,"Bachillerato","CDMX","Presencial",13500,["Servicio al Cliente","Cobranza"],["Zendesk","CRM"],["Empatía","Orientación al servicio","Adaptabilidad"],"Agente interna con mejores métricas de retención de clientes 2025."),
  Cd(28,"Federico Lozano Gil","externo","Legal","Abogado corporativo","Senior",8,"Maestría","CDMX","Híbrido",46000,["Derecho Corporativo","Cumplimiento (Compliance)"],["Inglés avanzado"],["Atención al detalle","Negociación","Pensamiento analítico"],"Contratos mercantiles, gobierno corporativo y PLD en sector financiero."),
  Cd(29,"Carolina Vega Serrano","externo","Legal","Analista de cumplimiento","Junior",3,"Licenciatura titulado","CDMX","Presencial",17000,["Cumplimiento (Compliance)"],["Excel avanzado"],["Atención al detalle","Proactividad"],"Monitoreo PLD y listas restrictivas en SOFOM; certificación CNBV en curso."),
  Cd(30,"Mateo Arriaga Solano","externo","Producto","Product Manager","Senior",7,"Maestría","CDMX","Híbrido",52000,["Gestión de Producto","UX/UI"],["Scrum","Figma","SQL","Inglés avanzado"],["Liderazgo","Comunicación efectiva","Pensamiento analítico"],"PM de apps financieras con 2M MAU; discovery continuo y OKRs."),
  Cd(31,"Julieta Márquez Ferrer","externo","Producto","UX Designer","Semi-Senior",5,"Licenciatura titulado","Guadalajara","Remoto",30000,["UX/UI"],["Figma","Scrum"],["Creatividad","Empatía","Atención al detalle"],"Research y diseño de flujos transaccionales; sistema de diseño multi-marca."),
  Cd(32,"Pablo Serna Cantú","interno","Ventas","Promotor financiero","Junior",1,"Bachillerato","Monterrey","Presencial",10500,["Ventas B2C","Cobranza"],["Prospección en frío"],["Proactividad","Adaptabilidad","Orientación a resultados"],"Promotor interno de crédito; primer año con 110% de cuota."),
];

/* Perfil de ejemplo para que el editor no luzca vacío en la demo (ids 1 y 5). */
Object.assign(SEED_CANDIDATOS.find(c=>c.id===1),{
  experiencia:[
    { puesto:"Ejecutiva de ventas retail", empresa:"Cadena Retail del Grupo", inicio:"2021-03", fin:"" },
    { puesto:"Asesora telefónica", empresa:"Contact Center Norte", inicio:"2019-01", fin:"2021-02" },
  ],
  educacion:[
    { institucion:"Universidad del Valle de México", titulo:"Lic. en Administración", inicio:"2014-08", fin:"2018-12" },
  ],
  intereses:["Emplearme","Crecer mi puesto"],
});
Object.assign(SEED_CANDIDATOS.find(c=>c.id===5),{
  experiencia:[
    { puesto:"Analista de datos Sr", empresa:"Banca de Consumo", inicio:"2020-06", fin:"" },
    { puesto:"Analista de BI", empresa:"Fintech MX", inicio:"2017-09", fin:"2020-05" },
  ],
  educacion:[
    { institucion:"Tecnológico de Monterrey", titulo:"Mtría. en Ciencia de Datos", inicio:"2018-01", fin:"2019-12" },
    { institucion:"UNAM", titulo:"Lic. en Actuaría", inicio:"2011-08", fin:"2016-06" },
  ],
  intereses:["Crecer mi puesto","Cambiar de área"],
});
Object.assign(SEED_CANDIDATOS.find(c=>c.id===2),{
  experiencia:[
    { puesto:"Asesor comercial", empresa:"Sucursal Centro · Grupo", inicio:"2024-02", fin:"" },
    { puesto:"Promotor de piso", empresa:"Tienda departamental", inicio:"2022-06", fin:"2024-01" },
  ],
  educacion:[
    { institucion:"Universidad Tecnológica de México", titulo:"Lic. en Mercadotecnia (trunca)", inicio:"2019-08", fin:"" },
    { institucion:"CBTIS No. 12", titulo:"Bachillerato técnico en Administración", inicio:"2016-08", fin:"2019-06" },
  ],
  intereses:["Crecer mi puesto","Cambiar de área"],
});

const FORMADORES = [
  // favoritosCands / categorias: pool de talento propio del formador (Batch 1 · globales por formador)
  { id:"F1", nombre:"Laura Mendoza Prieto", puesto:"Gerente de Ventas Digitales", area:"Ventas", favoritosCands:[], categorias:[] },
  { id:"F2", nombre:"Arturo Castillo Vega", puesto:"Director de Datos", area:"Datos y Analítica", favoritosCands:[], categorias:[] },
];
const ADMIN = { id:"A1", nombre:"Carlos Ruiz Delgado", puesto:"Administrador · Talento GS" };

const mkReq = (o)=>({
  titulo:"", area:AREAS[0], descripcion:"", nivelPuesto:"Junior", anosExp:1, educacion:"Licenciatura titulado",
  espRequeridas:[], espOpcionales:[], hardSkills:[], softSkills:[], aptitudes:[],
  killer:[], ubicacionTrabajo:"CDMX", modalidad:"Presencial", ubicacionCandidato:"CDMX", radioKm:25,
  salarioMin:10000, salarioMax:20000, horario:"9:00 – 18:00", dias:["Lun","Mar","Mié","Jue","Vie"], numVacantes:1,
  examenMedico:false,
  // Batch 5 (A2–A5): sede, unidad de negocio, tipo de vacante, flags "no relevante" y edad preferida.
  // Defaults inofensivos: nada de esto afecta matchScore salvo ubicacionNoRelevante (puntaje completo de distancia).
  tipoSede:"Corporativo", sede:"", unidadNegocio:"", tipoVacante:"Estándar",
  puedeSerSuperior:false, ubicacionNoRelevante:false, expNoRelevante:false,
  edadMin:18, edadMax:65, edadNoRelevante:false, ...o });

const SEED_VACANTES = [
  { id:"V-1042", estado:"asignada", formadorId:"F1", creada:"01 jul 2026", pipeline:{}, historial:[], cambios:null, archivados:[],
    req: mkReq({ titulo:"Ejecutivo de Ventas Digitales", area:"Ventas",
      descripcion:"Responsable de la venta consultiva de productos financieros por canales digitales: prospección, seguimiento en CRM y cierre remoto. Trabajará de la mano del equipo de marketing para convertir leads calificados.",
      nivelPuesto:"Semi-Senior", anosExp:3, espRequeridas:["Ventas B2C"], espOpcionales:["CRM y Fidelización","Servicio al Cliente"],
      hardSkills:["CRM","Negociación comercial","Prospección en frío"], softSkills:["Comunicación efectiva","Orientación a resultados","Empatía"],
      aptitudes:["Orientación al servicio","Tolerancia a la presión"],
      killer:[{q:"¿Cuentas con disponibilidad para laborar sábados medio día?"},{q:"¿Tienes al menos 2 años de experiencia en venta de productos financieros o intangibles?"}],
      ubicacionTrabajo:"CDMX", modalidad:"Híbrido", ubicacionCandidato:"CDMX", radioKm:30,
      salarioMin:14000, salarioMax:19000, horario:"9:00 – 18:00", numVacantes:2,
      tipoSede:"Corporativo", sede:"Corporativo Insurgentes Sur (CDMX)", unidadNegocio:"Ventas Digitales · Banca de Consumo", edadMin:22, edadMax:45 }) },
  { id:"V-1038", estado:"abierta", formadorId:"F1", creada:"24 jun 2026", pipeline:{}, historial:["Aprobada por el formador el 26 jun 2026"], cambios:null, archivados:[],
    req: mkReq({ titulo:"Coordinador de Atención a Clientes", area:"Atención a Clientes",
      descripcion:"Liderar una célula de 20 agentes de atención omnicanal, asegurando niveles de servicio, calidad y coaching continuo al equipo.",
      nivelPuesto:"Semi-Senior", anosExp:4, espRequeridas:["Servicio al Cliente"], espOpcionales:["Cobranza"],
      hardSkills:["Zendesk","CRM","Excel avanzado"], softSkills:["Liderazgo","Tolerancia a la presión","Empatía"],
      aptitudes:["Orientación al servicio","Liderazgo de equipos"],
      killer:[{q:"¿Has liderado equipos de 10 o más personas?"}],
      ubicacionTrabajo:"CDMX", modalidad:"Presencial", ubicacionCandidato:"CDMX", radioKm:40,
      salarioMin:17000, salarioMax:22000, horario:"8:00 – 17:00", numVacantes:1, examenMedico:true,
      tipoSede:"Sucursal", sede:"Sucursal Centro Histórico (CDMX)", unidadNegocio:"Atención Omnicanal", edadMin:25, edadMax:50 }) },
  { id:"V-1035", estado:"abierta", formadorId:"F2", creada:"18 jun 2026", pipeline:{}, historial:["Aprobada por el formador el 19 jun 2026"], cambios:null, archivados:[],
    req: mkReq({ titulo:"Analista de Datos Sr", area:"Datos y Analítica",
      descripcion:"Construcción de modelos analíticos y tableros para la dirección de crédito. Trabajo cercano con negocio para traducir preguntas en datos.",
      nivelPuesto:"Senior", anosExp:5, espRequeridas:["Ciencia de Datos","Business Intelligence"], espOpcionales:["Infraestructura TI"],
      hardSkills:["Python","SQL","Power BI"], softSkills:["Pensamiento analítico","Comunicación efectiva"],
      aptitudes:["Razonamiento numérico","Razonamiento lógico"],
      killer:[{q:"¿Dominas SQL a nivel avanzado (ventanas, CTEs, optimización)?"}],
      ubicacionTrabajo:"CDMX", modalidad:"Híbrido", ubicacionCandidato:"CDMX", radioKm:50,
      salarioMin:35000, salarioMax:45000, horario:"9:00 – 18:00", numVacantes:1,
      tipoSede:"Corporativo", sede:"Corporativo Santa Fe (CDMX)", unidadNegocio:"Dirección de Crédito", edadNoRelevante:true }) },
];

/* ============================== UTILIDADES ============================== */
let _id = 100;
const uid = (p)=> p + (++_id);
const hoy = ()=> new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"});
const hora = ()=> new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});
const money = (n)=> "$" + Number(n).toLocaleString("es-MX");

/* Convierte fechas "01 jul 2026" (formato de hoy()) en un valor numérico ordenable */
const MESES_ABR = { ene:0, feb:1, mar:2, abr:3, may:4, jun:5, jul:6, ago:7, sep:8, oct:9, nov:10, dic:11 };
function fechaVal(s){
  const m=String(s||"").toLowerCase().match(/(\d{1,2})\s+([a-zñ]{3})\.?\s+(\d{4})/);
  if(!m) return 0;
  return Number(m[3])*10000 + (MESES_ABR[m[2]]??0)*100 + Number(m[1]);
}

/* Próximas fechas de ingreso en inicio de quincena (día 1 o 16) */
function fechasQuincena(){
  const out=[]; const d=new Date();
  for(let i=0;i<5 && out.length<4;i++){
    const base=new Date(d.getFullYear(), d.getMonth()+i, 1);
    [1,16].forEach(day=>{
      const f=new Date(base.getFullYear(), base.getMonth(), day);
      if(f>d && out.length<4) out.push(f.toLocaleDateString("es-MX",{weekday:"long",day:"numeric",month:"long",year:"numeric"}));
    });
  }
  return out;
}

/* Distancias simuladas entre ciudades (km) para el radio de búsqueda */
const KM = { CDMX:{CDMX:0,Toluca:65,Puebla:130,Querétaro:210,Guadalajara:540,Monterrey:900,León:390,Mérida:1300,Tijuana:2800},
  Monterrey:{Monterrey:0,CDMX:900,Querétaro:700,Guadalajara:770,León:590,Toluca:940,Puebla:990,Mérida:1900,Tijuana:2300},
  Guadalajara:{Guadalajara:0,León:220,CDMX:540,Querétaro:350,Toluca:480,Monterrey:770,Puebla:660,Mérida:1800,Tijuana:2200} };
const distKm = (a,b)=> (KM[a]&&KM[a][b]!=null)?KM[a][b]:(a===b?0:600);

/* ===== Motor de match (simula al agente de IA de ranking) ===== */
function matchScore(c, req){
  let s=0;
  const inter=(a,b)=> a.filter(x=>b.includes(x)).length;
  const er=req.espRequeridas.length? inter(c.esp,req.espRequeridas)/req.espRequeridas.length : 0.5;
  s += er*34;
  if(req.espOpcionales.length) s += (inter(c.esp,req.espOpcionales)/req.espOpcionales.length)*6;
  if(req.hardSkills.length) s += (inter(c.hard,req.hardSkills)/req.hardSkills.length)*24;
  if(req.softSkills.length) s += (inter(c.soft,req.softSkills)/req.softSkills.length)*8;
  const ni=NIVELES.indexOf(c.nivel), nr=NIVELES.indexOf(req.nivelPuesto);
  s += ni===nr?12 : Math.abs(ni-nr)===1?7:1;
  s += c.exp>=req.anosExp?8 : (c.exp/Math.max(req.anosExp,1))*5;
  const d=distKm(req.ubicacionCandidato,c.ciudad);
  /* "Ubicación no relevante" (Batch 5 · A5): el componente de distancia otorga puntaje completo */
  s += req.ubicacionNoRelevante?7 : (req.modalidad==="Remoto"||c.modalidad==="Remoto")?7 : d<=req.radioKm?7 : d<=req.radioKm*4?3:0;
  if(c.modalidad===req.modalidad||req.modalidad==="Remoto") s+=3;
  s += ((c.id*37)%7)-3; // variación determinística leve
  return Math.max(0,Math.min(98,Math.round(s)));
}
function buildPool(cands, req){
  return cands.map(c=>({cid:c.id, match:matchScore(c,req)}))
    .filter(x=>x.match>=28)
    .sort((a,b)=>b.match-a.match);
}

/* CV descargable (demo) */
function descargarCV(c){
  const html=`<!doctype html><html lang="es"><meta charset="utf-8"><title>CV ${c.nombre}</title>
  <body style="font-family:Segoe UI,Arial,sans-serif;max-width:720px;margin:40px auto;color:#1A1A1A">
  <div style="border-bottom:4px solid #FFB81C;padding-bottom:12px"><h1 style="margin:0">${c.nombre}</h1>
  <p style="margin:4px 0;color:#555">${c.puesto} · ${c.nivel} · ${c.ciudad} · ${c.email} · ${c.tel}</p></div>
  <h3>Resumen profesional</h3><p>${c.resumen}</p>
  <h3>Especialidades</h3><p>${c.esp.join(" · ")}</p>
  <h3>Habilidades técnicas</h3><p>${c.hard.join(" · ")}</p>
  <h3>Habilidades blandas</h3><p>${c.soft.join(" · ")}</p>
  <h3>Formación</h3><p>${c.edu} · ${c.exp} años de experiencia</p>
  <p style="margin-top:30px;font-size:11px;color:#999">Documento generado por Reclutalia (prototipo demo).</p></body></html>`;
  const blob=new Blob([html],{type:"text/html"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download=`CV_${c.nombre.replace(/ /g,"_")}.html`; a.click(); URL.revokeObjectURL(a.href);
}

const numEmpleado=(cid)=> String(1000000 + (cid*73573)%9000000).slice(0,7);

/* Contacto simulado del formador (Batch 3 · F12): correo y teléfono deterministas */
const sinAcentos=(s)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const correoFormador=(f)=>{ const p=sinAcentos(f.nombre).toLowerCase().replace(/[^a-z ]/g,"").split(" ").filter(Boolean); return (p[0]||"formador")+"."+(p[1]||"equipo")+"@elektra.com.mx"; };
const telFormador=(f)=>{ const n=Number(String(f.id).replace(/\D/g,""))||1; const d=String(41000000 + (n*137137)%9000000).slice(0,8); return "+52 55 "+d.slice(0,4)+" "+d.slice(4); };

/* Dirección corporativa por defecto para la presentación de ingreso (Batch 5 · demo) */
const DIRECCION_CORP = "Av. Insurgentes Sur 3579, Tlalpan, 14000 Ciudad de México, CDMX";
const mapsUrl = (dir)=> "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(dir||DIRECCION_CORP);

/* Examen médico condicional (Batch 6) — sucursales autorizadas simuladas (siempre las mismas) */
const SUCURSALES_MEDICAS = [
  { nombre:"Clínica Salud Integral · Centro", dir:"Av. Juárez 120, Col. Centro" },
  { nombre:"Laboratorios BienestarMx · Sur", dir:"Calz. de Tlalpan 2100, Col. Country Club" },
  { nombre:"Centro Médico Empresarial · Norte", dir:"Av. Instituto Politécnico Nacional 1550, Col. Lindavista" },
  { nombre:"Unidad de Diagnóstico · Poniente", dir:"Av. Observatorio 340, Col. Daniel Garza" },
  { nombre:"Clínica Ejecutiva · Reforma", dir:"Paseo de la Reforma 450, Col. Juárez" },
];
/* Próximos n días (para agendar el examen médico dentro de la próxima semana) */
function proximosDias(n=7){
  const out=[]; const d=new Date();
  for(let i=1;i<=n;i++){
    const f=new Date(d.getFullYear(), d.getMonth(), d.getDate()+i);
    out.push(f.toLocaleDateString("es-MX",{weekday:"long",day:"numeric",month:"long"}));
  }
  return out;
}

/* Vigencia del examen psicométrico: válido 6 meses desde su realización (Batch 4) */
const SEIS_MESES_MS = 1000*60*60*24*182;
const psicoVigente = (p)=> !!(p && p.ts && (Date.now()-p.ts < SEIS_MESES_MS));
function psicoVigenteHasta(p){
  if(!p || !p.ts) return "";
  const d=new Date(p.ts+SEIS_MESES_MS);
  return d.toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"});
}

/* Página simulada de apertura de cuenta de nómina (Batch 5) */
function abrirAperturaCuenta(){
  const html=`<!doctype html><html lang="es"><meta charset="utf-8"><title>Apertura de cuenta de nómina</title>
  <body style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:60px auto;color:#1A1A1A;text-align:center">
  <div style="border-top:6px solid #FFB81C;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.12);padding:36px">
  <h1 style="margin:0 0 6px">Apertura de cuenta de nómina</h1>
  <p style="color:#8A6400;font-weight:600;margin:0 0 20px">Portal del banco (simulado · demo Reclutalia)</p>
  <p style="line-height:1.6;color:#3D3D3D">En la versión final, este enlace abrirá el portal del banco para que abras tu cuenta de nómina en línea con tu INE y RFC. Al terminar recibirás tu número de cuenta / CLABE, que deberás capturar en Reclutalia.</p>
  <p style="margin-top:26px;font-size:12px;color:#999">Esta es una página de demostración; no se captura ni envía información real.</p>
  </div></body></html>`;
  const blob=new Blob([html],{type:"text/html"});
  const url=URL.createObjectURL(blob);
  window.open(url,"_blank"); setTimeout(()=>URL.revokeObjectURL(url),4000);
}

/* ============================== COMPONENTES BASE ============================== */
function Modal({onClose, children, wide}){
  return (
    <div className="modal-bg" onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className={"modal"+(wide?" wide":"")}>
        <button className="xclose" onClick={onClose}><X size={16}/></button>
        {children}
      </div>
    </div>
  );
}
function Chip({tone="", icon:Icon, children}){
  return <span className={"chip "+tone}>{Icon && <Icon size={12}/>}{children}</span>;
}
/* Color del ring por banda de ranking (Batch 1 · F14):
   ≥90 verde fuerte · 70–89 verde claro · 50–69 café · <50 gris */
const bandCol = (v)=> v>=90?"var(--ok)": v>=70?"#3E9B5F": v>=50?"#8B5E34":"var(--gray)";
function MatchRing({v, size=52}){
  const r=(size/2)-4, c=2*Math.PI*r;
  const col = bandCol(v);
  return (
    <div className="ring" style={{width:size,height:size}} title={`Match ${v}%`}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--line)" strokeWidth="5" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={col} strokeWidth="5" fill="none"
          strokeDasharray={c} strokeDashoffset={c*(1-v/100)} strokeLinecap="round"/>
      </svg>
      <b style={{color:col}}>{v}%</b>
    </div>
  );
}
function Avatar({nombre, foto}){
  if(foto) return <img className="avatar" src={foto} alt={nombre}/>;
  const ini=nombre.split(" ").slice(0,2).map(p=>p[0]).join("");
  return <div className="avatar">{ini}</div>;
}
/* Barra de proceso en 3 fases con sub-pasos palomeados (Batch 4 · F13).
   Completa: con onSub/activo se vuelve interactiva y hace de tabs en VacanteDetail.
   Compacta (compact): pills de fase + "Etapa n · sub-paso actual" para listados. */
function FasesBar({v, compact, activo, onSub}){
  const {fase, subpaso, completados}=faseVacante(v);
  const done=completados.every(Boolean);
  if(compact){
    const SUBS=FASES.flatMap(f=>f.subs);
    return (
      <div className="fases-c">
        {FASES.map((f,i)=>{
          const st=done||i+1<fase?" done":i+1===fase?" now":"";
          return (
            <span key={f.nombre} className={"fase-pill"+st}>
              {done||i+1<fase? <Check size={11}/> : <span className="fase-n">{i+1}</span>}{f.nombre}
            </span>
          );
        })}
        <span className="fase-txt">{done? "Proceso completado ✓" : `Etapa ${fase} · ${SUBS[subpaso]}`}</span>
      </div>
    );
  }
  const habilitado=(i)=> i===0 || v.estado==="abierta" || v.estado==="cerrada";
  return (
    <div className="fases">
      {FASES.map((f,gi)=>{
        const base=FASES.slice(0,gi).reduce((a,x)=>a+x.subs.length,0);
        const faseDone=done||gi+1<fase;
        const actual=!done&&gi+1===fase;
        return (
          <div key={f.nombre} className={"fase-box"+(actual?" now":faseDone?" done":"")}>
            <div className="fase-hd">{faseDone? <CheckCircle2 size={14}/> : <span className="fase-n">{gi+1}</span>} Fase {gi+1} · {f.nombre}</div>
            <div className="fase-subs">
              {f.subs.map((s,k)=>{
                const i=base+k, ok=completados[i];
                return onSub!=null
                  ? <button key={s} disabled={!habilitado(i)} className={"fase-sub"+(ok?" ok":"")+(activo===i?" on":"")} onClick={()=>onSub(i)}>{ok&&<Check size={12}/>}{s}</button>
                  : <span key={s} className={"fase-sub"+(ok?" ok":!done&&i===subpaso?" cur":"")}>{ok&&<Check size={12}/>}{s}</span>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
/* Mini pipeline del candidato */
function MiniPipe({estado}){
  const idx=PIPE_IDX[estado] ?? 0;
  if(idx<0) return <Chip tone="bad" icon={XCircle}>No continúa en el proceso</Chip>;
  return (
    <div>
      <div className="mini-pipe">{PIPE.map((_,i)=><i key={i} className={i<=idx?"f":""}/>)}</div>
      <div style={{fontSize:11,color:"var(--gold-dark)",fontWeight:700,marginTop:4}}>{PIPE[idx]} · paso {idx+1} de {PIPE.length}</div>
    </div>
  );
}
function EstadoChip({estado, candView}){
  const map={ invitado:["Invitado a postularse",""], postulado:["Postulado","gold"], filtros_ok:["Filtros aprobados","ok"],
    video_ia:["Video-IA en curso","ai"], evaluado:["Evaluado por IA","ai"], slots_enviados:["Esperando confirmación de horario",""],
    agendado:["Entrevista agendada","gold"], entrevistado:["Entrevistado","gold"], seleccionado:["Seleccionado","ok"],
    docs_completos:["Documentación completa","ok"], oferta_enviada:["Oferta enviada","gold"], oferta_aceptada:["Oferta aceptada","ok"],
    contratado:["Contratado","ok"], descartado:["Descartado","bad"], filtrado:["No pasó filtros","bad"] };
  let [t,tone]=map[estado]||[estado,""];
  /* En vistas del candidato, un proceso descartado se comunica como "Cerrada" (la vacante concluyó) */
  if(candView && estado==="descartado") t="Cerrada";
  return <Chip tone={tone}>{t}</Chip>;
}

/* QR decorativo estático (simulado) — no es escaneable, solo apariencia (Batch 5) */
function QRDemo({size=180}){
  const N=21, cell=size/N;
  const isFinder=(r,c)=>{
    const inBox=(br,bc)=> r>=br&&r<br+7&&c>=bc&&c<bc+7;
    const ring=(br,bc)=> inBox(br,bc) && (r===br||r===br+6||c===bc||c===bc+6 || (r>=br+2&&r<=br+4&&c>=bc+2&&c<=bc+4));
    return ring(0,0)||ring(0,N-7)||ring(N-7,0);
  };
  const inFinderZone=(r,c)=> (r<8&&c<8)||(r<8&&c>=N-8)||(r>=N-8&&c<8);
  const cells=[];
  for(let r=0;r<N;r++) for(let c=0;c<N;c++){
    if(isFinder(r,c)){ cells.push([r,c]); continue; }
    if(inFinderZone(r,c)) continue;
    if(((r*7+c*13+r*c*3)%5)===0 || ((r+c)%3===0 && (r*c)%2===0)) cells.push([r,c]);
  }
  return (
    <svg width={size} height={size} role="img" aria-label="Código QR (simulado)" style={{background:"#fff",borderRadius:10,border:"1px solid var(--line)"}}>
      {cells.map(([r,c],i)=><rect key={i} x={c*cell} y={r*cell} width={cell} height={cell} fill="#1A1A1A"/>)}
    </svg>
  );
}

/* Fase (1-3), sub-paso actual y sub-pasos completados de la vacante (Batch 4 · F13) */
function faseVacante(v){
  const ps=Object.values(v.pipeline||{});
  const mx=ps.length? Math.max(...ps.map(p=>PIPE_IDX[p.estado]??-1)) : -1;
  const aprobada=v.estado==="abierta"||v.estado==="cerrada";
  const completados=[
    aprobada,                                        // Descriptivo (aprobado por el formador)
    aprobada && ps.length>0,                         // Pool de talento (hay invitados/postulados)
    mx>=PIPE_IDX.evaluado,                           // Ranking y terna (hay evaluados)
    mx>=PIPE_IDX.entrevistado,                       // Entrevistas (hay entrevistados)
    mx>=PIPE_IDX.docs_completos,                     // Selección y documentos (ideal elegido + docs)
    mx>=PIPE_IDX.oferta_enviada,                     // Carta oferta (enviada o aceptada)
    v.estado==="cerrada" || mx>=PIPE_IDX.contratado, // Contratación (contrato firmado)
  ];
  let subpaso=completados.findIndex(x=>!x); if(subpaso<0) subpaso=completados.length-1;
  const fase= subpaso<2?1 : subpaso<5?2 : 3;
  return { fase, subpaso, completados };
}

/* ¿La vacante ya tiene candidato elegido? (Batch 3 · F10) — derivado del pipeline, sin nuevo estado */
const candidatoElegido=(v)=> v.estado!=="cerrada" && Object.values(v.pipeline||{}).some(p=>["seleccionado","docs_completos","oferta_enviada"].includes(p.estado));

/* ============================== BOT DE APOYO (transversal) ============================== */
const BOT_FAQ=[
  {q:"¿Qué es el pool de talento?", a:"Es el marketplace de candidatos internos y externos preregistrados. Al aprobar tu vacante, la IA busca, filtra y ranquea automáticamente los perfiles más compatibles."},
  {q:"¿Cómo funciona el ranking con IA?", a:"El agente de IA compara especialidades, habilidades, nivel, experiencia y ubicación contra tu vacante y asigna un match de 0 a 100%. Se actualiza tras la video-entrevista y la entrevista contigo."},
  {q:"¿Qué documentos sube el candidato?", a:"Para filtros iniciales: constancias de empleos previos y el examen psicométrico (válido 6 meses). Para contratación: INE, CURP, RFC, comprobante de domicilio, comprobante de estudios y su cuenta bancaria para nómina. Solo PDF, máximo 1 MB por archivo."},
  {q:"¿Puedo cambiar la vacante que me asignaron?", a:"Sí. Antes de aprobarla puedes solicitar cambios al administrador desde la pestaña Descriptivo; recibirás una notificación cuando esté actualizada."},
  {q:"¿Cómo agendo entrevistas?", a:"Al invitar candidatos a entrevista conectas tu calendario de Outlook/Teams (simulado) y propones 3 horarios; el candidato confirma uno y ambos reciben el enlace de Teams."},
];
function BotSoporte(){
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{de:"bot",t:"¡Hola! Soy tu asistente de Reclutalia. Estoy aquí durante todo el proceso para resolver dudas del formador y del candidato. Elige una pregunta frecuente:"}]);
  const ask=(f)=> setMsgs(m=>[...m,{de:"yo",t:f.q},{de:"bot",t:f.a}]);
  return (<>
    {open && (
      <div className="botpanel">
        <div style={{background:"var(--ink)",color:"#fff",padding:"12px 16px",display:"flex",alignItems:"center",gap:9}}>
          <Bot size={18} color="var(--gold)"/><b style={{fontSize:13.5}}>Asistente Reclutalia</b>
          <span className="chip ai" style={{marginLeft:"auto"}}>Bot de apoyo</span>
        </div>
        <div style={{padding:14,overflow:"auto",flex:1,display:"flex",flexDirection:"column",gap:8}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{alignSelf:m.de==="bot"?"flex-start":"flex-end",background:m.de==="bot"?"var(--bg)":"var(--gold-soft)",
              border:"1px solid var(--line)",borderRadius:12,padding:"8px 12px",fontSize:12.5,maxWidth:"85%"}}>{m.t}</div>
          ))}
        </div>
        <div style={{padding:12,borderTop:"1px solid var(--line)",display:"flex",flexDirection:"column",gap:6}}>
          {BOT_FAQ.map((f,i)=><button key={i} className="btn ghost sm" style={{justifyContent:"flex-start",textAlign:"left"}} onClick={()=>ask(f)}>{f.q}</button>)}
        </div>
      </div>
    )}
    <button className="botfab" onClick={()=>setOpen(o=>!o)} title="Bot interactivo de apoyo y soporte">
      {open? <X size={22}/> : <Bot size={24}/>}
    </button>
  </>);
}

/* ============================== PERFIL DE CANDIDATO (modal) ============================== */
/* Formatea "2021-03" → "mar 2021"; rango de experiencia/educación con "Actual" si no hay fin (Batch 2) */
const MESES3=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
function fmtMes(s){ if(!s) return ""; const [y,m]=String(s).split("-"); return (MESES3[Number(m)-1]||"")+" "+y; }
function rangoFechas(a,b){ if(!a&&!b) return ""; return `${fmtMes(a)}${a?" ":""}– ${b?fmtMes(b):"Actual"}`; }

function PerfilModal({cand, match, onClose, extra, req, fav, enCat, archivado, onFav, onCat, onArchivar}){
  /* Resalta en verde lo que el candidato tiene y coincide con el descriptivo de la vacante */
  const espHit=(e)=> req && (req.espRequeridas.includes(e)||req.espOpcionales.includes(e));
  const hardHit=(e)=> req && req.hardSkills.includes(e);
  const softHit=(e)=> req && req.softSkills.includes(e);
  const MC=({e,hit,base})=>(
    <span className={"chip "+(hit?"ok":base||"")}>{hit && <CheckCircle2 size={11}/>}{e}</span>
  );
  const [verExp,setVerExp]=useState(false);
  const [verEdu,setVerEdu]=useState(false);
  const exp=cand.experiencia||[], edu=cand.educacion||[], intereses=cand.intereses||[];
  const expShow=verExp?exp:exp.slice(0,3), eduShow=verEdu?edu:edu.slice(0,3);
  const conAcciones = onFav||onCat||onArchivar;   /* lo abre el formador */
  return (
    <Modal onClose={onClose} wide>
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:14}}>
        <Avatar nombre={cand.nombre} foto={cand.foto}/>
        <div style={{flex:1}}>
          <h3 style={{fontSize:18}}>{cand.nombre}</h3>
          <div style={{color:"var(--gold-dark)",fontSize:14,fontWeight:700,marginTop:1}}>{cand.puesto}</div>
          <div style={{color:"var(--gray)",fontSize:12.5}}>{cand.area}</div>
          <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
            <Chip tone={cand.tipo==="interno"?"gold":""} icon={Building2}>{cand.tipo==="interno"?"Candidato interno":"Candidato externo"}</Chip>
            <Chip icon={MapPin}>{cand.ciudad}</Chip>
            <Chip icon={Briefcase}>{cand.nivel} · {cand.exp} años</Chip>
            <Chip icon={GraduationCap}>{cand.edu}</Chip>
          </div>
        </div>
        {match!=null && <MatchRing v={match} size={64}/>}
      </div>
      {conAcciones && (
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
          {onFav && <button className={"btn sm "+(fav?"gold":"ghost")} onClick={onFav}><Heart size={13}/> {fav?"Favorito":"Marcar favorito"}</button>}
          {onCat && <button className={"btn sm "+(enCat?"gold":"ghost")} onClick={onCat}><FolderPlus size={13}/> Categorizar</button>}
          {onArchivar && <button className="btn ghost sm" onClick={onArchivar}>{archivado? <><ArchiveRestore size={13}/> Restaurar</> : <><Archive size={13}/> Archivar</>}</button>}
        </div>
      )}
      {cand.resumen && <p style={{fontSize:13.5,lineHeight:1.55,marginBottom:12}}>{cand.resumen}</p>}
      {intereses.length>0 && (
        <div style={{marginBottom:12}}><label>Interés actual</label>
          <div className="tagpick">{intereses.map(i=><Chip key={i} tone="gold">{i}</Chip>)}</div></div>
      )}
      {req && <div className="chip ok" style={{marginBottom:12}}><CheckCircle2 size={12}/> En verde: coincidencias con el descriptivo de la vacante</div>}
      <div className="grid2">
        <div><label>Especialidades</label><div className="tagpick">{cand.esp.map(e=><MC key={e} e={e} hit={espHit(e)} base="gold"/>)}</div></div>
        <div><label>Modalidad y expectativa</label><div className="tagpick"><Chip>{cand.modalidad}</Chip><Chip>{money(cand.salario)} /mes esperado</Chip></div></div>
        <div><label>Habilidades técnicas</label><div className="tagpick">{cand.hard.map(e=><MC key={e} e={e} hit={hardHit(e)}/>)}</div></div>
        <div><label>Habilidades blandas</label><div className="tagpick">{cand.soft.map(e=><MC key={e} e={e} hit={softHit(e)}/>)}</div></div>
      </div>
      {exp.length>0 && (
        <div style={{marginTop:16}}><label>Experiencia</label>
          {expShow.map((e,i)=>(
            <div key={i} style={{fontSize:13,marginTop:5,lineHeight:1.4}}>• <b>{e.puesto||"—"}</b>{e.empresa?` — ${e.empresa}`:""}
              {rangoFechas(e.inicio,e.fin) && <span style={{color:"var(--gray)"}}> ({rangoFechas(e.inicio,e.fin)})</span>}</div>
          ))}
          {exp.length>3 && <button className="btn ghost sm" style={{marginTop:8}} onClick={()=>setVerExp(x=>!x)}>{verExp?"Ver menos":`Ver más (${exp.length-3})`}</button>}
        </div>
      )}
      {edu.length>0 && (
        <div style={{marginTop:16}}><label>Educación</label>
          {eduShow.map((e,i)=>(
            <div key={i} style={{fontSize:13,marginTop:5,lineHeight:1.4}}>• <b>{e.titulo||"—"}</b>{e.institucion?` — ${e.institucion}`:""}
              {rangoFechas(e.inicio,e.fin) && <span style={{color:"var(--gray)"}}> ({rangoFechas(e.inicio,e.fin)})</span>}</div>
          ))}
          {edu.length>3 && <button className="btn ghost sm" style={{marginTop:8}} onClick={()=>setVerEdu(x=>!x)}>{verEdu?"Ver menos":`Ver más (${edu.length-3})`}</button>}
        </div>
      )}
      <div style={{display:"flex",gap:10,marginTop:20,flexWrap:"wrap"}}>
        <button className="btn ghost" onClick={()=>descargarCV(cand)}><Download size={15}/> Descargar CV</button>
        {extra}
      </div>
    </Modal>
  );
}

/* Editor del perfil del propio candidato — modal con pestañas "Mi perfil" / "Mis documentos" */
function PerfilEditor({cand, onSave, onClose}){
  const [c,setC]=useState(()=>({
    ...cand,
    esp:[...(cand.esp||[])], hard:[...(cand.hard||[])], soft:[...(cand.soft||[])],
    experiencia:(cand.experiencia||[]).map(x=>({...x})),
    educacion:(cand.educacion||[]).map(x=>({...x})),
    intereses:[...(cand.intereses||[])],
    docsPerfil:{ ine:null,curp:null,rfc:null,domicilio:null,estudios:null,cv:null,
      ...(cand.docsPerfil||{}),
      certificaciones:[...((cand.docsPerfil&&cand.docsPerfil.certificaciones)||[])] },
  }));
  const [tab,setTab]=useState(0);
  const set=(k,v)=>setC(x=>({...x,[k]:v}));
  const setDoc=(k,v)=>setC(x=>({...x,docsPerfil:{...x.docsPerfil,[k]:v}}));
  const addExp=()=>set("experiencia",[...c.experiencia,{puesto:"",empresa:"",inicio:"",fin:""}]);
  const setExp=(i,k,v)=>set("experiencia",c.experiencia.map((e,j)=>j===i?{...e,[k]:v}:e));
  const delExp=(i)=>set("experiencia",c.experiencia.filter((_,j)=>j!==i));
  const addEdu=()=>set("educacion",[...c.educacion,{institucion:"",titulo:"",inicio:"",fin:""}]);
  const setEdu=(i,k,v)=>set("educacion",c.educacion.map((e,j)=>j===i?{...e,[k]:v}:e));
  const delEdu=(i)=>set("educacion",c.educacion.filter((_,j)=>j!==i));
  const INTERESES=["Emplearme","Crecer mi puesto","Cambiar de área"];
  const toggleInt=(o)=>set("intereses",c.intereses.includes(o)?c.intereses.filter(x=>x!==o):[...c.intereses,o]);
  const setCert=(i,n)=>setDoc("certificaciones",c.docsPerfil.certificaciones.map((x,j)=>j===i?n:x));
  const addCert=(n)=>{ if(n) setDoc("certificaciones",[...c.docsPerfil.certificaciones,n]); };
  const delCert=(i)=>setDoc("certificaciones",c.docsPerfil.certificaciones.filter((_,j)=>j!==i));

  return (
    <Modal onClose={onClose} wide>
      <h3 style={{marginBottom:14}}>Editar perfil</h3>
      <div className="tabs">
        <button className={"tab"+(tab===0?" on":"")} onClick={()=>setTab(0)}>Mi perfil</button>
        <button className={"tab"+(tab===1?" on":"")} onClick={()=>setTab(1)}>Mis documentos</button>
      </div>

      {tab===0 && (<>
        <div className="field"><UploadFoto value={c.foto} nombre={c.nombre} onDone={v=>set("foto",v)}/></div>
        <div className="field"><label>Nombre completo</label><input value={c.nombre} onChange={e=>set("nombre",e.target.value)}/>
          <div className="help">Debe ser tu nombre tal como aparece en tu identificación oficial.</div></div>
        <div className="field"><label>Título</label><input value={c.puesto} onChange={e=>set("puesto",e.target.value)} placeholder="Ejecutivo de ventas | Marketing | Estrategia E-commerce"/></div>
        <div className="field"><label>Descripción</label><textarea rows={3} value={c.resumen} onChange={e=>set("resumen",e.target.value)} placeholder="Un párrafo describiéndote profesionalmente."/></div>
        <div className="grid2">
          <div className="field"><label>Correo</label><input value={c.email} onChange={e=>set("email",e.target.value)}/></div>
          <div className="field"><label>Contacto</label><input value={c.tel} onChange={e=>set("tel",e.target.value)}/></div>
        </div>

        <div className="field">
          <label>Experiencia</label>
          {c.experiencia.map((e,i)=>(
            <div className="trow" key={i} style={{flexWrap:"wrap"}}>
              <input placeholder="Puesto" value={e.puesto} onChange={ev=>setExp(i,"puesto",ev.target.value)} style={{flex:"1 1 170px"}}/>
              <input placeholder="Empresa" value={e.empresa} onChange={ev=>setExp(i,"empresa",ev.target.value)} style={{flex:"1 1 150px"}}/>
              <input type="month" value={e.inicio} onChange={ev=>setExp(i,"inicio",ev.target.value)} style={{flex:"0 1 140px"}} title="Inicio"/>
              <input type="month" value={e.fin} onChange={ev=>setExp(i,"fin",ev.target.value)} style={{flex:"0 1 140px"}} title="Fin (vacío = actual)"/>
              <button className="btn ghost sm" onClick={()=>delExp(i)} title="Eliminar"><X size={13}/></button>
            </div>
          ))}
          <button className="btn ghost sm" style={{marginTop:10}} onClick={addExp}><Plus size={13}/> Agregar experiencia</button>
        </div>

        <div className="field">
          <label>Educación</label>
          {c.educacion.map((e,i)=>(
            <div className="trow" key={i} style={{flexWrap:"wrap"}}>
              <input placeholder="Institución" value={e.institucion} onChange={ev=>setEdu(i,"institucion",ev.target.value)} style={{flex:"1 1 170px"}}/>
              <input placeholder="Título / grado" value={e.titulo} onChange={ev=>setEdu(i,"titulo",ev.target.value)} style={{flex:"1 1 150px"}}/>
              <input type="month" value={e.inicio} onChange={ev=>setEdu(i,"inicio",ev.target.value)} style={{flex:"0 1 140px"}} title="Inicio"/>
              <input type="month" value={e.fin} onChange={ev=>setEdu(i,"fin",ev.target.value)} style={{flex:"0 1 140px"}} title="Fin"/>
              <button className="btn ghost sm" onClick={()=>delEdu(i)} title="Eliminar"><X size={13}/></button>
            </div>
          ))}
          <button className="btn ghost sm" style={{marginTop:10}} onClick={addEdu}><Plus size={13}/> Agregar educación</button>
        </div>

        <div className="field" style={{maxWidth:340}}>
          <label>Nivel máximo de estudios</label>
          <select value={c.edu} onChange={e=>set("edu",e.target.value)}>{EDUCACION.map(a=><option key={a}>{a}</option>)}</select>
        </div>

        <div className="field"><label>Habilidades</label>
          <TagInput value={c.soft} onChange={v=>set("soft",v)} max={10} placeholder="Ej. Negociación, liderazgo…"
            help="Máx. 10. Ejemplos: negociación, liderazgo, análisis de datos, comunicación efectiva."/></div>
        <div className="field"><label>Herramientas</label>
          <TagInput value={c.hard} onChange={v=>set("hard",v)} max={10} placeholder="Ej. Excel, Power BI…"
            help="Máx. 10. Ejemplos: Excel, Office, Power BI, ChatGPT, Salesforce, SAP."/></div>

        <div className="field"><label>Intereses</label>
          <div className="tagpick">{INTERESES.map(o=><button type="button" key={o} className={"tag"+(c.intereses.includes(o)?" on":"")} onClick={()=>toggleInt(o)}>{o}</button>)}</div>
        </div>
      </>)}

      {tab===1 && (<>
        <p className="help" style={{marginBottom:12}}>Repositorio personal de documentos reutilizables. Se aprovecharán al aplicar a vacantes. Solo PDF · máximo 1 MB por archivo.</p>
        <label>Identidad</label>
        <div style={{marginTop:6}}>
          <UploadPDF label="Identificación oficial (INE)" value={c.docsPerfil.ine} onDone={n=>setDoc("ine",n)} onDelete={()=>setDoc("ine",null)}/>
          <UploadPDF label="CURP" value={c.docsPerfil.curp} onDone={n=>setDoc("curp",n)} onDelete={()=>setDoc("curp",null)}/>
          <UploadPDF label="Constancia de situación fiscal (RFC)" value={c.docsPerfil.rfc} onDone={n=>setDoc("rfc",n)} onDelete={()=>setDoc("rfc",null)}/>
        </div>
        <label style={{marginTop:16,display:"block"}}>Domicilio</label>
        <div style={{marginTop:6}}>
          <UploadPDF label="Comprobante de domicilio" value={c.docsPerfil.domicilio} onDone={n=>setDoc("domicilio",n)} onDelete={()=>setDoc("domicilio",null)}/>
        </div>
        <label style={{marginTop:16,display:"block"}}>Formación</label>
        <div style={{marginTop:6}}>
          <UploadPDF label="Comprobante de estudios / título" value={c.docsPerfil.estudios} onDone={n=>setDoc("estudios",n)} onDelete={()=>setDoc("estudios",null)}/>
          {c.docsPerfil.certificaciones.map((n,i)=>(
            <UploadPDF key={i} label={`Certificación ${i+1}`} value={n} onDone={nm=>setCert(i,nm)} onDelete={()=>delCert(i)}/>
          ))}
          <UploadPDF label="Agregar diplomado o certificación" value={null} onDone={n=>addCert(n)}/>
        </div>
        <label style={{marginTop:16,display:"block"}}>CV</label>
        <div style={{marginTop:6}}>
          <UploadPDF label="Currículum actualizado" value={c.docsPerfil.cv} onDone={n=>setDoc("cv",n)} onDelete={()=>setDoc("cv",null)}/>
        </div>
      </>)}

      <button className="btn gold" style={{marginTop:20}} onClick={()=>onSave(c)}><CheckCircle2 size={15}/> Guardar cambios</button>
    </Modal>
  );
}

/* ============================== SUBIDA DE ARCHIVO (PDF ≤ 1 MB) ============================== */
function UploadPDF({label, value, onDone, onDelete}){
  const ref=useRef(); const [err,setErr]=useState("");
  const pick=(e)=>{
    const f=e.target.files[0]; if(!f) return;
    if(f.type!=="application/pdf"){ setErr("Solo se permiten archivos PDF."); return; }
    if(f.size>1024*1024){ setErr("El archivo supera el límite de 1 MB."); return; }
    setErr(""); onDone(f.name);
  };
  return (
    <div className={"check-item"+(value?" done":"")}>
      {value? <CheckCircle2 size={20} color="var(--ok)"/> : <FileText size={20} color="var(--gray)"/>}
      <div style={{flex:1}}>
        <div style={{fontWeight:600,fontSize:13}}>{label}</div>
        <div className="help">{value? `Cargado: ${value}` : "PDF · máximo 1 MB"}</div>
        {err && <div style={{fontSize:11.5,color:"var(--bad)",marginTop:3}}><AlertCircle size={11} style={{verticalAlign:-1}}/> {err}</div>}
      </div>
      <input type="file" accept="application/pdf" ref={ref} style={{display:"none"}} onChange={pick}/>
      {!value && <button className="btn ghost sm" onClick={()=>ref.current.click()}><Upload size={13}/> Subir archivo</button>}
      {value && <button className="btn ghost sm" onClick={()=>ref.current.click()}>Reemplazar</button>}
      {value && onDelete && <button className="btn ghost sm" onClick={()=>{setErr("");onDelete();}}>Eliminar</button>}
    </div>
  );
}

/* Subida de foto de perfil — imagen JPG/PNG ≤ 2 MB, guardada como data URL */
function UploadFoto({value, nombre, onDone}){
  const ref=useRef(); const [err,setErr]=useState("");
  const pick=(e)=>{
    const f=e.target.files[0]; if(!f) return;
    if(!["image/png","image/jpeg"].includes(f.type)){ setErr("Solo se permiten imágenes JPG o PNG."); return; }
    if(f.size>2*1024*1024){ setErr("La imagen supera el límite de 2 MB."); return; }
    setErr("");
    const r=new FileReader(); r.onload=()=>onDone(r.result); r.readAsDataURL(f);
  };
  return (
    <div style={{display:"flex",gap:14,alignItems:"center"}}>
      {value? <img className="fotoprev" src={value} alt={nombre||"Foto de perfil"}/> : <div className="fotoprev"><User size={26}/></div>}
      <div>
        <input type="file" accept="image/png,image/jpeg" ref={ref} style={{display:"none"}} onChange={pick}/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button className="btn ghost sm" onClick={()=>ref.current.click()}><Upload size={13}/> {value?"Cambiar foto":"Subir foto"}</button>
          {value && <button className="btn ghost sm" onClick={()=>{setErr("");onDone(null);}}>Quitar</button>}
        </div>
        <div className="help">JPG o PNG · máximo 2 MB</div>
        {err && <div style={{fontSize:11.5,color:"var(--bad)",marginTop:3}}><AlertCircle size={11} style={{verticalAlign:-1}}/> {err}</div>}
      </div>
    </div>
  );
}

/* Selector múltiple con chips y opción de agregar nuevas */
function TagPicker({options, value, onChange, addNew}){
  const [nuevo,setNuevo]=useState("");
  const toggle=(o)=> onChange(value.includes(o)? value.filter(x=>x!==o): [...value,o]);
  return (
    <div>
      <div className="tagpick">
        {options.map(o=><button type="button" key={o} className={"tag"+(value.includes(o)?" on":"")} onClick={()=>toggle(o)}>{o}</button>)}
      </div>
      {addNew && (
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <input placeholder="Agregar otra opción…" value={nuevo} onChange={e=>setNuevo(e.target.value)} style={{maxWidth:260}}/>
          <button type="button" className="btn ghost sm" onClick={()=>{ if(nuevo.trim()){ onChange([...value,nuevo.trim()]); setNuevo(""); }}}><Plus size={13}/> Agregar</button>
        </div>
      )}
    </div>
  );
}

/* Etiquetas de texto libre con ✕ al hover (máx N) — usado en el perfil del candidato */
function TagInput({value, onChange, max=10, placeholder, help}){
  const [nuevo,setNuevo]=useState("");
  const lleno=value.length>=max;
  const add=()=>{
    const t=nuevo.trim(); if(!t){ return; }
    if(value.includes(t)||lleno){ setNuevo(""); return; }
    onChange([...value,t]); setNuevo("");
  };
  return (
    <div>
      {value.length>0 && (
        <div className="taginput">
          {value.map(t=>(
            <span key={t} className="tagx">{t}
              <button type="button" title="Quitar" onClick={()=>onChange(value.filter(x=>x!==t))}><X size={12}/></button>
            </span>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:8,marginTop:value.length>0?8:0}}>
        <input placeholder={placeholder||"Escribe y presiona Enter…"} value={nuevo} disabled={lleno}
          onChange={e=>setNuevo(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); add(); } }} style={{maxWidth:320}}/>
        <button type="button" className="btn ghost sm" disabled={lleno||!nuevo.trim()} onClick={add}><Plus size={13}/> Agregar</button>
      </div>
      {help && <div className="help">{help}</div>}
      {lleno && <div className="help">Máximo {max} elementos.</div>}
    </div>
  );
}

/* ============================== ACCIONES DE NEGOCIO (estado) ============================== */
function notify(db, para, titulo, msg, vacId){
  db.notifs.unshift({ id:uid("N"), para, titulo, msg, vacId, fecha:hoy()+" · "+hora(), leida:false });
}
const pAct=(v,cid)=> v.pipeline[cid];

/* ¿El horario ya fue confirmado por otro candidato de esta vacante? (Batch 3 · F4) */
const slotTomado=(v,slot,cid)=> Object.entries(v.pipeline).some(([ocid,op])=> Number(ocid)!==Number(cid) && op.slotElegido===slot && !["descartado","filtrado"].includes(op.estado));

const ACT={
  /* Admin crea/edita vacante y la asigna a un formador */
  crearVacante(db, req, formadorId){
    const v={ id:uid("V-2"), estado:"asignada", formadorId, creada:hoy(), req, pipeline:{}, historial:["Creada por el administrador el "+hoy()], cambios:null, archivados:[] };
    db.vacantes.unshift(v);
    notify(db,{tipo:"formador",id:formadorId},"Se te liberó una nueva vacante",`La vacante ${v.id} · "${req.titulo}" fue asignada a ti. Revisa el descriptivo, solicita cambios o apruébala para iniciar la búsqueda.`,v.id);
    return v.id;
  },
  /* Batch 6 (A8): al reenviar, registra qué campos se aplicaron y cuáles se rechazaron.
     nota = comentario general opcional del administrador; queda en v.historial (visible para ambos). */
  editarVacante(db, vacId, req, rechazados=[], nota=""){
    const v=db.vacantes.find(x=>x.id===vacId); const prev=v.cambios; v.req=req;
    const eraCambios=v.estado==="cambios";
    if(eraCambios){
      v.estado="asignada"; v.cambios=null;
      const nom=(ks)=>ks.map(k=>CAMPOS_DESC[k]||k).join(", ");
      let det="";
      if(prev && typeof prev==="object"){
        const sol=Object.keys(prev);
        const rech=rechazados.filter(k=>sol.includes(k));
        const apl=sol.filter(k=>!rech.includes(k));
        det=(apl.length?`Cambios aplicados: ${nom(apl)}`:"Sin cambios aplicados")+(rech.length?` · Rechazados: ${nom(rech)}`:"");
      } else det="El administrador aplicó los cambios solicitados";
      v.historial.push(det+" · "+hoy());
      if(nota) v.historial.push(`Nota del administrador: "${nota}" · `+hoy());
      notify(db,{tipo:"formador",id:v.formadorId},"Vacante actualizada",`El descriptivo de ${v.id} · "${req.titulo}" fue actualizado. ${det}.${nota?` Nota del administrador: "${nota}".`:""} Revísalo y apruébalo para iniciar la búsqueda.`,v.id);
    } else if(nota){
      v.historial.push(`Nota del administrador: "${nota}" · `+hoy());
    }
  },
  /* Batch 6 (F15): cambios = {campo:anotación} (por campo); un string legado sigue funcionando */
  solicitarCambios(db, vacId, cambios){
    const v=db.vacantes.find(x=>x.id===vacId);
    v.estado="cambios"; v.cambios=cambios;
    const porCampo = cambios && typeof cambios==="object";
    const resumen = porCampo ? Object.entries(cambios).map(([k,a])=>`${CAMPOS_DESC[k]||k}: ${a}`).join(" · ") : cambios;
    v.historial.push("El formador solicitó cambios"+(porCampo?` en ${Object.keys(cambios).length} campo(s)`:"")+" · "+hoy());
    notify(db,{tipo:"admin",id:"A1"},"Cambios solicitados en "+vacId,`El formador solicitó ajustes al descriptivo de "${v.req.titulo}": ${resumen}`,v.id);
  },
  aprobarVacante(db, vacId){
    const v=db.vacantes.find(x=>x.id===vacId);
    v.estado="abierta"; v.historial.push("Descriptivo aprobado por el formador · "+hoy());
    /* La IA busca, filtra y ranquea el marketplace */
    v.pool=buildPool(db.candidatos, v.req);
    notify(db,{tipo:"formador",id:v.formadorId},"Tu pool de talento está listo",`La IA analizó el marketplace y encontró ${v.pool.length} candidatos compatibles para ${v.id} · "${v.req.titulo}", ordenados por porcentaje de match.`,v.id);
  },
  invitar(db, vacId, cid, mensaje){
    const v=db.vacantes.find(x=>x.id===vacId);
    const m=(v.pool.find(p=>p.cid===cid)||{}).match||50;
    v.pipeline[cid]={ estado:"invitado", match:m, mensaje, docsFiltro:{}, docsContrato:{}, historial:["Invitado a postularse · "+hoy()] };
    const c=db.candidatos.find(x=>x.id===cid);
    notify(db,{tipo:"candidato",id:cid},"Te invitaron a postularte",`${db.formadores.find(f=>f.id===v.formadorId).nombre} te invitó a la vacante "${v.req.titulo}" (${v.req.modalidad}, ${v.req.ubicacionTrabajo}). Mensaje: "${mensaje}"`,v.id);
  },
  aplicar(db, vacId, cid, killersOk){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    if(!killersOk){
      p.estado="filtrado"; p.historial.push("No superó las preguntas filtro · "+hoy());
      notify(db,{tipo:"candidato",id:cid},"Resultado de tu postulación",`Gracias por tu interés en "${v.req.titulo}". Por ahora tu perfil no cumple los requisitos indispensables; te consideraremos para otras vacantes compatibles.`,v.id);
      return;
    }
    p.estado="postulado"; p.historial.push("Se postuló y respondió preguntas filtro · "+hoy());
    notify(db,{tipo:"formador",id:v.formadorId},"Nuevo candidato postulado",`${db.candidatos.find(c=>c.id===cid).nombre} aceptó tu invitación y se postuló a ${v.id} · "${v.req.titulo}".`,v.id);
  },
  /* El candidato aplica por su cuenta desde "Buscar vacantes" (sin invitación previa) */
  postularDirecto(db, vacId, cid, killersOk, mensaje){
    const v=db.vacantes.find(x=>x.id===vacId);
    const c=db.candidatos.find(x=>x.id===cid);
    const m=matchScore(c, v.req);
    if(!killersOk){
      v.pipeline[cid]={ estado:"filtrado", match:m, mensaje, docsFiltro:{}, docsContrato:{}, historial:["Aplicó desde Buscar vacantes · no superó las preguntas filtro · "+hoy()] };
      notify(db,{tipo:"candidato",id:cid},"Resultado de tu postulación",`Gracias por tu interés en "${v.req.titulo}". Por ahora tu perfil no cumple los requisitos indispensables; te consideraremos para otras vacantes compatibles.`,v.id);
      return;
    }
    v.pipeline[cid]={ estado:"postulado", match:m, mensaje, docsFiltro:{}, docsContrato:{}, historial:["Se postuló directamente desde Buscar vacantes · "+hoy()] };
    notify(db,{tipo:"formador",id:v.formadorId},"Nuevo candidato postulado",`${c.nombre} se postuló directamente a ${v.id} · "${v.req.titulo}" desde Buscar vacantes (${m}% de compatibilidad). Mensaje: "${mensaje}"`,v.id);
  },
  docsFiltroListos(db, vacId, cid){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    /* Filtros automáticos simulados: empleos previos + PLD + examen psicométrico */
    p.estado="filtros_ok";
    p.historial.push("Filtros automáticos aprobados (empleos previos, historial de crédito, PLD, psicométrico) · "+hoy());
  },
  /* El candidato realiza su examen psicométrico (a nivel candidato · vigencia 6 meses) */
  completarPsicometrico(db, cid){
    const c=db.candidatos.find(x=>x.id===cid);
    c.psicometrico={ fecha:hoy(), ts:Date.now() };
  },
  videoIA(db, vacId, cid){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    /* La video-entrevista con IA re-ranquea al candidato */
    const delta=((cid*29)%15)-5;
    p.matchIA=Math.max(20,Math.min(99,p.match+delta));
    p.estado="evaluado";
    p.historial.push(`Video-entrevista con IA completada · nuevo ranking ${p.matchIA}% · `+hoy());
    notify(db,{tipo:"formador",id:v.formadorId},"Candidato superó el primer filtro",`${db.candidatos.find(c=>c.id===cid).nombre} completó la video-entrevista con IA para "${v.req.titulo}". Nuevo ranking: ${p.matchIA}%. Revisa tu terna de finalistas.`,v.id);
  },
  enviarSlots(db, vacId, cids, slots, modalidad){
    const v=db.vacantes.find(x=>x.id===vacId);
    cids.forEach(cid=>{
      const p=pAct(v,cid); p.estado="slots_enviados"; p.slots=slots; p.modalidadEnt=modalidad;
      p.historial.push("Invitado a entrevista con 3 opciones de horario · "+hoy());
      notify(db,{tipo:"candidato",id:cid},"Invitación a entrevista",`El formador quiere entrevistarte para "${v.req.titulo}" (${modalidad}). Elige uno de los 3 horarios propuestos.`,v.id);
    });
  },
  confirmarSlot(db, vacId, cid, slot){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    /* Exclusividad de horarios (Batch 3 · F4): un slot confirmado queda tomado para esta vacante */
    if(slotTomado(v,slot,cid)){
      notify(db,{tipo:"candidato",id:cid},"Horario no disponible",`El horario ${slot} ya fue confirmado por otro candidato para "${v.req.titulo}". Elige otro de los horarios propuestos.`,v.id);
      return;
    }
    p.estado="agendado"; p.slotElegido=slot;
    p.teams="https://teams.microsoft.com/l/meetup-join/reclutalia-"+vacId+"-"+cid;
    p.historial.push("Confirmó horario de entrevista: "+slot+" · "+hoy());
    notify(db,{tipo:"formador",id:v.formadorId},"El candidato aceptó tu horario",`${db.candidatos.find(c=>c.id===cid).nombre} confirmó la entrevista para "${v.req.titulo}": ${slot}. Se generó la reunión en Teams (enlace en la ficha del candidato).`,v.id);
    notify(db,{tipo:"candidato",id:cid},"Entrevista confirmada",`Tu entrevista para "${v.req.titulo}" quedó agendada: ${slot}. El enlace de Teams está disponible en tu panel.`,v.id);
  },
  registrarEntrevista(db, vacId, cid, {resumen, feedback, externa, calificacion}){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    const delta=((cid*17)%11)-3;
    p.matchFinal=Math.max(25,Math.min(99,(p.matchIA||p.match)+delta));
    p.estado="entrevistado";
    p.entrevista={ resumen, feedback, externa, calificacion, fecha:hoy() };
    p.historial.push((externa?"Entrevista externa registrada":"Entrevista realizada con copiloto de IA")+` · ranking final ${p.matchFinal}% · `+hoy());
  },
  seleccionar(db, vacId, cid){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    p.estado="seleccionado"; p.historial.push("Seleccionado como candidato ideal · "+hoy());
    const c=db.candidatos.find(x=>x.id===cid);
    notify(db,{tipo:"candidato",id:cid},"¡Felicidades! Fuiste seleccionado",`Fuiste elegido para "${v.req.titulo}". Siguiente paso: sube tu documentación de contratación (checklist en tu panel; solo PDF, máx. 1 MB por archivo).`,v.id);
    /* Descarta al resto de entrevistados y busca compatibilidad con otras vacantes (simulado) */
    Object.entries(v.pipeline).forEach(([ocid,op])=>{
      if(Number(ocid)!==cid && ["entrevistado","agendado","slots_enviados","evaluado"].includes(op.estado)){
        op.estado="descartado"; op.historial.push("Proceso cerrado: se seleccionó a otro candidato · "+hoy());
        notify(db,{tipo:"candidato",id:Number(ocid)},"Actualización de tu proceso",`El proceso de "${v.req.titulo}" concluyó con otro candidato. La IA identificó otras vacantes compatibles con tu perfil y te invitaremos a postularte.`,v.id);
      }
    });
  },
  /* El candidato agenda su examen médico en una sucursal autorizada (Batch 6) */
  agendarMedico(db, vacId, cid, datos){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    p.medico={ ...datos, validado:false };
    p.historial.push(`Examen médico agendado en ${datos.sucursal} · ${datos.fecha} · `+hoy());
    notify(db,{tipo:"formador",id:v.formadorId},"Examen médico agendado",`${db.candidatos.find(c=>c.id===cid).nombre} agendó su examen médico para "${v.req.titulo}" en ${datos.sucursal} (${datos.fecha}). Valida el resultado en la pestaña "Selección y documentos".`,v.id);
  },
  /* El formador valida el resultado positivo del examen médico (Batch 6) */
  validarMedico(db, vacId, cid){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    if(!p.medico) p.medico={};
    p.medico.validado=true;
    p.historial.push("Resultado del examen médico validado por el formador · "+hoy());
    notify(db,{tipo:"candidato",id:cid},"Examen médico validado",`Tu examen médico para "${v.req.titulo}" fue validado. Ya puedes completar y enviar tu documentación de contratación.`,v.id);
  },
  /* Recordatorio al candidato seleccionado de subir sus documentos pendientes */
  recordarDocs(db, vacId, cid){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    p.historial.push("Recordatorio de documentación pendiente enviado · "+hoy());
    notify(db,{tipo:"candidato",id:cid},"Recordatorio: documentación pendiente",`El formador te recuerda completar y enviar tu documentación de contratación para "${v.req.titulo}" (revisa el checklist en tu panel; solo PDF, máx. 1 MB por archivo).`,v.id);
  },
  docsContratoListos(db, vacId, cid){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    p.estado="docs_completos"; p.historial.push("Documentación de contratación completa y validada · "+hoy());
    notify(db,{tipo:"formador",id:v.formadorId},"Documentación completa",`${db.candidatos.find(c=>c.id===cid).nombre} terminó de subir su documentación para "${v.req.titulo}". Ya puedes preparar y enviar la carta oferta.`,v.id);
  },
  enviarOferta(db, vacId, cid, monto, fecha, ubicacion){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    p.estado="oferta_enviada"; p.oferta={monto,fecha,ubicacion:ubicacion||DIRECCION_CORP};
    p.historial.push(`Carta oferta enviada: ${money(monto)} · ingreso y firma el ${fecha} · `+hoy());
    notify(db,{tipo:"candidato",id:cid},"Recibiste tu carta oferta",`Tu propuesta para "${v.req.titulo}": ${money(monto)} mensuales brutos. Fecha de firma e ingreso: ${fecha}. Te presentarás en: ${p.oferta.ubicacion}. Revísala y acéptala en tu panel.`,v.id);
  },
  aceptarOferta(db, vacId, cid){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    p.estado="contratado"; p.numEmpleado=numEmpleado(cid);
    p.historial.push("Oferta aceptada y contrato firmado digitalmente · "+hoy());
    v.estado="cerrada";
    const c=db.candidatos.find(x=>x.id===cid);
    notify(db,{tipo:"formador",id:v.formadorId},"¡Tu candidato aceptó la oferta y firmó! 🎉",`${c.nombre} aceptó la carta oferta de "${v.req.titulo}" y firmó su contrato. Ingreso: ${p.oferta.fecha}. Número de empleado: ${p.numEmpleado}. Abre la pantalla de bienvenida para ver su kit de inducción.`,v.id);
    notify(db,{tipo:"candidato",id:cid},"¡Bienvenido(a) al equipo!",`Firmaste tu contrato para "${v.req.titulo}". Tu número de empleado es ${p.numEmpleado}. Te esperamos el ${p.oferta.fecha}. Revisa tu kit de inducción.`,v.id);
  },
  /* Modo demo: simula la siguiente acción del candidato */
  simular(db, vacId, cid){
    const v=db.vacantes.find(x=>x.id===vacId); const p=pAct(v,cid);
    const filtrosDemo=()=>{ p.docsFiltro={constancias:["constancia_empleo_1.pdf","constancia_empleo_2.pdf"]}; p.autorizaFiltros=true; ACT.completarPsicometrico(db,cid); };
    if(p.estado==="invitado"){ ACT.aplicar(db,vacId,cid,true); filtrosDemo(); ACT.docsFiltroListos(db,vacId,cid); ACT.videoIA(db,vacId,cid); }
    else if(p.estado==="postulado"||p.estado==="filtros_ok"){ filtrosDemo(); ACT.docsFiltroListos(db,vacId,cid); ACT.videoIA(db,vacId,cid); }
    else if(p.estado==="slots_enviados"){ const libre=p.slots.find(s=>!slotTomado(v,s,cid))||p.slots[0]; ACT.confirmarSlot(db,vacId,cid,libre); }
    else if(p.estado==="seleccionado"){
      p.docsContrato={ine:"ine.pdf",curp:"curp.pdf",rfc:"rfc.pdf",domicilio:"comprobante_domicilio.pdf",estudios:"comprobante_estudios.pdf"};
      p.cuentaBanco="012180001234567895";
      if(v.req.examenMedico){ p.medico={ estado:"Ciudad de México", ciudad:"CDMX", municipio:"Tlalpan", sucursal:SUCURSALES_MEDICAS[0].nombre, fecha:proximosDias(7)[2], validado:true }; }
      ACT.docsContratoListos(db,vacId,cid);
    }
    else if(p.estado==="oferta_enviada"){ ACT.aceptarOferta(db,vacId,cid); }
  },
  /* ===== Pool de talento del formador (Batch 1) ===== */
  /* Archivar / restaurar candidato — por vacante (se oculta del pool de esa vacante) */
  archivarCand(db, vacId, cid){
    const v=db.vacantes.find(x=>x.id===vacId);
    if(!v.archivados) v.archivados=[];
    v.archivados = v.archivados.includes(cid) ? v.archivados.filter(x=>x!==cid) : [...v.archivados, cid];
  },
  /* Favorito de candidato — global por formador */
  toggleFavCand(db, formadorId, cid){
    const f=db.formadores.find(x=>x.id===formadorId);
    if(!f.favoritosCands) f.favoritosCands=[];
    f.favoritosCands = f.favoritosCands.includes(cid) ? f.favoritosCands.filter(x=>x!==cid) : [...f.favoritosCands, cid];
  },
  /* Categorías de candidatos — globales por formador */
  crearCategoria(db, formadorId, nombre){
    const f=db.formadores.find(x=>x.id===formadorId);
    if(!f.categorias) f.categorias=[];
    const n=nombre.trim();
    if(n && !f.categorias.some(c=>c.nombre===n)) f.categorias.push({nombre:n, cids:[]});
  },
  toggleCategoria(db, formadorId, nombre, cid){
    const f=db.formadores.find(x=>x.id===formadorId);
    if(!f.categorias) f.categorias=[];
    const cat=f.categorias.find(c=>c.nombre===nombre); if(!cat) return;
    cat.cids = cat.cids.includes(cid) ? cat.cids.filter(x=>x!==cid) : [...cat.cids, cid];
  },
  /* Solicitar más candidatos a reclutamiento (simulado · 5–10 días hábiles) */
  solicitarMasCandidatos(db, vacId, multiposting){
    const v=db.vacantes.find(x=>x.id===vacId);
    v.historial.push("Se solicitó a reclutamiento la búsqueda de más candidatos (5–10 días hábiles)"+(multiposting?" · Multiposting habilitado":"")+" · "+hoy());
    notify(db,{tipo:"formador",id:v.formadorId},"Solicitud de más candidatos registrada",`Un grupo de reclutadores iniciará la búsqueda de talento para "${v.req.titulo}". Recibirás candidatos viables adicionales en un plazo de 5 a 10 días hábiles.`+(multiposting?" Además, la vacante se publicó automáticamente en plataformas de terceros (Multiposting · simulado).":""),v.id);
  },
  guardarCandidato(db, cand){
    const i=db.candidatos.findIndex(c=>c.id===cand.id);
    if(i>=0) db.candidatos[i]=cand; else db.candidatos.unshift({...cand,id:Math.max(...db.candidatos.map(c=>c.id))+1});
  },
};

/* ============================== FORMULARIO ESTANDARIZADO DE VACANTE ============================== */
function VacanteForm({inicial, onSave, saveLabel="Guardar vacante", extraTop, cambios}){
  const [r,setR]=useState(inicial||mkReq({}));
  const [sec,setSec]=useState(0);
  const set=(k,v)=>setR(x=>({...x,[k]:v}));
  const [kq,setKq]=useState("");
  /* Solicitudes de cambio por campo (Batch 6 · A8): el admin aplica editando el campo o lo rechaza */
  const [rechazados,setRechazados]=useState([]);
  const porCampo = cambios && typeof cambios==="object" ? cambios : null;
  const Anot=({k})=>{
    if(!porCampo || !porCampo[k]) return null;
    const rej=rechazados.includes(k);
    return (
      <div className={"anot"+(rej?" rej":"")}>
        <AlertCircle size={13}/>
        <span style={{flex:1}}><b>Cambio solicitado:</b> {porCampo[k]}{rej && <b> · Rechazado</b>}</span>
        <button type="button" className="btn ghost sm" onClick={()=>setRechazados(x=>rej?x.filter(y=>y!==k):[...x,k])}>{rej?"Reconsiderar":"Rechazar cambio"}</button>
      </div>
    );
  };
  const SECS=["1 · El puesto","2 · Perfil del candidato","3 · Preguntas filtro","4 · Condiciones"];
  const valido = r.titulo.trim() && r.descripcion.trim() && r.espRequeridas.length>0 && r.hardSkills.length>0;
  /* Validación por sección (Batch 5 · A7): "Siguiente" se bloquea hasta completar los obligatorios;
     los checkboxes "no relevante" cuentan como campo satisfecho. */
  const faltanSec=(s)=>{
    const f=[];
    if(s===0){
      if(!r.titulo.trim()) f.push("título del puesto");
      if(!r.descripcion.trim()) f.push("descripción");
      if(!r.sede) f.push("sede");
      if(!r.unidadNegocio.trim()) f.push("unidad de negocio");
    }
    if(s===1){
      if(!r.espRequeridas.length) f.push("especialidades requeridas");
      if(!r.hardSkills.length) f.push("habilidades técnicas");
      if(!r.edadNoRelevante && !(r.edadMin>=18 && r.edadMax>=r.edadMin)) f.push('rango de edad válido (o marca "Edad no relevante")');
    }
    if(s===3){
      if(!r.horario.trim()) f.push("horario");
      if(!r.dias.length) f.push("días de trabajo");
      if(!(r.salarioMin>0 && r.salarioMax>=r.salarioMin)) f.push("rango salarial válido");
    }
    return f;
  };
  const faltan=faltanSec(sec);
  const faltanTodas=[0,1,2,3].flatMap(faltanSec);
  return (
    <div>
      {extraTop}
      {cambios && typeof cambios==="string" && (
        <div className="anot" style={{marginBottom:14}}><AlertCircle size={13}/><span style={{flex:1}}><b>El formador solicitó:</b> "{cambios}"</span></div>
      )}
      {porCampo && (
        <div className="anot" style={{marginBottom:14}}><AlertCircle size={13}/><span style={{flex:1}}>El formador solicitó cambios en <b>{Object.keys(porCampo).length} campo(s)</b> (resaltados en cada sección). Aplica el cambio editando el campo o márcalo como rechazado.</span></div>
      )}
      <div className="tabs">{SECS.map((s,i)=><button key={i} className={"tab"+(sec===i?" on":"")} onClick={()=>setSec(i)}>{s}</button>)}</div>

      {sec===0 && <div>
        <div className="grid2">
          <div className="field"><label>Título del puesto *</label><input value={r.titulo} onChange={e=>set("titulo",e.target.value)} placeholder="p. ej. Ejecutivo de Ventas Digitales"/><Anot k="titulo"/></div>
          <div className="field"><label>Área</label><select value={r.area} onChange={e=>set("area",e.target.value)}>{AREAS.map(a=><option key={a}>{a}</option>)}</select><Anot k="area"/></div>
        </div>
        <div className="field"><label>Descripción del puesto *</label>
          <textarea rows={4} value={r.descripcion} onChange={e=>set("descripcion",e.target.value)} placeholder="Responsabilidades, objetivos y contexto del equipo…"/><Anot k="descripcion"/></div>
        <div className="grid3">
          <div className="field"><label>Nivel del puesto</label><select value={r.nivelPuesto} onChange={e=>set("nivelPuesto",e.target.value)}>{NIVELES.map(a=><option key={a}>{a}</option>)}</select><Anot k="nivelPuesto"/></div>
          <div className="field"><label>Número de posiciones</label><input type="number" min="1" value={r.numVacantes} onChange={e=>set("numVacantes",+e.target.value)}/><Anot k="numVacantes"/></div>
          <div className="field"><label>Ubicación del trabajo</label><select value={r.ubicacionTrabajo} onChange={e=>set("ubicacionTrabajo",e.target.value)}>{CIUDADES.map(a=><option key={a}>{a}</option>)}</select><Anot k="ubicacionTrabajo"/></div>
        </div>
        <div className="grid3">
          <div className="field"><label>Tipo de sede *</label>
            <select value={r.tipoSede} onChange={e=>setR(x=>({...x,tipoSede:e.target.value,sede:""}))}>{TIPOS_SEDE.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="field"><label>Sede *</label>
            <select value={r.sede} onChange={e=>set("sede",e.target.value)}>
              <option value="">Selecciona la sede…</option>
              {SEDES[r.tipoSede].map(s=><option key={s}>{s}</option>)}
            </select><Anot k="sede"/></div>
          <div className="field"><label>Unidad de Negocio *</label><input value={r.unidadNegocio} onChange={e=>set("unidadNegocio",e.target.value)} placeholder="p. ej. Banca Digital, Retail Centro…"/><Anot k="unidadNegocio"/></div>
        </div>
        <div className="field"><label>Tipo de vacante</label>
          <div className="tagpick">{TIPOS_VACANTE.map(t=><button type="button" key={t} className={"tag"+(r.tipoVacante===t?" on":"")} onClick={()=>set("tipoVacante",t)}>{t}</button>)}</div>
          {r.tipoVacante==="Confidencial" && <div className="help">Se mostrará con un chip "Confidencial" al administrador y al formador. No aparecerá en "Buscar vacantes" del candidato.</div>}
          <Anot k="tipoVacante"/>
        </div>
      </div>}

      {sec===1 && <div>
        <div className="grid3">
          <div className="field"><label>Años de experiencia mínimos</label>
            <input type="number" min="0" value={r.anosExp} onChange={e=>set("anosExp",+e.target.value)} disabled={r.expNoRelevante}/>
            <label className="chk-inline"><input type="checkbox" checked={r.expNoRelevante} onChange={e=>set("expNoRelevante",e.target.checked)}/> No relevante</label>
            <Anot k="anosExp"/>
          </div>
          <div className="field"><label>Nivel de estudios</label>
            <select value={r.educacion} onChange={e=>set("educacion",e.target.value)}>{EDUCACION.map(a=><option key={a}>{a}</option>)}</select>
            <label className="chk-inline"><input type="checkbox" checked={r.puedeSerSuperior} onChange={e=>set("puedeSerSuperior",e.target.checked)}/> Puede ser superior</label>
            <Anot k="educacion"/>
          </div>
          <div className="field"><label>Radio de búsqueda del candidato</label>
            <div style={{display:"flex",gap:8}}>
              <select value={r.ubicacionCandidato} onChange={e=>set("ubicacionCandidato",e.target.value)} style={{flex:1}} disabled={r.ubicacionNoRelevante}>{CIUDADES.map(a=><option key={a}>{a}</option>)}</select>
              <select value={r.radioKm} onChange={e=>set("radioKm",+e.target.value)} style={{width:110}} disabled={r.ubicacionNoRelevante}>{[10,25,30,40,50,100,300].map(k=><option key={k} value={k}>{k} km</option>)}</select>
            </div>
            <label className="chk-inline"><input type="checkbox" checked={r.ubicacionNoRelevante} onChange={e=>set("ubicacionNoRelevante",e.target.checked)}/> Ubicación no relevante</label>
            <div className="help">{r.ubicacionNoRelevante?"La IA no restringirá por ubicación: todos los candidatos reciben el puntaje completo de distancia.":"La IA prioriza candidatos dentro de este radio."}</div>
            <Anot k="radio"/>
          </div>
        </div>
        <div className="field" style={{maxWidth:420}}><label>Rango de edad preferida</label>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input type="number" min="18" max="99" value={r.edadMin} onChange={e=>set("edadMin",+e.target.value)} disabled={r.edadNoRelevante}/><span>a</span>
            <input type="number" min="18" max="99" value={r.edadMax} onChange={e=>set("edadMax",+e.target.value)} disabled={r.edadNoRelevante}/><span>años</span>
          </div>
          <label className="chk-inline"><input type="checkbox" checked={r.edadNoRelevante} onChange={e=>set("edadNoRelevante",e.target.checked)}/> Edad no relevante</label>
          <div className="help">Referencia para el equipo de reclutamiento; la edad NO afecta el ranking de compatibilidad de la IA.</div>
          <Anot k="edad"/>
        </div>
        <div className="field"><label>Especialidades requeridas * <span style={{fontWeight:400,color:"var(--gray)"}}>(selección múltiple)</span></label>
          <TagPicker options={ESPECIALIDADES} value={r.espRequeridas} onChange={v=>set("espRequeridas",v)} addNew/><Anot k="espRequeridas"/></div>
        <div className="field"><label>Especialidades opcionales (deseables)</label>
          <TagPicker options={ESPECIALIDADES.filter(e=>!r.espRequeridas.includes(e))} value={r.espOpcionales} onChange={v=>set("espOpcionales",v)} addNew/><Anot k="espOpcionales"/></div>
        <div className="field"><label>Habilidades duras / técnicas requeridas *</label>
          <TagPicker options={HARD_SKILLS} value={r.hardSkills} onChange={v=>set("hardSkills",v)} addNew/><Anot k="hardSkills"/></div>
        <div className="field"><label>Habilidades blandas requeridas</label>
          <TagPicker options={SOFT_SKILLS} value={r.softSkills} onChange={v=>set("softSkills",v)} addNew/><Anot k="softSkills"/></div>
        <div className="field"><label>Aptitudes a evaluar</label>
          <TagPicker options={APTITUDES} value={r.aptitudes} onChange={v=>set("aptitudes",v)} addNew/><Anot k="aptitudes"/></div>
      </div>}

      {sec===2 && <div>
        <div className="aibox" style={{marginBottom:14}}>
          <div className="hd"><Filter size={15}/> Preguntas filtro (killer questions)</div>
          <p style={{fontSize:12.5,color:"var(--ink2)"}}>El candidato deberá responder <b>Sí</b> a todas para continuar. Si responde No, el sistema lo descarta automáticamente y le notifica.</p>
        </div>
        {r.killer.map((k,i)=>(
          <div key={i} className="trow">
            <ShieldCheck size={17} color="var(--gold-dark)"/>
            <div style={{flex:1,fontSize:13.5}}>{k.q}</div>
            <button className="btn ghost sm" onClick={()=>set("killer",r.killer.filter((_,j)=>j!==i))}><X size={13}/></button>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <input placeholder="Escribe una pregunta cerrada (respuesta Sí/No)…" value={kq} onChange={e=>setKq(e.target.value)}/>
          <button className="btn dark sm" onClick={()=>{ if(kq.trim()){ set("killer",[...r.killer,{q:kq.trim()}]); setKq(""); }}}><Plus size={14}/> Agregar</button>
        </div>
        <Anot k="killer"/>
      </div>}

      {sec===3 && <div>
        <div className="grid2">
          <div className="field"><label>Modalidad de trabajo</label>
            <div className="tagpick">{MODALIDADES.map(m=><button type="button" key={m} className={"tag"+(r.modalidad===m?" on":"")} onClick={()=>set("modalidad",m)}>{m}</button>)}</div><Anot k="modalidad"/></div>
          <div className="field"><label>Días de trabajo</label><TagPicker options={DIAS} value={r.dias} onChange={v=>set("dias",v)}/><Anot k="dias"/></div>
          <div className="field"><label>Horario</label><input value={r.horario} onChange={e=>set("horario",e.target.value)} placeholder="p. ej. 9:00 – 18:00"/><Anot k="horario"/></div>
          <div className="field"><label>Rango salarial mensual bruto</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input type="number" value={r.salarioMin} onChange={e=>set("salarioMin",+e.target.value)}/><span>a</span>
              <input type="number" value={r.salarioMax} onChange={e=>set("salarioMax",+e.target.value)}/>
            </div>
            <div className="help">Rango autorizado por Compensaciones (tabulador precargado · simulado).</div>
            <Anot k="salario"/>
          </div>
        </div>
        <div className="field" style={{marginTop:4}}>
          <label>Examen médico</label>
          <label className="check-item" style={{cursor:"pointer",fontWeight:400,alignItems:"flex-start"}}>
            <input type="checkbox" style={{width:"auto",marginTop:2,marginRight:8}} checked={!!r.examenMedico} onChange={e=>set("examenMedico",e.target.checked)}/>
            <span style={{flex:1,fontSize:13,lineHeight:1.5}}>¿Esta vacante requiere examen médico al candidato seleccionado?</span>
          </label>
          <div className="help">Si se activa, el candidato seleccionado deberá agendar y aprobar un examen médico antes de completar su documentación.</div>
          <Anot k="examenMedico"/>
        </div>
      </div>}

      <div style={{display:"flex",gap:10,marginTop:18,alignItems:"center",flexWrap:"wrap"}}>
        {sec>0 && <button className="btn ghost" onClick={()=>setSec(sec-1)}>Anterior</button>}
        {sec<3 && <button className="btn dark" disabled={faltan.length>0} onClick={()=>setSec(sec+1)}>Siguiente <ChevronRight size={15}/></button>}
        {sec===3 && <button className="btn gold" disabled={!valido||faltanTodas.length>0} onClick={()=>onSave(r,rechazados)}><CheckCircle2 size={15}/> {saveLabel}</button>}
        {faltan.length>0 && <span className="help" style={{color:"var(--bad)"}}><AlertCircle size={12} style={{verticalAlign:-2}}/> Para continuar completa: {faltan.join(", ")}.</span>}
        {sec===3 && faltan.length===0 && faltanTodas.length>0 && <span className="help" style={{color:"var(--bad)"}}><AlertCircle size={12} style={{verticalAlign:-2}}/> Faltan campos en otras secciones: {[...new Set(faltanTodas)].join(", ")}.</span>}
      </div>
    </div>
  );
}

/* ============================== PANEL DEL FORMADOR ============================== */
/* Resumen de cambios solicitados (Batch 6): objeto {campo:anotación} o string legado */
function CambiosResumen({cambios}){
  if(!cambios) return null;
  if(typeof cambios==="string") return <p style={{fontSize:13,marginTop:6}}>"{cambios}"</p>;
  return <div style={{marginTop:6}}>{Object.entries(cambios).map(([k,a])=><div key={k} style={{fontSize:13,marginTop:3}}>• <b>{CAMPOS_DESC[k]||k}:</b> {a}</div>)}</div>;
}

function VistaDescriptivo({v, cand, onAprobar, onCambios}){
  const [modo,setModo]=useState("ver");
  const [cambiosMap,setCambiosMap]=useState({}); // {campo: anotación} — una entrada por campo anotado
  const r=v.req;
  const limpio=Object.fromEntries(Object.entries(cambiosMap).map(([k,a])=>[k,a.trim()]).filter(([,a])=>a));
  const nSol=Object.keys(limpio).length;
  /* Solicitud de cambios por campo (Batch 6 · F15): en modo "cambios" el lápiz de cada fila abre un
     input propio bajo el campo; puede haber tantas anotaciones abiertas como se necesite y todas se
     envían juntas. Row se INVOCA como función — {Row({...})} y no <Row/> — porque un componente
     inline se re-monta en cada render y sus inputs perderían el foco en cada tecleo. */
  const Row=({l,c,k})=>(
    <div style={{marginBottom:10}} key={l}>
      <label>{l}{modo==="cambios" && k && cambiosMap[k]===undefined && (
        <button type="button" className="lapiz" title={"Solicitar cambio en: "+l}
          onClick={()=>setCambiosMap(m=>({...m,[k]:""}))}><Edit3 size={12}/></button>
      )}</label>
      <div style={{fontSize:13.5}}>{c}</div>
      {modo==="cambios" && k && cambiosMap[k]!==undefined && (
        <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center"}}>
          <input autoFocus placeholder="Describe el ajuste que necesitas en este campo…" style={{flex:1}}
            value={cambiosMap[k]} onChange={e=>setCambiosMap(m=>({...m,[k]:e.target.value}))}/>
          <button type="button" className="lapiz on" title="Quitar esta anotación"
            onClick={()=>setCambiosMap(m=>{ const n={...m}; delete n[k]; return n; })}><X size={12}/></button>
        </div>
      )}
    </div>
  );
  return (
    <div>
      {v.estado==="asignada" && modo==="ver" && (
        <div className="aibox" style={{marginBottom:16}}>
          <div className="hd"><Sparkles size={15}/> Descriptivo precargado — requiere tu aprobación</div>
          <p style={{fontSize:13,color:"var(--ink2)"}}>El sistema precargó salario, funciones y atributos desde la estructura organizacional (HCM/TGS · simulado). Revisa el descriptivo: puedes <b>aprobarlo</b> para iniciar la búsqueda o <b>solicitar cambios</b> al administrador.</p>
        </div>
      )}
      {modo==="cambios" && (
        <div className="card" style={{background:"var(--gold-soft)",borderColor:"#F0D9A5",marginBottom:16}}>
          <b style={{fontSize:13.5}}><Edit3 size={14} style={{verticalAlign:-2}}/> Solicitud de cambios por campo</b>
          <p style={{fontSize:13,marginTop:6}}>Usa el lápiz <Edit3 size={11} style={{verticalAlign:-1}}/> junto a cada campo para abrir su anotación; puedes anotar <b>tantos campos como necesites</b> (cada anotación queda abierta bajo su campo). Al terminar, envía todas las solicitudes juntas a revisión del administrador.</p>
          <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center",flexWrap:"wrap"}}>
            <button className="btn dark sm" disabled={nSol===0} onClick={()=>{onCambios(limpio); setModo("ver"); setCambiosMap({});}}><Send size={13}/> Enviar a revisión ({nSol} campo{nSol===1?"":"s"} anotado{nSol===1?"":"s"})</button>
            <button className="btn ghost sm" onClick={()=>{setModo("ver"); setCambiosMap({});}}>Cancelar</button>
            {nSol===0 && <span className="help">Anota al menos un campo para poder enviar.</span>}
          </div>
        </div>
      )}
      {v.estado==="cambios" && (
        <div className="card" style={{background:"var(--gold-soft)",borderColor:"#F0D9A5",marginBottom:16}}>
          <b style={{fontSize:13.5}}><Clock size={14} style={{verticalAlign:-2}}/> Cambios solicitados al administrador</b>
          <CambiosResumen cambios={v.cambios}/>
          <p className="help">Recibirás una notificación cuando el descriptivo esté actualizado.</p>
        </div>
      )}
      <div className="grid2">
        <div>
          {Row({l:"Puesto", k:"titulo", c:<b>{r.titulo}</b>})}
          {Row({l:"Descripción", k:"descripcion", c:r.descripcion})}
          {Row({l:"Especialidades requeridas", k:"espRequeridas", c:<div className="tagpick">{r.espRequeridas.map(e=><span key={e} className="chip gold">{e}</span>)}</div>})}
          {r.espOpcionales.length>0 && Row({l:"Especialidades opcionales", k:"espOpcionales", c:<div className="tagpick">{r.espOpcionales.map(e=><span key={e} className="chip">{e}</span>)}</div>})}
          {Row({l:"Habilidades técnicas", k:"hardSkills", c:<div className="tagpick">{r.hardSkills.map(e=><span key={e} className="chip">{e}</span>)}</div>})}
          {Row({l:"Habilidades blandas", k:"softSkills", c:<div className="tagpick">{r.softSkills.map(e=><span key={e} className="chip">{e}</span>)}</div>})}
          {r.aptitudes.length>0 && Row({l:"Aptitudes a evaluar", k:"aptitudes", c:<div className="tagpick">{r.aptitudes.map(e=><span key={e} className="chip">{e}</span>)}</div>})}
        </div>
        <div>
          <div className="grid2">
            {Row({l:"Área", k:"area", c:r.area})}{Row({l:"Nivel", k:"nivelPuesto", c:r.nivelPuesto})}
            {Row({l:"Experiencia mínima", k:"anosExp", c:r.expNoRelevante? "No relevante" : r.anosExp+" años"})}{Row({l:"Estudios", k:"educacion", c:r.educacion+(r.puedeSerSuperior?" o superior":"")})}
            {Row({l:"Ubicación del trabajo", k:"ubicacionTrabajo", c:r.ubicacionTrabajo})}{Row({l:"Modalidad", k:"modalidad", c:r.modalidad})}
            {Row({l:"Horario", k:"horario", c:r.horario})}{Row({l:"Días", k:"dias", c:r.dias.join(", ")})}
            {Row({l:"Rango salarial", k:"salario", c:money(r.salarioMin)+" – "+money(r.salarioMax)})}{Row({l:"Posiciones", k:"numVacantes", c:r.numVacantes})}
            {Row({l:"Búsqueda de candidatos", k:"radio", c:r.ubicacionNoRelevante? "Ubicación no relevante (sin restricción)" : `${r.ubicacionCandidato} · radio ${r.radioKm} km`})}
            {Row({l:"Edad preferida", k:"edad", c:r.edadNoRelevante? "No relevante" : `${r.edadMin} – ${r.edadMax} años`})}
            {r.sede && Row({l:"Sede", k:"sede", c:`${r.tipoSede} · ${r.sede}`})}
            {r.unidadNegocio && Row({l:"Unidad de Negocio", k:"unidadNegocio", c:r.unidadNegocio})}
            {Row({l:"Tipo de vacante", k:"tipoVacante", c:r.tipoVacante==="Confidencial"? <Chip tone="gold" icon={ShieldCheck}>Confidencial</Chip> : (r.tipoVacante||"Estándar")})}
            {r.examenMedico && Row({l:"Examen médico", k:"examenMedico", c:<Chip tone="gold" icon={ShieldCheck}>Requerido al candidato seleccionado</Chip>})}
          </div>
          {r.killer.length>0 && Row({l:"Preguntas filtro (killer questions)", k:"killer", c:r.killer.map((q,i)=><div key={i} style={{fontSize:13,marginTop:4}}>• {q.q}</div>)})}
          {Row({l:"Historial", c:v.historial.map((h,i)=><div key={i} className="help">• {h}</div>)})}
        </div>
      </div>
      {(v.estado==="asignada") && modo==="ver" && (
        <div style={{display:"flex",gap:10,marginTop:16}}>
          <button className="btn gold" onClick={onAprobar}><CheckCircle2 size={16}/> Aprobar e iniciar búsqueda</button>
          <button className="btn ghost" onClick={()=>setModo("cambios")}><Edit3 size={15}/> Solicitar cambios</button>
        </div>
      )}
    </div>
  );
}

function InvitarModal({cand, v, onSend, onClose}){
  const def=`Hola ${cand.nombre.split(" ")[0]}, revisé tu perfil y creo que encaja muy bien con la vacante "${v.req.titulo}" (${v.req.modalidad}, ${v.req.ubicacionTrabajo}). Me encantaría invitarte a postularte. ¡Saludos!`;
  const [tipo,setTipo]=useState("default");
  const [msg,setMsg]=useState(def);
  return (
    <Modal onClose={onClose}>
      <h3 style={{marginBottom:4}}>Invitar a postularse</h3>
      <p className="help" style={{marginBottom:14}}>{cand.nombre} recibirá una notificación con tu mensaje (y por correo/WhatsApp en la versión final).</p>
      <div className="tagpick" style={{marginBottom:12}}>
        <button className={"tag"+(tipo==="default"?" on":"")} onClick={()=>{setTipo("default");setMsg(def);}}>Mensaje predefinido</button>
        <button className={"tag"+(tipo==="custom"?" on":"")} onClick={()=>setTipo("custom")}>Personalizar mensaje</button>
      </div>
      <textarea rows={5} value={msg} onChange={e=>{setMsg(e.target.value);setTipo("custom");}}/>
      <div style={{display:"flex",gap:8,marginTop:14}}>
        <button className="btn gold" onClick={()=>onSend(msg)}><Send size={15}/> Enviar invitación</button>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

function AgendaModal({v, cands, onSend, onClose}){
  const [conectado,setConectado]=useState(false);
  const [sel,setSel]=useState([]);
  const [modalidad,setModalidad]=useState("Virtual (Teams)");
  const dias=useMemo(()=>{ const out=[]; const d=new Date();
    while(out.length<3){ d.setDate(d.getDate()+1); if(d.getDay()!==0&&d.getDay()!==6) out.push(new Date(d)); } return out; },[]);
  const horas=["10:00","12:00","16:00","17:30"];
  const slots=dias.flatMap(d=>horas.map(h=>d.toLocaleDateString("es-MX",{weekday:"short",day:"numeric",month:"short"})+" · "+h));
  const toggle=(s)=> setSel(x=> x.includes(s)? x.filter(y=>y!==s) : x.length<3? [...x,s] : x);
  return (
    <Modal onClose={onClose} wide>
      <h3>Agendar entrevista</h3>
      <p className="help" style={{marginBottom:14}}>Propón <b>3 horarios</b> a {cands.map(c=>c.nombre.split(" ")[0]).join(", ")}. Cada candidato confirmará el que le acomode.</p>
      {!conectado ? (
        <div className="card" style={{textAlign:"center",padding:"34px 20px"}}>
          <Link2 size={28} color="var(--ai)" style={{marginBottom:10}}/>
          <h3 style={{fontSize:15,marginBottom:6}}>Conecta tu calendario corporativo</h3>
          <p className="help" style={{marginBottom:16}}>Vincula Outlook / Teams para ver tu disponibilidad real y generar las reuniones automáticamente.</p>
          <button className="btn ai" onClick={()=>setConectado(true)}><Calendar size={15}/> Conectar Outlook / Teams</button>
          <div className="help" style={{marginTop:10}}>Integración simulada en este prototipo.</div>
        </div>
      ):(<>
        <div className="chip ok" style={{marginBottom:12}}><CheckCircle2 size={12}/> Calendario de Outlook sincronizado · mostrando tus espacios libres</div>
        <div className="field"><label>Modalidad de la entrevista</label>
          <div className="tagpick">{["Virtual (Teams)","Presencial"].map(m=><button key={m} className={"tag"+(modalidad===m?" on":"")} onClick={()=>setModalidad(m)}>{m}</button>)}</div></div>
        <label>Elige 3 horarios disponibles ({sel.length}/3)</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:6}}>
          {slots.map(s=><button key={s} className={"slotbtn"+(sel.includes(s)?" on":"")} onClick={()=>toggle(s)}>{s}</button>)}
        </div>
        <div style={{display:"flex",gap:8,marginTop:16}}>
          <button className="btn gold" disabled={sel.length!==3} onClick={()=>onSend(sel,modalidad)}><Send size={15}/> Enviar opciones a {cands.length} candidato(s)</button>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
        </div>
      </>)}
    </Modal>
  );
}

function EntrevistaModal({cand, v, p, externa, onSave, onClose}){
  const [fase,setFase]=useState(externa?"resumen":"vivo");
  const [notas,setNotas]=useState("");
  const [resumen,setResumen]=useState(externa?"":"");
  const [feedback,setFeedback]=useState("");
  const [calif,setCalif]=useState(0);
  const preguntasIA=[
    `Cuéntame de un logro concreto como ${cand.puesto.toLowerCase()} y cómo lo mediste.`,
    `¿Cómo aplicarías ${(v.req.hardSkills[0]||"tus herramientas")} en los retos de este puesto?`,
    `Describe una situación donde demostraste ${(v.req.softSkills[0]||"comunicación efectiva").toLowerCase()}.`,
    `¿Qué te motiva de esta posición (${v.req.titulo}) y del esquema ${v.req.modalidad.toLowerCase()}?`,
    "¿Cuál es tu expectativa salarial y disponibilidad de ingreso?",
  ];
  const genResumen=()=>`La IA registró la sesión (${p.slotElegido||hoy()}). ${cand.nombre.split(" ")[0]} sustentó ${cand.exp} años de experiencia en ${cand.esp[0]||cand.area}, con dominio de ${cand.hard.slice(0,2).join(" y ")}. Mostró fortaleza en ${cand.soft[0]?.toLowerCase()||"comunicación"} y respondió con ejemplos medibles. Expectativa salarial: ${money(cand.salario)}. Puntos a profundizar: alineación de horario y experiencia específica en ${v.req.espRequeridas[0]||v.req.area}.`+(notas?` Notas del formador durante la sesión: ${notas}`:"");
  return (
    <Modal onClose={onClose} wide>
      {fase==="vivo" && (<>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <Video size={18} color="var(--ai)"/><h3>Entrevista en curso · {cand.nombre}</h3>
          <span className="chip ai" style={{marginLeft:"auto"}}><Sparkles size={11}/> Copiloto de IA activo</span>
        </div>
        <div className="grid2">
          <div className="aibox">
            <div className="hd"><MessageSquare size={14}/> Preguntas sugeridas por la IA</div>
            {preguntasIA.map((q,i)=><div key={i} style={{fontSize:12.5,padding:"7px 0",borderBottom:"1px dashed #D5D8F2"}}>{i+1}. {q}</div>)}
            <div className="help" style={{marginTop:8}}>Basadas en el descriptivo y el perfil del candidato.</div>
          </div>
          <div>
            <label>La IA resumirá la reunión, agrega tus propias notas aquí:</label>
            <textarea rows={9} value={notas} onChange={e=>setNotas(e.target.value)} placeholder="Observaciones durante la entrevista (opcional)…"/>
          </div>
        </div>
        <button className="btn dark" style={{marginTop:14}} onClick={()=>{setResumen(genResumen());setFase("resumen");}}><CheckCircle2 size={15}/> Finalizar entrevista</button>
      </>)}
      {fase==="resumen" && (<>
        <h3 style={{marginBottom:12}}>{externa?"Registrar entrevista externa / presencial":"Resumen generado por la IA"}</h3>
        {!externa && (
          <div className="aibox" style={{marginBottom:12}}>
            <div className="hd"><Sparkles size={14}/> Resumen de la sesión + nuevo ranking (simulado)</div>
            <textarea rows={5} value={resumen} onChange={e=>setResumen(e.target.value)}/>
          </div>
        )}
        {externa && (
          <div className="field"><label>¿Qué se preguntó y cómo respondió el candidato?</label>
            <textarea rows={4} value={resumen} onChange={e=>setResumen(e.target.value)} placeholder="Resumen de la entrevista realizada fuera de la plataforma…"/></div>
        )}
        <div className="field">
          <label>Tu feedback y comentarios hacia el candidato *</label>
          <textarea rows={3} value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Fortalezas, áreas de oportunidad y tu recomendación…"/>
          <div className="help">Recuerda: tu retroalimentación queda registrada en el expediente y alimenta el ranking final.</div>
        </div>
        {/* Calificación con estrellas (Batch 3 · F6) — no visible para el candidato */}
        <div className="field">
          <label>Calificación de la entrevista (1 a 10 estrellas) *</label>
          <div style={{display:"flex",gap:2,alignItems:"center"}}>
            {[...Array(10)].map((_,i)=>(
              <button key={i} type="button" title={`${i+1}/10`} onClick={()=>setCalif(i+1)}
                style={{background:"none",border:"none",cursor:"pointer",padding:2,lineHeight:0}}>
                <Star size={20} color={i<calif?"var(--gold)":"var(--line)"} fill={i<calif?"var(--gold)":"none"}/>
              </button>
            ))}
            {calif>0 && <b style={{marginLeft:8,fontSize:13,color:"var(--gold-dark)"}}>{calif}/10</b>}
          </div>
          <div className="help">Solo visible para ti y el expediente interno; el candidato no la ve.</div>
        </div>
        <button className="btn gold" disabled={!feedback.trim()||calif<1||(externa&&!resumen.trim())} onClick={()=>onSave({resumen,feedback,externa,calificacion:calif})}><FileSignature size={15}/> Guardar entrevista y actualizar ranking</button>
      </>)}
    </Modal>
  );
}

function OfertaTool({v, cand, p, onSend}){
  const sugerido=Math.min(v.req.salarioMax, Math.max(v.req.salarioMin, Math.round((cand.salario*0.6+((v.req.salarioMin+v.req.salarioMax)/2)*0.4)/500)*500));
  const [monto,setMonto]=useState(sugerido);
  const fechas=fechasQuincena();
  const [fecha,setFecha]=useState(fechas[0]);
  const [fechaLibre,setFechaLibre]=useState(""); // "Otra fecha" (Batch 3 · F11) — yyyy-mm-dd
  const otra=fecha==="otra";
  const fmtLibre=(s)=>{ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d).toLocaleDateString("es-MX",{weekday:"long",day:"numeric",month:"long",year:"numeric"}); };
  const fechaFinal=otra? (fechaLibre?fmtLibre(fechaLibre):"") : fecha;
  const [ubicacion,setUbicacion]=useState(DIRECCION_CORP);
  const fuera=monto<v.req.salarioMin||monto>v.req.salarioMax;
  return (
    <div className="grid2">
      <div className="aibox">
        <div className="hd"><Sparkles size={15}/> Sugerencia de sueldo de la IA (simulada)</div>
        <div style={{fontSize:28,fontWeight:800,color:"var(--ai)"}}>{money(sugerido)}<span style={{fontSize:13,fontWeight:500}}> /mes bruto</span></div>
        <div style={{fontSize:12.5,marginTop:8,lineHeight:1.6}}>
          Rúbrica: tabulador autorizado <b>{money(v.req.salarioMin)} – {money(v.req.salarioMax)}</b> · expectativa del candidato {money(cand.salario)} · equidad interna del área · mercado {v.req.area}.
        </div>
        <div className="mini-pipe" style={{marginTop:10}}>
          {[...Array(10)].map((_,i)=><i key={i} className={ (v.req.salarioMin+((v.req.salarioMax-v.req.salarioMin)/10)*i) <= monto ? "f":""}/>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10.5,color:"var(--gray)",marginTop:3}}>
          <span>{money(v.req.salarioMin)} mín.</span><span>{money(v.req.salarioMax)} máx.</span>
        </div>
      </div>
      <div>
        <div className="field"><label>Monto final del sueldo mensual *</label>
          <input type="number" value={monto} onChange={e=>setMonto(+e.target.value)}/>
          {fuera && <div style={{fontSize:12,color:"var(--bad)",marginTop:4}}><AlertCircle size={12} style={{verticalAlign:-2}}/> Fuera del tabulador autorizado. Ajusta el monto para poder enviar.</div>}
          <button className="btn ghost sm" style={{marginTop:6}} onClick={()=>setMonto(sugerido)}><Sparkles size={12}/> Usar sugerido</button>
        </div>
        <div className="field"><label>Fecha de firma e ingreso (mismo día)</label>
          <select value={fecha} onChange={e=>setFecha(e.target.value)}>
            {fechas.map(f=><option key={f} value={f}>{f}</option>)}
            <option value="otra">Otra fecha…</option>
          </select>
          {otra && <input type="date" style={{marginTop:8}} value={fechaLibre} onChange={e=>setFechaLibre(e.target.value)}/>}
          <div className="help">{otra?"Elige libremente la fecha de ingreso del candidato.":"Inicios de quincena (día 1 o 16), o elige \"Otra fecha\" para una fecha libre."}</div>
        </div>
        <div className="field"><label>Ubicación donde el candidato debe presentarse</label>
          <textarea rows={2} value={ubicacion} onChange={e=>setUbicacion(e.target.value)} placeholder="Dirección completa de presentación el primer día…"/>
          <div className="help">Se incluirá en la carta oferta y en la pantalla de bienvenida (con enlace a Google Maps).</div>
        </div>
        <button className="btn gold" disabled={fuera||!ubicacion.trim()||!fechaFinal} onClick={()=>onSend(monto,fechaFinal,ubicacion.trim())}><Send size={15}/> Enviar carta oferta a {cand.nombre.split(" ")[0]}</button>
      </div>
    </div>
  );
}

function Celebracion({cand, p, v}){
  const colores=["#FFB81C","#FFC000","#4338CA","#1E7A3C","#fff"];
  return (
    <div className="celebrate">
      {[...Array(26)].map((_,i)=>(
        <span key={i} className="confetti" style={{left:(i*3.9)+"%",background:colores[i%5],animationDelay:(i*0.23)+"s",animationDuration:(2.6+(i%5)*0.5)+"s"}}/>
      ))}
      <PartyPopper size={44} color="var(--gold)" style={{marginBottom:12}}/>
      <h2 style={{fontSize:24,marginBottom:6}}>¡Nueva contratación! 🎉</h2>
      <p style={{color:"#C9C9C9",marginBottom:22}}>El proceso de la vacante {v.id} concluyó con éxito.</p>
      <div style={{display:"inline-block",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,184,28,0.4)",borderRadius:14,padding:"18px 34px",marginBottom:22}}>
        <div style={{fontSize:20,fontWeight:800}}>{cand.nombre}</div>
        <div style={{color:"var(--gold)",fontWeight:600,marginTop:3}}>{v.req.titulo}</div>
        <div style={{fontSize:12.5,color:"#C9C9C9",marginTop:8}}>No. de empleado</div>
        <div style={{fontSize:26,fontWeight:800,letterSpacing:"0.18em",color:"var(--gold)"}}>{p.numEmpleado}</div>
        <div style={{fontSize:12.5,color:"#C9C9C9",marginTop:8}}>Ingreso y firma: <b style={{color:"#fff"}}>{p.oferta.fecha}</b></div>
        <div style={{fontSize:12.5,color:"#C9C9C9",marginTop:8}}>Se presenta en:</div>
        <div style={{fontSize:13,color:"#fff",fontWeight:600,marginTop:2,maxWidth:320}}>{p.oferta.ubicacion||DIRECCION_CORP}</div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <a className="btn ghost sm" href={mapsUrl(p.oferta.ubicacion)} target="_blank" rel="noreferrer" style={{background:"transparent",color:"#fff",borderColor:"#555"}}><MapPin size={13}/> Ver en Google Maps</a>
        <button className="btn gold sm"><Download size={13}/> Kit de inducción al área</button>
        <button className="btn gold sm"><Download size={13}/> Guía de bienvenida (LMS)</button>
        <button className="btn ghost sm" style={{background:"transparent",color:"#fff",borderColor:"#555"}}><Calendar size={13}/> Agenda del primer día</button>
      </div>
      <p style={{fontSize:11.5,color:"#9E9E9E",marginTop:18}}>Se generó automáticamente su número de empleado, correo corporativo y accesos lógicos (SAP · simulado).</p>
    </div>
  );
}

/* Overlay de búsqueda con IA al aprobar el descriptivo (Batch 1 · F3 · 5 s simulados) */
function BusquedaIAOverlay({onDone}){
  const msgs=["Analizando el marketplace de talento…","Comparando habilidades y experiencia…","Generando ranking de compatibilidad…"];
  const [i,setI]=useState(0);
  useEffect(()=>{
    const iv=setInterval(()=>setI(x=>(x+1)%msgs.length),1600);
    const to=setTimeout(()=>{ clearInterval(iv); onDone(); },5000);
    return ()=>{ clearInterval(iv); clearTimeout(to); };
  },[]);
  return (
    <div className="modal-bg">
      <div className="modal" style={{maxWidth:420,textAlign:"center",padding:"38px 30px"}}>
        <Loader2 size={46} className="ai-spin"/>
        <h3 style={{marginTop:16,color:"var(--ai)"}}>La IA está buscando tu talento</h3>
        <p className="help" style={{marginTop:6}}>Analizando a los candidatos del pool y ordenándolos por compatibilidad con tu vacante.</p>
        <div className="ai-search-msg">{msgs[i]}</div>
        <div className="mini-pipe" style={{marginTop:14}}>{msgs.map((_,k)=><i key={k} className={k<=i?"f":""} style={k<=i?{background:"var(--ai)"}:{}}/>)}</div>
      </div>
    </div>
  );
}

/* Modal: categorizar candidato (Batch 1 · F1.2) */
function CategorizarModal({cand, cats, onToggle, onCrear, onClose}){
  const [nueva,setNueva]=useState("");
  return (
    <Modal onClose={onClose}>
      <h3 style={{marginBottom:4}}>Categorizar a {cand.nombre.split(" ").slice(0,2).join(" ")}</h3>
      <p className="help" style={{marginBottom:14}}>Agrega o quita al candidato de tus categorías personales. Son visibles solo para ti.</p>
      {cats.length===0 && <p className="help" style={{marginBottom:12}}>Aún no tienes categorías. Crea la primera abajo.</p>}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {cats.map(c=>{
          const on=c.cids.includes(cand.id);
          return (
            <button key={c.nombre} className={"check-item"+(on?" done":"")} style={{textAlign:"left"}} onClick={()=>onToggle(c.nombre)}>
              {on? <CheckCircle2 size={18} color="var(--ok)"/> : <FolderPlus size={18} color="var(--gray)"/>}
              <div style={{flex:1,fontSize:13,fontWeight:600}}>{c.nombre}</div>
              <span className="help">{on?"Incluido":"Agregar"}</span>
            </button>
          );
        })}
      </div>
      <label>Crear nueva categoría</label>
      <div style={{display:"flex",gap:8}}>
        <input value={nueva} onChange={e=>setNueva(e.target.value)} placeholder="p. ej. Finalistas de ventas"/>
        <button className="btn dark" disabled={!nueva.trim()} onClick={()=>{onCrear(nueva); setNueva("");}}><Plus size={14}/> Crear</button>
      </div>
    </Modal>
  );
}

/* Modal: compartir candidato con otro formador (Batch 1 · F1.4 · simulado) */
function CompartirModal({cand, onEnviar, onClose}){
  const [dest,setDest]=useState("");
  return (
    <Modal onClose={onClose}>
      <h3 style={{marginBottom:4}}>Compartir candidato</h3>
      <p className="help" style={{marginBottom:14}}>Comparte el perfil de <b>{cand.nombre}</b> con otro formador de equipo.</p>
      <label>Nombre o número de empleado del formador</label>
      <input value={dest} onChange={e=>setDest(e.target.value)} placeholder="p. ej. Arturo Castillo o 1002345"/>
      <div style={{display:"flex",gap:8,marginTop:16}}>
        <button className="btn gold" disabled={!dest.trim()} onClick={()=>onEnviar(dest.trim())}><Share2 size={14}/> Compartir perfil</button>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
      </div>
      <div className="help" style={{marginTop:10}}>Integración simulada en este prototipo; no se envía información real.</div>
    </Modal>
  );
}

/* Modal: solicitar más candidatos a reclutamiento (Batch 1 · F2) */
function SolicitarMasModal({v, onConfirmar, onClose}){
  const [multi,setMulti]=useState(false);
  return (
    <Modal onClose={onClose}>
      <h3 style={{marginBottom:4}}>Solicitar más candidatos</h3>
      <p style={{fontSize:13.5,lineHeight:1.6,marginTop:8}}>Al continuar, un grupo de reclutadores iniciará la búsqueda de talento para <b>"{v.req.titulo}"</b> y te propondrá candidatos viables en un plazo de <b>5 a 10 días hábiles</b>.</p>
      <label className="check-item" style={{marginTop:16,cursor:"pointer"}} onClick={()=>setMulti(m=>!m)}>
        {multi? <CheckCircle2 size={18} color="var(--ok)"/> : <div style={{width:18,height:18,border:"2px solid var(--gray)",borderRadius:5,flexShrink:0}}/>}
        <div style={{flex:1,fontSize:13}}>
          <div style={{fontWeight:700}}>Habilitar Multiposting</div>
          <div className="help">Publica automáticamente la vacante en plataformas de terceros (bolsas de empleo · simulado).</div>
        </div>
      </label>
      <div style={{display:"flex",gap:8,marginTop:16}}>
        <button className="btn gold" onClick={()=>onConfirmar(multi)}><Send size={15}/> Confirmar solicitud</button>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

/* ============================== DETALLE DE VACANTE (Formador) ============================== */
/* Tab inicial al abrir la vacante: el sub-paso activo o pendiente del proceso (no el pool por default).
   Ajustes sobre faseVacante: evaluados aún sin invitar → Ranking; oferta enviada sin aceptar → Carta oferta. */
function tabInicial(v){
  const {subpaso}=faseVacante(v);
  const ps=Object.values(v.pipeline||{});
  const mx=ps.length? Math.max(...ps.map(p=>PIPE_IDX[p.estado]??-1)) : -1;
  if(subpaso===3 && mx<PIPE_IDX.slots_enviados) return 2;
  if(subpaso===6 && v.estado!=="cerrada" && mx<PIPE_IDX.contratado) return 5;
  return subpaso;
}

function VacanteDetail({db, v, run, toast}){
  const [tab,setTab]=useState(tabInicial(v));
  const [perfil,setPerfil]=useState(null);
  const [invitando,setInvitando]=useState(null);
  const [selEnt,setSelEnt]=useState([]);
  const [agenda,setAgenda]=useState(false);
  const [entrevistando,setEntrevistando]=useState(null);
  const [confirmSel,setConfirmSel]=useState(null);
  /* Pool de talento (Batch 1): búsqueda IA, filtros, archivados, categorizar, compartir, solicitar más */
  const [buscando,setBuscando]=useState(false);
  const [fOpen,setFOpen]=useState(false);
  const [fVals,setFVals]=useState({skills:[],expMin:0,edu:"",tipo:"ambos"});
  const [verArch,setVerArch]=useState(false);
  const [catCand,setCatCand]=useState(null);
  const [shareCand,setShareCand]=useState(null);
  const [solicitar,setSolicitar]=useState(false);
  const cand=(cid)=>db.candidatos.find(c=>c.id===Number(cid));
  const f=db.formadores.find(x=>x.id===v.formadorId)||{};
  const favs=f.favoritosCands||[];
  const cats=f.categorias||[];
  const archivados=v.archivados||[];
  const filtroSkills=[...new Set([...(v.req.hardSkills||[]),...(v.req.softSkills||[])])];
  const pasaFiltro=(c)=>{
    if(fVals.tipo!=="ambos" && c.tipo!==(fVals.tipo==="internos"?"interno":"externo")) return false;
    if(fVals.expMin && c.exp<Number(fVals.expMin)) return false;
    if(fVals.edu && EDUCACION.indexOf(c.edu)<EDUCACION.indexOf(fVals.edu)) return false;
    if(fVals.skills.length && !fVals.skills.every(s=>c.hard.includes(s)||c.soft.includes(s))) return false;
    return true;
  };
  const fActivo = fVals.skills.length>0 || Number(fVals.expMin)>0 || !!fVals.edu || fVals.tipo!=="ambos";
  const enCategoria=(cid)=> cats.some(c=>c.cids.includes(cid));
  const pipe=Object.entries(v.pipeline).map(([cid,p])=>({cid:Number(cid),p,c:cand(cid)}));
  const evaluados=pipe.filter(x=>["evaluado","slots_enviados","agendado","entrevistado","seleccionado","docs_completos","oferta_enviada","contratado"].includes(x.p.estado))
    .sort((a,b)=>(b.p.matchIA||b.p.match)-(a.p.matchIA||a.p.match));
  const agendados=pipe.filter(x=>x.p.estado==="agendado");
  const entrevistados=pipe.filter(x=>["entrevistado","seleccionado","docs_completos","oferta_enviada","contratado"].includes(x.p.estado));
  /* Historial de entrevistas (Batch 3 · F7): conserva visibles a los descartados ya entrevistados */
  const entrevistasHist=pipe.filter(x=>x.p.entrevista && (["entrevistado","seleccionado","docs_completos","oferta_enviada","contratado","descartado"].includes(x.p.estado)));
  const seleccionado=pipe.find(x=>["seleccionado","docs_completos","oferta_enviada","contratado"].includes(x.p.estado));
  const contratado=pipe.find(x=>x.p.estado==="contratado");
  const abierta=v.estado==="abierta"||v.estado==="cerrada";

  const SimBtn=({cid,label})=>(
    <button className="btn sm" style={{background:"var(--ai-soft)",color:"var(--ai)",border:"1px dashed #C7CBF5"}}
      onClick={()=>{run(d=>ACT.simular(d,v.id,cid)); toast("Acción del candidato simulada (modo demo)");}}>
      <Zap size={12}/> {label||"Simular respuesta del candidato"}
    </button>
  );

  /* Tarjeta de candidato del pool con acciones (Batch 1 · F1). archivado=vista de archivados */
  const poolCard=({cid,match,c,p},archivado)=>(
    <div className="trow" key={cid} style={archivado?{opacity:0.7}:{}}>
      <MatchRing v={match}/>
      <Avatar nombre={c.nombre}/>
      <div style={{flex:1,minWidth:0}}>
        <b style={{fontSize:14}}>{c.nombre}</b> <Chip tone={c.tipo==="interno"?"gold":""}>{c.tipo}</Chip>
        {favs.includes(cid) && <Chip tone="bad"><Heart size={11}/> Favorito</Chip>}
        <div style={{fontSize:12.5,color:"var(--gray)"}}>{c.puesto} · {c.nivel} · {c.exp} años · {c.ciudad}</div>
        <div className="tagpick" style={{marginTop:5}}>{c.esp.slice(0,2).map(e=><span key={e} className="chip">{e}</span>)}{c.hard.slice(0,2).map(e=><span key={e} className="chip">{e}</span>)}</div>
        {cats.filter(cat=>cat.cids.includes(cid)).map(cat=><span key={cat.nombre} className="chip gold" style={{marginTop:5,marginRight:5}}><FolderPlus size={11}/> {cat.nombre}</span>)}
        {p && <div style={{marginTop:6}}><EstadoChip estado={p.estado}/></div>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
        {archivado ? (
          <button className="btn ghost sm" onClick={()=>{run(d=>ACT.archivarCand(d,v.id,cid)); toast("Candidato restaurado al pool");}}><ArchiveRestore size={13}/> Restaurar</button>
        ):(<>
          <div style={{display:"flex",gap:6}}>
            <button className="btn ghost sm" onClick={()=>setPerfil({c,match})}><User size={13}/> Ver perfil</button>
            <button className="btn ghost sm" onClick={()=>descargarCV(c)}><Download size={13}/> CV</button>
            {!p && <button className="btn gold sm" onClick={()=>setInvitando(c)}><Send size={13}/> Invitar</button>}
          </div>
          <div style={{display:"flex",gap:6}}>
            <button className={"iconact fav"+(favs.includes(cid)?" on":"")} title="Marcar como favorito"
              onClick={()=>run(d=>ACT.toggleFavCand(d,v.formadorId,cid))}><Heart size={15}/></button>
            <button className={"iconact"+(enCategoria(cid)?" on":"")} title="Categorizar" onClick={()=>setCatCand(c)}><FolderPlus size={15}/></button>
            <button className="iconact" title="Compartir con otro formador" onClick={()=>setShareCand(c)}><Share2 size={15}/></button>
            <button className="iconact" title="Archivar de esta vacante" onClick={()=>{run(d=>ACT.archivarCand(d,v.id,cid)); toast("Candidato archivado de esta vacante");}}><Archive size={15}/></button>
          </div>
          {p && ["invitado","postulado","filtros_ok"].includes(p.estado) && <SimBtn cid={cid}/>}
        </>)}
      </div>
    </div>
  );

  return (
    <div>
      <div className={"card"+(v.estado==="cerrada"?" ok":"")} style={{marginBottom:16}}>
        <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:240}}>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <h2 style={{fontSize:19}}>{v.req.titulo}</h2>
              <Chip>{v.id}</Chip>
              {v.req.tipoVacante==="Confidencial"&&<Chip tone="gold" icon={ShieldCheck}>Confidencial</Chip>}
              {v.estado==="asignada"&&<Chip tone="gold">Pendiente de tu aprobación</Chip>}
              {v.estado==="cambios"&&<Chip>Esperando cambios del admin</Chip>}
              {v.estado==="abierta"&&(candidatoElegido(v)?<Chip tone="ok" icon={CheckCircle2}>Candidato elegido</Chip>:<Chip tone="ok">Búsqueda activa</Chip>)}
              {v.estado==="cerrada"&&<Chip tone="ok" icon={CheckCircle2}>Cubierta</Chip>}
            </div>
            <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
              <Chip icon={MapPin}>{v.req.ubicacionTrabajo} · {v.req.modalidad}</Chip>
              <Chip icon={Briefcase}>{v.req.nivelPuesto}</Chip>
              <Chip>{money(v.req.salarioMin)} – {money(v.req.salarioMax)}</Chip>
              <Chip icon={Clock}>{v.req.horario}</Chip>
            </div>
          </div>
        </div>
      </div>

      {/* Proceso en 3 fases: la barra completa agrupa las tabs bajo cada fase (Batch 4 · F13) */}
      <div style={{margin:"0 0 16px"}}><FasesBar v={v} activo={tab} onSub={setTab}/></div>

      {tab===0 && <div className="card"><VistaDescriptivo v={v} onAprobar={()=>setBuscando(true)} onCambios={(t)=>{run(d=>ACT.solicitarCambios(d,v.id,t)); toast("Solicitud de cambios enviada al administrador");}}/></div>}

      {tab===1 && abierta && (()=>{
        const poolAll=(v.pool||[]).map(({cid,match})=>({cid,match,c:cand(cid),p:v.pipeline[cid]}));
        const poolArch=poolAll.filter(x=>archivados.includes(x.cid));
        const poolVis=poolAll.filter(x=>!archivados.includes(x.cid) && pasaFiltro(x.c));
        const BANDAS=[
          {label:"Candidatos ideales",  desc:"90% o más de compatibilidad",  col:"var(--ok)", test:m=>m>=90},
          {label:"Candidatos adecuados", desc:"70% – 89% de compatibilidad", col:"#3E9B5F",    test:m=>m>=70&&m<90},
          {label:"Candidatos adicionales", desc:"menos de 70%",              col:"#8B5E34",    test:m=>m<70},
        ];
        const toggleSkill=(s)=> setFVals(x=>({...x,skills:x.skills.includes(s)?x.skills.filter(y=>y!==s):[...x.skills,s]}));
        return (
        <div>
          <div className="aibox" style={{marginBottom:14}}>
            <div className="hd"><Sparkles size={15}/> Marketplace analizado por IA</div>
            <p style={{fontSize:12.5}}>Se evaluaron <b>{db.candidatos.length} perfiles</b> del pool de talento (internos y externos). Se muestran <b>{(v.pool||[]).length} compatibles</b> ordenados por match; los perfiles sin relación se descartaron automáticamente.</p>
          </div>

          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
            <button className={"btn sm "+(fActivo?"gold":"ghost")} onClick={()=>setFOpen(o=>!o)}><Filter size={13}/> Filtrar{fActivo?" · activos":""}</button>
            <span className="help">{poolVis.length} de {poolAll.length-poolArch.length} candidato(s){fActivo?" tras filtros":""}</span>
            <div style={{flex:1}}/>
            {poolArch.length>0 && <button className="btn ghost sm" onClick={()=>setVerArch(a=>!a)}><Archive size={13}/> {verArch?"Ocultar":"Ver"} archivados ({poolArch.length})</button>}
            <button className="btn ghost sm" onClick={()=>setSolicitar(true)}><Plus size={13}/> Solicitar más candidatos</button>
          </div>

          {fOpen && (
            <div className="filtpanel">
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <b style={{fontSize:13.5}}><Filter size={14} style={{verticalAlign:-2}}/> Filtrar candidatos del pool</b>
                <div style={{flex:1}}/>
                <button className="btn ghost sm" onClick={()=>setFVals({skills:[],expMin:0,edu:"",tipo:"ambos"})}>Limpiar filtros</button>
              </div>
              {filtroSkills.length>0 && (
                <div className="field">
                  <label>Habilidades y herramientas de la vacante</label>
                  <div className="tagpick">{filtroSkills.map(s=><button key={s} className={"tag"+(fVals.skills.includes(s)?" on":"")} onClick={()=>toggleSkill(s)}>{s}</button>)}</div>
                </div>
              )}
              <div className="grid3">
                <div className="field"><label>Años de experiencia (mínimo)</label>
                  <select value={fVals.expMin} onChange={e=>setFVals(x=>({...x,expMin:Number(e.target.value)}))}>
                    {[0,1,2,3,5,8,10].map(n=><option key={n} value={n}>{n===0?"Cualquiera":n+"+ años"}</option>)}
                  </select></div>
                <div className="field"><label>Nivel de estudios (mínimo)</label>
                  <select value={fVals.edu} onChange={e=>setFVals(x=>({...x,edu:e.target.value}))}>
                    <option value="">Cualquiera</option>{EDUCACION.map(ed=><option key={ed} value={ed}>{ed}</option>)}
                  </select></div>
                <div className="field"><label>Tipo de candidato</label>
                  <select value={fVals.tipo} onChange={e=>setFVals(x=>({...x,tipo:e.target.value}))}>
                    <option value="ambos">Ambos</option><option value="internos">Internos</option><option value="externos">Externos</option>
                  </select></div>
              </div>
            </div>
          )}

          {poolVis.length===0 ? (
            <div className="card" style={{textAlign:"center",padding:"36px 24px"}}>
              {fActivo ? (<>
                <Filter size={26} color="var(--gray)" style={{marginBottom:8}}/>
                <p style={{color:"var(--gray)"}}>Ningún candidato coincide con los filtros seleccionados.</p>
                <button className="btn ghost sm" style={{marginTop:12}} onClick={()=>setFVals({skills:[],expMin:0,edu:"",tipo:"ambos"})}>Limpiar filtros</button>
              </>):(<>
                <Users size={30} color="var(--gold-dark)" style={{marginBottom:10}}/>
                <h3 style={{fontSize:16,marginBottom:6}}>No hay candidatos compatibles disponibles</h3>
                <p style={{color:"var(--gray)",maxWidth:440,margin:"0 auto 16px"}}>Solicita a nuestro equipo de reclutamiento que busque talento a la medida de esta vacante.</p>
                <button className="btn gold" onClick={()=>setSolicitar(true)}><Users size={16}/> Solicitar más candidatos</button>
              </>)}
            </div>
          ):(
            BANDAS.map(b=>{
              const grupo=poolVis.filter(x=>b.test(x.match));
              if(!grupo.length) return null;
              return (
                <div key={b.label}>
                  <div className="band-div">
                    <b style={{color:b.col}}>{b.label}</b>
                    <span className="cnt">· {b.desc} · {grupo.length}</span>
                    <div className="ln" style={{background:b.col}}/>
                  </div>
                  {grupo.map(x=>poolCard(x,false))}
                </div>
              );
            })
          )}

          {verArch && poolArch.length>0 && (
            <div>
              <div className="band-div"><b style={{color:"var(--gray)"}}>Archivados</b><span className="cnt">· ocultos del pool · {poolArch.length}</span><div className="ln" style={{background:"var(--gray)"}}/></div>
              {poolArch.map(x=>poolCard(x,true))}
            </div>
          )}
        </div>
        );
      })()}

      {tab===2 && abierta && (
        <div>
          {evaluados.length===0 ? (
            <div className="card" style={{textAlign:"center",padding:40,color:"var(--gray)"}}>
              <Video size={26} style={{marginBottom:8}}/><p>Aún no hay candidatos evaluados. Cuando los invitados completen sus documentos, los filtros automáticos y la video-entrevista con IA, aparecerán aquí ranqueados.</p>
            </div>
          ):(<>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <Star size={16} color="var(--gold-dark)"/><b>Terna top y demás opciones</b>
              <span className="help">Ranking recalculado por la IA tras filtros (buró, empleos previos, PLD) y video-entrevista. Puedes invitar a entrevista a un máximo de 3 candidatos a la vez.</span>
            </div>
            {evaluados.map(({cid,p,c},i)=>(
              <div className="trow" key={cid} style={i<3?{borderColor:"var(--gold)",background:"#FFFDF6"}:{}}>
                {i<3 && <span className="chip gold" style={{minWidth:52,justifyContent:"center"}}>Top {i+1}</span>}
                <MatchRing v={p.matchIA||p.match}/>
                <Avatar nombre={c.nombre}/>
                <div style={{flex:1,minWidth:0}}>
                  <b>{c.nombre}</b> <Chip tone={c.tipo==="interno"?"gold":""}>{c.tipo==="interno"?"Interno":"Externo"}</Chip>
                  <div style={{fontSize:12.5,color:"var(--gray)"}}>{c.puesto} · {c.ciudad}</div>
                  <div className="tagpick" style={{marginTop:5}}>{[...c.hard.slice(0,3),...c.soft.slice(0,1)].map(e=><span key={e} className="chip">{e}</span>)}</div>
                  <div style={{marginTop:6}}><EstadoChip estado={p.estado}/></div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button className="btn ghost sm" onClick={()=>setPerfil({c,match:p.matchIA||p.match})}>Ver detalles</button>
                    <button className="btn ghost sm" onClick={()=>descargarCV(c)}><Download size={13}/> CV</button>
                    {p.estado==="evaluado" && (
                      <button className={"btn sm "+(selEnt.includes(cid)?"dark":"gold")}
                        disabled={!selEnt.includes(cid)&&selEnt.length>=3}
                        title={!selEnt.includes(cid)&&selEnt.length>=3?"Límite alcanzado: máximo 3 candidatos por ronda de entrevistas":""}
                        style={!selEnt.includes(cid)&&selEnt.length>=3?{opacity:.45,cursor:"not-allowed"}:{}}
                        onClick={()=>setSelEnt(s=>s.includes(cid)?s.filter(x=>x!==cid): s.length<3?[...s,cid]:s)}>
                        {selEnt.includes(cid)? <>Quitar de la lista</> : <><Calendar size={13}/> Invitar a entrevista</>}
                      </button>
                    )}
                  </div>
                  {p.estado==="slots_enviados" && <SimBtn cid={cid} label="Simular confirmación de horario"/>}
                </div>
              </div>
            ))}
            {selEnt.length>0 && (
              <div style={{position:"sticky",bottom:16,marginTop:14,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                {selEnt.length>=3 && <span className="chip gold"><AlertCircle size={11}/> Límite alcanzado: máximo 3 candidatos por ronda de entrevistas</span>}
                <button className="btn dark" onClick={()=>setAgenda(true)}><Calendar size={15}/> Agendar entrevista con {selEnt.length} candidato(s)</button>
              </div>
            )}
          </>)}
        </div>
      )}

      {tab===3 && abierta && (
        <div>
          {agendados.length===0 && entrevistasHist.length===0 && (
            <div className="card" style={{textAlign:"center",padding:40,color:"var(--gray)"}}>
              <Calendar size={26} style={{marginBottom:8}}/><p>No hay entrevistas agendadas todavía. Invita candidatos desde la pestaña "Ranking y terna".</p>
            </div>
          )}
          {agendados.map(({cid,p,c})=>(
            <div className="trow" key={cid}>
              <Avatar nombre={c.nombre}/>
              <div style={{flex:1}}>
                <b>{c.nombre}</b>
                <div style={{fontSize:12.5,color:"var(--gray)",marginTop:2}}><CalendarCheck size={12} style={{verticalAlign:-2}}/> {p.slotElegido} · {p.modalidadEnt}</div>
                <a href="#" onClick={e=>e.preventDefault()} style={{fontSize:12,color:"var(--ai)",fontWeight:600}}><Link2 size={11} style={{verticalAlign:-1}}/> Unirse a la reunión de Teams (simulado)</a>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button className="btn ai sm" onClick={()=>setEntrevistando({c,p,externa:false})}><Video size={13}/> Iniciar con copiloto IA</button>
                <button className="btn ghost sm" onClick={()=>setEntrevistando({c,p,externa:true})}>Registrar entrevista externa</button>
              </div>
            </div>
          ))}
          {entrevistasHist.map(({cid,p,c})=>(
            <div className="trow" key={cid}>
              <MatchRing v={p.matchFinal}/>
              <Avatar nombre={c.nombre}/>
              <div style={{flex:1}}>
                <b>{c.nombre}</b> <EstadoChip estado={p.estado}/>
                <div style={{fontSize:12.5,color:"var(--ink2)",marginTop:5,background:"var(--bg)",borderRadius:8,padding:"8px 10px"}}>
                  {p.entrevista.calificacion && <span style={{float:"right",fontWeight:800,fontSize:12,color:"var(--gold-dark)",marginLeft:10}} title="Calificación de la entrevista">{p.entrevista.calificacion}/10 ⭐</span>}
                  <b style={{fontSize:11,color:"var(--ai)"}}><Sparkles size={11} style={{verticalAlign:-1}}/> RESUMEN IA:</b> {p.entrevista.resumen}
                </div>
                <div style={{fontSize:12.5,color:"var(--ink2)",marginTop:4}}><b style={{fontSize:11,color:"var(--gold-dark)"}}>TU FEEDBACK:</b> {p.entrevista.feedback}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab===4 && abierta && (
        <div>
          {!seleccionado && entrevistados.length===0 && (
            <div className="card" style={{textAlign:"center",padding:40,color:"var(--gray)"}}><ClipboardList size={26} style={{marginBottom:8}}/><p>Cuando tengas candidatos entrevistados podrás elegir aquí a tu candidato ideal.</p></div>
          )}
          {!seleccionado && entrevistados.map(({cid,p,c})=>(
            <div className="trow" key={cid}>
              <MatchRing v={p.matchFinal}/><Avatar nombre={c.nombre}/>
              <div style={{flex:1}}><b>{c.nombre}</b><div style={{fontSize:12.5,color:"var(--gray)"}}>{c.puesto} · Entrevistado el {p.entrevista.fecha}</div></div>
              <button className="btn gold" onClick={()=>setConfirmSel({cid,c})}><CheckCircle2 size={15}/> Seleccionar como candidato ideal</button>
            </div>
          ))}
          {seleccionado && (
            <div className="card">
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
                <Avatar nombre={seleccionado.c.nombre}/>
                <div style={{flex:1}}><b style={{fontSize:15}}>{seleccionado.c.nombre}</b> <Chip tone="ok" icon={CheckCircle2}>Candidato seleccionado</Chip>
                  <div style={{fontSize:12.5,color:"var(--gray)"}}>Se notificó al candidato con la felicitación y el checklist de documentos. Los demás candidatos fueron notificados y canalizados a otras vacantes compatibles.</div></div>
                {seleccionado.p.estado==="seleccionado" && (
                  <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                    <button className="btn gold sm" onClick={()=>{run(d=>ACT.recordarDocs(d,v.id,seleccionado.cid)); toast("Recordatorio enviado a "+seleccionado.c.nombre.split(" ")[0]);}}><Bell size={13}/> Enviar recordatorio de documentos</button>
                    <SimBtn cid={seleccionado.cid} label="Simular carga de documentos"/>
                  </div>
                )}
              </div>
              <label>Checklist de documentación del candidato (PDF · máx. 1 MB c/u)</label>
              {[["ine","Identificación oficial (INE)"],["curp","CURP"],["rfc","Constancia de situación fiscal (RFC)"],["domicilio","Comprobante de domicilio"],["estudios","Comprobante de estudios"]].map(([k,l])=>(
                <div key={k} className={"check-item"+(seleccionado.p.docsContrato[k]?" done":"")}>
                  {seleccionado.p.docsContrato[k]? <CheckCircle2 size={18} color="var(--ok)"/>:<Clock size={18} color="var(--gray)"/>}
                  <div style={{flex:1,fontSize:13,fontWeight:600}}>{l}</div>
                  <span className="help">{seleccionado.p.docsContrato[k]? "Recibido y validado":"Pendiente del candidato"}</span>
                </div>
              ))}
              <div className={"check-item"+(seleccionado.p.cuentaBanco?" done":"")}>
                {seleccionado.p.cuentaBanco? <CheckCircle2 size={18} color="var(--ok)"/>:<Landmark size={18} color="var(--gray)"/>}
                <div style={{flex:1,fontSize:13,fontWeight:600}}>Cuenta bancaria para nómina</div>
                <span className="help">{seleccionado.p.cuentaBanco? "Cuenta registrada: ••••"+String(seleccionado.p.cuentaBanco).slice(-4):"Pendiente del candidato"}</span>
              </div>
              {v.req.examenMedico && (
                <div className={"check-item"+(seleccionado.p.medico?.validado?" done":"")} style={{alignItems:"flex-start"}}>
                  {seleccionado.p.medico?.validado? <CheckCircle2 size={18} color="var(--ok)"/> : <ShieldCheck size={18} color={seleccionado.p.medico?"var(--warn)":"var(--gray)"}/>}
                  <div style={{flex:1,fontSize:13}}>
                    <div style={{fontWeight:600}}>Examen médico</div>
                    {seleccionado.p.medico
                      ? <div className="help">{seleccionado.p.medico.sucursal} · {seleccionado.p.medico.fecha} · {seleccionado.p.medico.validado?"resultado validado":"en espera de tu validación"}</div>
                      : <div className="help">El candidato aún no agenda su examen médico.</div>}
                  </div>
                  {seleccionado.p.medico && !seleccionado.p.medico.validado &&
                    <button className="btn gold sm" onClick={()=>{run(d=>ACT.validarMedico(d,v.id,seleccionado.cid)); toast("Examen médico validado · se notificó al candidato");}}><CheckCircle2 size={13}/> Validar resultado positivo del examen</button>}
                </div>
              )}
              {seleccionado.p.estado!=="seleccionado" && <div className="chip ok" style={{marginTop:12}}><CheckCircle2 size={12}/> Documentación completa — continúa a la carta oferta</div>}
            </div>
          )}
        </div>
      )}

      {tab===5 && abierta && (
        <div className="card">
          {!seleccionado && <p style={{color:"var(--gray)",textAlign:"center",padding:30}}>Primero selecciona a tu candidato ideal.</p>}
          {seleccionado && seleccionado.p.estado==="seleccionado" && <p style={{color:"var(--gray)",textAlign:"center",padding:30}}>Esperando a que {seleccionado.c.nombre.split(" ")[0]} complete su documentación para habilitar la carta oferta.</p>}
          {seleccionado && seleccionado.p.estado==="docs_completos" && (<>
            <h3 style={{marginBottom:14}}>Preparar carta oferta · {seleccionado.c.nombre}</h3>
            <OfertaTool v={v} cand={seleccionado.c} p={seleccionado.p} onSend={(m,f,u)=>{run(d=>ACT.enviarOferta(d,v.id,seleccionado.cid,m,f,u)); toast("Carta oferta enviada al candidato");}}/>
          </>)}
          {seleccionado && seleccionado.p.estado==="oferta_enviada" && (
            <div style={{textAlign:"center",padding:26}}>
              <Send size={26} color="var(--gold-dark)" style={{marginBottom:8}}/>
              <h3>Carta oferta enviada</h3>
              <p style={{color:"var(--gray)",fontSize:13,margin:"6px 0 14px"}}>{money(seleccionado.p.oferta.monto)} /mes · ingreso el {seleccionado.p.oferta.fecha}. Te notificaremos cuando {seleccionado.c.nombre.split(" ")[0]} responda.</p>
              <SimBtn cid={seleccionado.cid} label="Simular aceptación y firma"/>
            </div>
          )}
          {contratado && <div className="chip ok"><CheckCircle2 size={12}/> Oferta aceptada — ve a la pestaña Contratación</div>}
        </div>
      )}

      {tab===6 && abierta && (
        contratado ? <Celebracion cand={contratado.c} p={contratado.p} v={v}/> :
        <div className="card" style={{textAlign:"center",padding:40,color:"var(--gray)"}}><PartyPopper size={26} style={{marginBottom:8}}/><p>Aquí verás la pantalla de celebración cuando tu candidato acepte la oferta y firme su contrato.</p></div>
      )}

      {buscando && <BusquedaIAOverlay onDone={()=>{ run(d=>ACT.aprobarVacante(d,v.id)); setBuscando(false); setTab(1); toast("Vacante aprobada · la IA generó tu pool de talento"); }}/>}
      {catCand && <CategorizarModal cand={catCand} cats={cats}
        onToggle={(nombre)=>run(d=>ACT.toggleCategoria(d,v.formadorId,nombre,catCand.id))}
        onCrear={(nombre)=>run(d=>ACT.crearCategoria(d,v.formadorId,nombre))}
        onClose={()=>setCatCand(null)}/>}
      {shareCand && <CompartirModal cand={shareCand}
        onEnviar={(dest)=>{ setShareCand(null); toast("Perfil de "+shareCand.nombre.split(" ")[0]+" compartido con "+dest+" (simulado)"); }}
        onClose={()=>setShareCand(null)}/>}
      {solicitar && <SolicitarMasModal v={v}
        onConfirmar={(multi)=>{ run(d=>ACT.solicitarMasCandidatos(d,v.id,multi)); setSolicitar(false); toast("Solicitud enviada · recibirás candidatos en 5–10 días hábiles"); }}
        onClose={()=>setSolicitar(false)}/>}
      {perfil && <PerfilModal cand={perfil.c} match={perfil.match} req={v.req} onClose={()=>setPerfil(null)}
        fav={favs.includes(perfil.c.id)} enCat={enCategoria(perfil.c.id)} archivado={archivados.includes(perfil.c.id)}
        onFav={()=>run(d=>ACT.toggleFavCand(d,v.formadorId,perfil.c.id))}
        onCat={()=>setCatCand(perfil.c)}
        onArchivar={()=>{ const era=archivados.includes(perfil.c.id); run(d=>ACT.archivarCand(d,v.id,perfil.c.id)); toast(era?"Candidato restaurado al pool":"Candidato archivado de esta vacante"); }}
        extra={!v.pipeline[perfil.c.id] && abierta && <button className="btn gold" onClick={()=>{setInvitando(perfil.c);setPerfil(null);}}><Send size={15}/> Invitar a postularse</button>}/>}
      {invitando && <InvitarModal cand={invitando} v={v} onClose={()=>setInvitando(null)}
        onSend={(msg)=>{run(d=>ACT.invitar(d,v.id,invitando.id,msg)); setInvitando(null); toast("Invitación enviada a "+invitando.nombre.split(" ")[0]);}}/>}
      {agenda && <AgendaModal v={v} cands={selEnt.map(cand)} onClose={()=>setAgenda(false)}
        onSend={(slots,mod)=>{run(d=>ACT.enviarSlots(d,v.id,selEnt,slots,mod)); setAgenda(false); setSelEnt([]); toast("Opciones de horario enviadas a los candidatos");}}/>}
      {entrevistando && <EntrevistaModal cand={entrevistando.c} v={v} p={entrevistando.p} externa={entrevistando.externa} onClose={()=>setEntrevistando(null)}
        onSave={(data)=>{run(d=>ACT.registrarEntrevista(d,v.id,entrevistando.c.id,data)); setEntrevistando(null); toast("Entrevista guardada · ranking actualizado por la IA");}}/>}
      {confirmSel && (
        <Modal onClose={()=>setConfirmSel(null)}>
          <h3 style={{marginBottom:8}}>¿Confirmas tu decisión?</h3>
          {(()=>{ const rk=[...entrevistados].sort((a,b)=>(b.p.matchFinal||0)-(a.p.matchFinal||0)); const pos=rk.findIndex(x=>x.cid===confirmSel.cid)+1;
            return <p style={{fontSize:13.5,lineHeight:1.6}}>Estás por elegir al candidato <b>{confirmSel.c.nombre}</b>, con ranking <b>#{pos}</b>, como candidato ideal para "{v.req.titulo}", y continuarás con la contratación. Se le enviará la felicitación con el checklist de documentos y <b>los demás candidatos entrevistados serán notificados</b> y canalizados a otras vacantes compatibles.</p>; })()}
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button className="btn gold" onClick={()=>{run(d=>ACT.seleccionar(d,v.id,confirmSel.cid)); setConfirmSel(null); setTab(4); toast("Candidato seleccionado · notificaciones enviadas");}}><CheckCircle2 size={15}/> Sí, continuar con la contratación</button>
            <button className="btn ghost" onClick={()=>setConfirmSel(null)}>Volver</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== NOTIFICACIONES ============================== */
function NotifList({db, para, run, onGo}){
  const lista=db.notifs.filter(n=>n.para.tipo===para.tipo && String(n.para.id)===String(para.id));
  useEffect(()=>{ run(d=>{ d.notifs.forEach(n=>{ if(n.para.tipo===para.tipo && String(n.para.id)===String(para.id)) n.leida=true; }); }); },[]);
  if(!lista.length) return <div className="card" style={{textAlign:"center",padding:40,color:"var(--gray)"}}><Bell size={24} style={{marginBottom:8}}/><p>Sin notificaciones por ahora.</p></div>;
  return <div>{lista.map(n=>(
    <div key={n.id} className={"notif"+(n.leida?"":" unread")}>
      <Bell size={16} color="var(--gold-dark)" style={{marginTop:2,flexShrink:0}}/>
      <div style={{flex:1}}>
        <b style={{fontSize:13.5}}>{n.titulo}</b>
        <div style={{fontSize:12.5,color:"var(--ink2)",marginTop:3,lineHeight:1.5}}>{n.msg}</div>
        <div className="help" style={{marginTop:4}}>{n.fecha}{n.vacId?` · Vacante ${n.vacId}`:""}</div>
      </div>
      {n.vacId && onGo && <button className="btn ghost sm" onClick={()=>onGo(n.vacId)}>Abrir <ChevronRight size={12}/></button>}
    </div>
  ))}</div>;
}

function FormadorHome({db, formador, run, onOpen}){
  const mias=db.vacantes.filter(v=>v.formadorId===formador.id);
  const pend=db.notifs.filter(n=>n.para.tipo==="formador"&&n.para.id===formador.id&&!n.leida).length;
  const activos=mias.reduce((a,v)=>a+Object.values(v.pipeline).filter(p=>(PIPE_IDX[p.estado]??-1)>=0 && p.estado!=="contratado").length,0);
  return (
    <div>
      <div className="grid3" style={{marginBottom:18}}>
        <div className="stat"><b>{mias.filter(v=>v.estado!=="cerrada").length}</b><span>Vacantes activas a tu cargo</span></div>
        <div className="stat"><b>{activos}</b><span>Candidatos en proceso</span></div>
        <div className="stat"><b style={{color:pend?"var(--gold-dark)":"inherit"}}>{pend}</b><span>Notificaciones sin leer</span></div>
      </div>
      <h3 style={{margin:"4px 0 12px",fontSize:15}}>Tus vacantes y su avance en el proceso</h3>
      {mias.map(v=>{
        const enProceso=Object.keys(v.pipeline).length;
        return (
          <div className={"card"+(v.estado==="cerrada"?" ok":"")} key={v.id} style={{marginBottom:14,cursor:"pointer"}} onClick={()=>onOpen(v.id)}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <b style={{fontSize:15}}>{v.req.titulo}</b><Chip>{v.id}</Chip>
              {v.estado==="asignada"&&<Chip tone="gold" icon={AlertCircle}>Requiere tu revisión</Chip>}
              {v.estado==="cambios"&&<Chip icon={Clock}>Esperando al admin</Chip>}
              {v.estado==="abierta"&&(candidatoElegido(v)?<Chip tone="ok" icon={CheckCircle2}>Candidato elegido</Chip>:<Chip tone="ok">Búsqueda activa</Chip>)}
              {v.estado==="cerrada"&&<Chip tone="ok" icon={CheckCircle2}>Cubierta</Chip>}
              <span style={{marginLeft:"auto"}} className="help">{enProceso? enProceso+" candidato(s) en proceso · ":""}Creada {v.creada}</span>
              <ChevronRight size={16} color="var(--gray)"/>
            </div>
            <div style={{marginTop:12}}><FasesBar v={v} compact/></div>
          </div>
        );
      })}
      {!mias.length && <div className="card" style={{textAlign:"center",color:"var(--gray)",padding:36}}>El administrador aún no te asigna vacantes.</div>}
    </div>
  );
}

/* ============================== PANEL DEL CANDIDATO ============================== */
function VideoIAModal({cand, v, onDone, onClose}){
  const [paso,setPaso]=useState(0);
  const pregs=[
    "Preséntate brevemente: trayectoria, especialidad y lo que buscas en tu siguiente reto.",
    `Esta vacante requiere ${v.req.hardSkills.slice(0,2).join(" y ")}. Cuéntame un proyecto donde los aplicaste.`,
    `¿Cómo describirías tu nivel en ${v.req.espRequeridas[0]||v.req.area}? Da un ejemplo concreto.`,
    "Describe una situación difícil con un cliente o compañero y cómo la resolviste.",
    "¿Por qué te interesa esta posición y qué disponibilidad tienes?",
  ];
  return (
    <Modal onClose={onClose} wide>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <Video size={18} color="var(--ai)"/><h3>Video-entrevista con agente de IA</h3>
        <span className="chip ai" style={{marginLeft:"auto"}}><Sparkles size={11}/> Grabando (simulado)</span>
      </div>
      <div style={{background:"var(--ink)",borderRadius:14,height:170,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,marginBottom:14}}>
        <div style={{width:58,height:58,borderRadius:99,background:"var(--ai)",display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={28} color="#fff"/></div>
        <span style={{color:"#C9C9C9",fontSize:12}}>Agente IA de Reclutalia · videollamada simulada</span>
      </div>
      <div className="aibox">
        <div className="hd">Pregunta {paso+1} de {pregs.length}</div>
        <p style={{fontSize:14,lineHeight:1.55}}>{pregs[paso]}</p>
      </div>
      <div className="mini-pipe" style={{margin:"12px 0"}}>{pregs.map((_,i)=><i key={i} className={i<=paso?"f":""}/>)}</div>
      {paso<pregs.length-1
        ? <button className="btn ai" onClick={()=>setPaso(paso+1)}>He respondido · siguiente pregunta <ChevronRight size={15}/></button>
        : <button className="btn gold" onClick={onDone}><CheckCircle2 size={15}/> Finalizar video-entrevista</button>}
    </Modal>
  );
}

/* Agendar examen médico (Batch 6) — captura de ubicación + 5 sucursales simuladas + fecha próx. 7 días */
function MedicoAgendar({onAgendar}){
  const [estado,setEstado]=useState("");
  const [ciudad,setCiudad]=useState("");
  const [municipio,setMunicipio]=useState("");
  const [busco,setBusco]=useState(false);
  const [suc,setSuc]=useState("");
  const [fecha,setFecha]=useState("");
  const dias=useMemo(()=>proximosDias(7),[]);
  const ubicOk = estado.trim()&&ciudad.trim()&&municipio.trim();
  return (
    <div style={{marginTop:8}}>
      <div className="help" style={{marginBottom:8}}>Agenda tu examen médico dentro de la próxima semana en una sucursal autorizada cercana a tu ubicación.</div>
      <div className="grid3">
        <div className="field" style={{marginBottom:8}}><label>Estado</label><input value={estado} onChange={e=>setEstado(e.target.value)} placeholder="p. ej. Ciudad de México"/></div>
        <div className="field" style={{marginBottom:8}}><label>Ciudad</label><input value={ciudad} onChange={e=>setCiudad(e.target.value)} placeholder="p. ej. CDMX"/></div>
        <div className="field" style={{marginBottom:8}}><label>Municipio / alcaldía</label><input value={municipio} onChange={e=>setMunicipio(e.target.value)} placeholder="p. ej. Tlalpan"/></div>
      </div>
      <button className="btn dark sm" disabled={!ubicOk} onClick={()=>setBusco(true)}><Search size={13}/> Buscar sucursales autorizadas</button>
      {!ubicOk && <div className="help" style={{marginTop:6}}>Captura tu estado, ciudad y municipio para ver las sucursales cercanas.</div>}
      {busco && ubicOk && (<>
        <label style={{marginTop:14}}>Sucursales autorizadas cerca de tu ubicación</label>
        {SUCURSALES_MEDICAS.map(s=>(
          <label key={s.nombre} className={"check-item"+(suc===s.nombre?" done":"")} style={{cursor:"pointer",fontWeight:400,marginTop:6}}>
            <input type="radio" name="sucmed" style={{width:"auto",marginRight:6}} checked={suc===s.nombre} onChange={()=>setSuc(s.nombre)}/>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{s.nombre}</div><div className="help">{s.dir}</div></div>
          </label>
        ))}
        <div className="field" style={{marginTop:12,marginBottom:8}}><label>Fecha de la cita (dentro de los próximos 7 días)</label>
          <select value={fecha} onChange={e=>setFecha(e.target.value)}><option value="">Selecciona una fecha…</option>{dias.map(d=><option key={d}>{d}</option>)}</select></div>
        <button className="btn gold" disabled={!suc||!fecha} onClick={()=>onAgendar({estado,ciudad,municipio,sucursal:suc,fecha})}><CalendarCheck size={15}/> Agendar examen médico</button>
      </>)}
    </div>
  );
}

function CandidatoHome({db, cand, run, toast, onBuscar}){
  const [videoV,setVideoV]=useState(null);
  const [confirmOferta,setConfirmOferta]=useState(null);
  const [feedbackDe,setFeedbackDe]=useState(null);
  const [filtro,setFiltro]=useState("todos");
  const [qrDe,setQrDe]=useState(null);       // vacId mostrando el QR de apertura de cuenta (Batch 5)
  const [cuentaDe,setCuentaDe]=useState(null); // vacId mostrando el modal de captura de número de cuenta
  const procesos=db.vacantes.filter(v=>v.pipeline[cand.id]);
  const esCerrado=(est)=> ["contratado","descartado","filtrado"].includes(est);
  const cont={ todos:procesos.length,
    activos:procesos.filter(v=>!esCerrado(v.pipeline[cand.id].estado)).length,
    cerrados:procesos.filter(v=>esCerrado(v.pipeline[cand.id].estado)).length };
  const visibles=procesos.filter(v=>{
    if(filtro==="todos") return true;
    const cerrado=esCerrado(v.pipeline[cand.id].estado);
    return filtro==="cerrados"? cerrado : !cerrado;
  });
  if(!procesos.length) return (
    <div className="card" style={{textAlign:"center",padding:44,color:"var(--gray)"}}>
      <Briefcase size={26} style={{marginBottom:8}}/>
      <p>Aún no tienes procesos activos. Cuando un formador te invite a una vacante del marketplace, aparecerá aquí.</p>
      <p className="help" style={{marginTop:8}}>Tip para la demo: entra como Formador, aprueba una vacante e invita a este candidato desde el pool.</p>
    </div>
  );
  return (
    <div>
      <div className="tagpick" style={{marginBottom:16}}>
        <button className={"tag"+(filtro==="todos"?" on":"")} onClick={()=>setFiltro("todos")}>Todos ({cont.todos})</button>
        <button className={"tag"+(filtro==="activos"?" on":"")} onClick={()=>setFiltro("activos")}>Activos ({cont.activos})</button>
        <button className={"tag"+(filtro==="cerrados"?" on":"")} onClick={()=>setFiltro("cerrados")}>Cerrados ({cont.cerrados})</button>
      </div>
      {!visibles.length && (
        <div className="card" style={{textAlign:"center",color:"var(--gray)",padding:36}}>
          {filtro==="activos"? "No tienes procesos activos en este momento."
            : filtro==="cerrados"? "Aún no tienes procesos cerrados."
            : "No hay procesos para mostrar."}
        </div>
      )}
      {visibles.map(v=>{
        const p=v.pipeline[cand.id];
        const formador=db.formadores.find(f=>f.id===v.formadorId);
        const constancias=p.docsFiltro.constancias||[];
        const filtroDocsOk = constancias.length>=1 && psicoVigente(cand.psicometrico) && p.autorizaFiltros;
        const contratoKeys=[["ine","Identificación oficial (INE)"],["curp","CURP"],["rfc","Constancia de situación fiscal (RFC)"],["domicilio","Comprobante de domicilio"],["estudios","Comprobante de estudios"]];
        const medicoOk = !v.req.examenMedico || !!(p.medico && p.medico.validado);
        const contratoOk=contratoKeys.every(([k])=>p.docsContrato[k]) && !!p.cuentaBanco && medicoOk;
        /* Handlers de constancias múltiples (Batch 4) */
        const pipeMut=(fn)=>run(d=>{ fn(d.vacantes.find(x=>x.id===v.id).pipeline[cand.id]); });
        const addConstancia=(n)=>pipeMut(pp=>{ pp.docsFiltro.constancias=[...(pp.docsFiltro.constancias||[]), n]; });
        const setConstancia=(i,n)=>pipeMut(pp=>{ pp.docsFiltro.constancias=(pp.docsFiltro.constancias||[]).map((x,j)=>j===i?n:x); });
        const delConstancia=(i)=>pipeMut(pp=>{ pp.docsFiltro.constancias=(pp.docsFiltro.constancias||[]).filter((_,j)=>j!==i); });
        return (
          <div className={"card"+(p.estado==="contratado"?" ok":"")} key={v.id} style={{marginBottom:16}}>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <b style={{fontSize:15}}>{v.req.titulo}</b><Chip>{v.id}</Chip>
              <Chip icon={MapPin}>{v.req.ubicacionTrabajo} · {v.req.modalidad}</Chip>
              <Chip icon={User}>Formador: {formador.nombre}</Chip>
            </div>
            {!["descartado","filtrado"].includes(p.estado) &&
              <div style={{margin:"10px 0 14px",maxWidth:560}}><MiniPipe estado={p.estado}/></div>}

            {p.estado==="invitado" && (<>
              <div className="aibox" style={{marginBottom:12}}>
                <div className="hd"><Send size={14}/> Mensaje del formador</div>
                <p style={{fontSize:13}}>"{p.mensaje}"</p>
              </div>
              <PostulacionForm v={v} onAplicar={(ok)=>{ run(d=>ACT.aplicar(d,v.id,cand.id,ok)); toast(ok?"¡Postulación enviada!":"Gracias, registramos tus respuestas"); }}/>
            </>)}

            {["postulado","filtros_ok"].includes(p.estado) && (<>
              <label>Documentos para filtros iniciales <span style={{fontWeight:400,color:"var(--gray)"}}>(paso 2 de 2)</span></label>
              <div className="help" style={{marginTop:-2,marginBottom:10}}>Checklist de documentación del candidato (PDF · máx. 1 MB c/u). Puedes convertir y comprimir tus archivos utilizando herramientas gratuitas en línea.</div>

              {/* Constancias de empleos previos — varios archivos */}
              <div style={{fontSize:12.5,fontWeight:600,color:"var(--ink2)",margin:"4px 0 6px"}}>Constancias de empleos previos</div>
              {constancias.map((n,i)=>(
                <UploadPDF key={i} label={`Constancia de empleo ${i+1}`} value={n}
                  onDone={nm=>setConstancia(i,nm)} onDelete={()=>delConstancia(i)}/>
              ))}
              {p.estado==="postulado" && <UploadPDF label={constancias.length? "Agregar otra constancia de empleo" : "Constancia de empleo previo"} value={null} onDone={n=>addConstancia(n)}/>}

              {/* Examen psicométrico — a nivel candidato, vigencia 6 meses */}
              <div style={{fontSize:12.5,fontWeight:600,color:"var(--ink2)",margin:"14px 0 6px"}}>Examen psicométrico</div>
              {psicoVigente(cand.psicometrico) ? (
                <div className="check-item done">
                  <ClipboardCheck size={20} color="var(--ok)"/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>Examen psicométrico completado</div>
                    <div className="help">Resultado válido para otras vacantes durante 6 meses · vigente hasta {psicoVigenteHasta(cand.psicometrico)}.</div>
                  </div>
                </div>
              ) : (
                <div className="check-item">
                  <ClipboardCheck size={20} color="var(--gray)"/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>Examen psicométrico</div>
                    <div className="help">Al completarlo, tu resultado será válido para otras aplicaciones de vacantes durante 6 meses.</div>
                  </div>
                  {p.estado==="postulado" && <button className="btn ai sm" onClick={()=>{run(d=>ACT.completarPsicometrico(d,cand.id)); toast("Examen psicométrico completado");}}><ClipboardCheck size={13}/> Realizar examen</button>}
                </div>
              )}

              {/* Nota: datos y documentos del perfil */}
              <div className="help" style={{marginTop:12,marginBottom:2}}>
                <AlertCircle size={11} style={{verticalAlign:-1}}/> Los datos y documentos de tu perfil (INE, RFC y constancias educativas cargadas en <b>tu perfil</b>) se utilizarán automáticamente al aplicar a esta vacante.
              </div>

              {p.estado==="postulado" && (<>
                {/* Autorización obligatoria */}
                <label className="check-item" style={{marginTop:12,cursor:"pointer",fontWeight:400,alignItems:"flex-start"}}>
                  <input type="checkbox" style={{width:"auto",marginTop:2,marginRight:8}} checked={!!p.autorizaFiltros}
                    onChange={e=>{ const val=e.target.checked; pipeMut(pp=>{ pp.autorizaFiltros=val; }); }}/>
                  <span style={{flex:1,fontSize:13,lineHeight:1.5}}>Autorizo a Reclutalia a procesar mis documentos y a revisar mi historial de crédito y de empleos previos como parte de los filtros iniciales.</span>
                </label>
                <button className="btn dark" style={{marginTop:12}} disabled={!filtroDocsOk}
                  onClick={()=>{run(d=>ACT.docsFiltroListos(d,v.id,cand.id)); toast("Filtros automáticos aprobados");}}>
                  <ShieldCheck size={15}/> Enviar a validación automática
                </button>
                {!filtroDocsOk && <div className="help" style={{marginTop:6}}>Para continuar: sube al menos una constancia de empleo, completa el examen psicométrico y marca la autorización.</div>}
              </>)}

              {p.estado==="filtros_ok" && (
                <div style={{marginTop:14}}>
                  <div className="chip ok" style={{marginBottom:10}}><CheckCircle2 size={12}/> Filtros aprobados (empleos previos, historial de crédito, PLD, psicométrico)</div>
                  <div className="trow">
                    <Video size={20} color="var(--ai)"/>
                    <div style={{flex:1,fontSize:13}}><b>Siguiente paso: video-entrevista con IA.</b> Responde 5 preguntas en videollamada para generar tu ranking ante el formador.</div>
                    <button className="btn ai" onClick={()=>setVideoV(v)}><Video size={14}/> Iniciar ahora</button>
                  </div>
                </div>
              )}
            </>)}

            {p.estado==="evaluado" && <div className="chip ai"><Sparkles size={12}/> Video-entrevista completada · nuevo ranking {p.matchIA}% · el formador está revisando su terna</div>}

            {p.estado==="slots_enviados" && (<>
              <label>El formador te invitó a entrevista ({p.modalidadEnt}). Elige uno de los 3 horarios:</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:6}}>
                {p.slots.map(s=>{
                  const tomado=slotTomado(v,s,cand.id); /* Exclusividad de horarios (Batch 3 · F4) */
                  return tomado
                    ? <button key={s} className="slotbtn" disabled style={{opacity:.55,cursor:"not-allowed"}}>{s}<div style={{fontSize:10.5,fontWeight:700,color:"var(--bad)",marginTop:2}}>No disponible</div></button>
                    : <button key={s} className="slotbtn" onClick={()=>{run(d=>ACT.confirmarSlot(d,v.id,cand.id,s)); toast("Horario confirmado · reunión de Teams generada");}}>{s}</button>;
                })}
              </div>
              {p.slots.some(s=>slotTomado(v,s,cand.id)) && <div className="help" style={{marginTop:6}}>Los horarios marcados como "No disponible" ya fueron confirmados por otro candidato de esta vacante.</div>}
            </>)}

            {p.estado==="agendado" && (
              <div className="trow">
                <CalendarCheck size={20} color="var(--ok)"/>
                <div style={{flex:1,fontSize:13}}><b>Entrevista confirmada:</b> {p.slotElegido} · {p.modalidadEnt}
                  <div><a href="#" onClick={e=>e.preventDefault()} style={{fontSize:12,color:"var(--ai)",fontWeight:600}}><Link2 size={11} style={{verticalAlign:-1}}/> Enlace a la reunión de Teams (simulado)</a></div>
                </div>
              </div>
            )}

            {p.estado==="entrevistado" && <Chip tone="gold">Entrevista realizada · el formador está tomando su decisión</Chip>}

            {["seleccionado","docs_completos"].includes(p.estado) && (<>
              <div className="card" style={{background:"var(--gold-soft)",borderColor:"#F0D9A5",marginBottom:12}}>
                <b>🎉 ¡Felicidades, {cand.nombre.split(" ")[0]}! Fuiste seleccionado(a).</b>
                <p style={{fontSize:12.5,marginTop:4}}>Siguiente paso: sube tu documentación para preparar tu contratación. <b>Solo PDF · máximo 1 MB por archivo.</b></p>
              </div>
              {contratoKeys.map(([k,l])=>(
                <UploadPDF key={k} label={l} value={p.docsContrato[k]} onDone={n=>run(d=>{d.vacantes.find(x=>x.id===v.id).pipeline[cand.id].docsContrato[k]=n;})}/>
              ))}

              {/* Cuenta bancaria para nómina (Batch 5) */}
              <div className={"check-item"+(p.cuentaBanco?" done":"")} style={{marginTop:9,alignItems:"flex-start"}}>
                {p.cuentaBanco? <CheckCircle2 size={20} color="var(--ok)"/> : <Landmark size={20} color="var(--gray)"/>}
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>Cuenta bancaria para nómina</div>
                  <div className="help">{p.cuentaBanco
                    ? `Cuenta registrada: ••••${String(p.cuentaBanco).slice(-4)}`
                    : "Abre tu cuenta de nómina (enlace o QR) y registra el número de cuenta / CLABE para recibir tu sueldo."}</div>
                  {p.estado==="seleccionado" && (
                    <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                      <button className="btn ghost sm" onClick={abrirAperturaCuenta}><ExternalLink size={13}/> Abrir apertura de cuenta</button>
                      <button className="btn ghost sm" onClick={()=>setQrDe(v.id)}><QrCode size={13}/> Ver QR</button>
                      <button className="btn gold sm" onClick={()=>setCuentaDe(v.id)}>
                        {p.cuentaBanco? <><Edit3 size={13}/> Editar número de cuenta</> : <><Landmark size={13}/> Ingresar número de cuenta</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Examen médico condicional (Batch 6) */}
              {v.req.examenMedico && (
                <div style={{marginTop:9}}>
                  {p.medico && p.medico.validado ? (
                    <div className="check-item done" style={{alignItems:"flex-start"}}>
                      <CheckCircle2 size={20} color="var(--ok)"/>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:13}}>Examen médico validado</div>
                        <div className="help">{p.medico.sucursal} · {p.medico.fecha} · resultado validado por el formador.</div>
                      </div>
                    </div>
                  ) : p.medico ? (
                    <div className="check-item" style={{alignItems:"flex-start",borderStyle:"solid",background:"var(--gold-soft)",borderColor:"#F0D9A5"}}>
                      <Clock size={20} color="var(--warn)"/>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:13,color:"var(--warn)"}}>Examen médico agendado — en espera de validación</div>
                        <div className="help">{p.medico.sucursal} · {p.medico.fecha}. Preséntate a tu cita; el formador validará el resultado del examen.</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{border:"1px dashed var(--line)",borderRadius:11,padding:"12px 14px"}}>
                      <div style={{fontWeight:600,fontSize:13}}>Examen médico</div>
                      {p.estado==="seleccionado"
                        ? <MedicoAgendar onAgendar={(datos)=>{ run(d=>ACT.agendarMedico(d,v.id,cand.id,datos)); toast("Examen médico agendado"); }}/>
                        : <div className="help" style={{marginTop:4}}>Pendiente de agendar.</div>}
                    </div>
                  )}
                </div>
              )}

              {contratoOk && p.estado==="seleccionado" && (
                <button className="btn gold" style={{marginTop:12}} onClick={()=>{run(d=>ACT.docsContratoListos(d,v.id,cand.id)); toast("Documentación enviada · el formador fue notificado");}}>
                  <CheckCircle2 size={15}/> Enviar documentación completa
                </button>
              )}
              {!contratoOk && p.estado==="seleccionado" && <div className="help" style={{marginTop:8}}>Completa todos los documentos, registra tu cuenta bancaria{v.req.examenMedico?" y aprueba tu examen médico":""} para poder enviar tu documentación.</div>}
              {p.estado==="docs_completos" && <div className="chip ok" style={{marginTop:10}}><CheckCircle2 size={12}/> Documentación validada · espera tu carta oferta</div>}
            </>)}

            {p.estado==="oferta_enviada" && (
              <div className="card" style={{borderColor:"var(--gold)"}}>
                <h3 style={{fontSize:15,marginBottom:8}}><FileSignature size={16} style={{verticalAlign:-3}}/> Tu carta oferta</h3>
                <div className="grid3" style={{marginBottom:12}}>
                  <div><label>Puesto</label><b style={{fontSize:13.5}}>{v.req.titulo}</b></div>
                  <div><label>Sueldo mensual bruto</label><b style={{fontSize:16,color:"var(--gold-dark)"}}>{money(p.oferta.monto)}</b></div>
                  <div><label>Firma e ingreso</label><b style={{fontSize:13.5}}>{p.oferta.fecha}</b></div>
                </div>
                <div style={{marginBottom:12}}>
                  <label>Ubicación donde debes presentarte</label>
                  <div style={{fontSize:13.5}}>{p.oferta.ubicacion||DIRECCION_CORP}</div>
                  <a className="btn ghost sm" style={{marginTop:6}} href={mapsUrl(p.oferta.ubicacion)} target="_blank" rel="noreferrer"><MapPin size={13}/> Ver en Google Maps</a>
                </div>
                <p className="help" style={{marginBottom:12}}>Incluye prestaciones de ley y beneficios del grupo (kit informativo adjunto · simulado).</p>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn gold" onClick={()=>setConfirmOferta(v)}><CheckCircle2 size={15}/> Aceptar oferta y fecha de ingreso</button>
                  <button className="btn ghost"><Download size={14}/> Descargar carta (demo)</button>
                </div>
              </div>
            )}

            {p.estado==="contratado" && (
              <div className="celebrate">
                <PartyPopper size={38} color="var(--gold)" style={{marginBottom:10}}/>
                <h2 style={{fontSize:21}}>¡Bienvenido(a) al equipo, {cand.nombre.split(" ")[0]}!</h2>
                <p style={{color:"#C9C9C9",margin:"6px 0 16px"}}>{v.req.titulo} · Ingreso: {p.oferta.fecha}</p>
                <div style={{display:"inline-block",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,184,28,0.4)",borderRadius:12,padding:"12px 26px",marginBottom:16}}>
                  <div style={{fontSize:12,color:"#C9C9C9"}}>Tu número de empleado</div>
                  <div style={{fontSize:24,fontWeight:800,letterSpacing:"0.18em",color:"var(--gold)"}}>{p.numEmpleado}</div>
                  <div style={{fontSize:12,color:"#C9C9C9",marginTop:10}}>Preséntate en</div>
                  <div style={{fontSize:13,color:"#fff",fontWeight:600,marginTop:2,maxWidth:300}}>{p.oferta.ubicacion||DIRECCION_CORP}</div>
                  <div style={{fontSize:12,color:"#C9C9C9",marginTop:10}}>Tu formador de equipo</div>
                  <div style={{fontSize:13,color:"#fff",fontWeight:600,marginTop:2}}>{formador.nombre}</div>
                  <div style={{fontSize:12,color:"var(--gold)",marginTop:2}}>{correoFormador(formador)} · {telFormador(formador)}</div>
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                  <a className="btn gold sm" href={mapsUrl(p.oferta.ubicacion)} target="_blank" rel="noreferrer"><MapPin size={13}/> Ver en Google Maps</a>
                  <button className="btn gold sm"><Download size={13}/> Kit de inducción</button>
                  <button className="btn gold sm"><Download size={13}/> Guía de tu primer día</button>
                </div>
              </div>
            )}

            {["descartado","filtrado"].includes(p.estado) && (
              <div style={{marginTop:12}}>
                <div style={{background:"var(--bad-soft)",border:"1px solid #F0C4C1",borderRadius:10,padding:"10px 14px",fontSize:13.5,fontWeight:600,color:"var(--bad)",marginBottom:10}}>La vacante concluyó, gracias por aplicar.</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button className="btn ghost sm" onClick={()=>setFeedbackDe(v)}><MessageSquare size={13}/> Ver mi feedback</button>
                  <button className="btn gold sm" onClick={onBuscar}><Search size={13}/> Ver más vacantes</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {feedbackDe && (
        <Modal onClose={()=>setFeedbackDe(null)}>
          <h3 style={{marginBottom:4}}>Feedback de tu proceso</h3>
          <p className="help" style={{marginBottom:14}}>{feedbackDe.req.titulo}</p>
          {feedbackDe.pipeline[cand.id]?.entrevista?.feedback
            ? <div className="trow"><MessageSquare size={18} color="var(--gold-dark)"/><div style={{flex:1,fontSize:13.5,lineHeight:1.6}}>"{feedbackDe.pipeline[cand.id].entrevista.feedback}"</div></div>
            : <p style={{fontSize:13.5,lineHeight:1.6}}>Gracias por participar en este proceso. En esta ocasión no fue posible continuar, pero tu perfil seguirá siendo considerado por la IA para futuras vacantes compatibles con tu experiencia.</p>}
          <button className="btn ghost" style={{marginTop:14}} onClick={()=>setFeedbackDe(null)}>Cerrar</button>
        </Modal>
      )}
      {videoV && <VideoIAModal cand={cand} v={videoV} onClose={()=>setVideoV(null)}
        onDone={()=>{run(d=>ACT.videoIA(d,videoV.id,cand.id)); setVideoV(null); toast("Video-entrevista enviada · tu ranking fue actualizado");}}/>}
      {confirmOferta && (
        <Modal onClose={()=>setConfirmOferta(null)}>
          <h3 style={{marginBottom:8}}>Aceptar oferta y fecha de contratación</h3>
          <p style={{fontSize:13.5,lineHeight:1.6}}>Al confirmar, aceptas la carta oferta de "{confirmOferta.req.titulo}", generando tu contrato para firmar el mismo día de tu fecha de ingreso. El formador recibirá tu confirmación con la fecha de ingreso.</p>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button className="btn gold" onClick={()=>{run(d=>ACT.aceptarOferta(d,confirmOferta.id,cand.id)); setConfirmOferta(null); toast("¡Oferta y fecha de ingreso aceptadas!");}}><FileSignature size={15}/> Acepto mi oferta y fecha de ingreso</button>
            <button className="btn ghost" onClick={()=>setConfirmOferta(null)}>Todavía no</button>
          </div>
        </Modal>
      )}
      {qrDe && (
        <Modal onClose={()=>setQrDe(null)}>
          <h3 style={{marginBottom:6}}>Apertura de cuenta por QR</h3>
          <p className="help" style={{marginBottom:16}}>Escanea este código con la app del banco para iniciar la apertura de tu cuenta de nómina (simulado).</p>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><QRDemo/></div>
          <button className="btn ghost" onClick={()=>setQrDe(null)}>Cerrar</button>
        </Modal>
      )}
      {cuentaDe && (
        <CuentaBancoModal
          actual={db.vacantes.find(v=>v.id===cuentaDe)?.pipeline[cand.id]?.cuentaBanco||""}
          onClose={()=>setCuentaDe(null)}
          onSave={(num)=>{ run(d=>{ d.vacantes.find(v=>v.id===cuentaDe).pipeline[cand.id].cuentaBanco=num; }); setCuentaDe(null); toast("Número de cuenta registrado"); }}/>
      )}
    </div>
  );
}

/* Captura del número de cuenta / CLABE para nómina (Batch 5) */
function CuentaBancoModal({actual, onSave, onClose}){
  const [num,setNum]=useState(actual||"");
  const limpio=num.replace(/\D/g,"");
  const valido=limpio.length>=10 && limpio.length<=18;
  return (
    <Modal onClose={onClose}>
      <h3 style={{marginBottom:6}}>Número de cuenta para nómina</h3>
      <p className="help" style={{marginBottom:14}}>Captura el número de cuenta o CLABE interbancaria (10 a 18 dígitos) donde recibirás tu sueldo. Podrás modificarlo después si lo necesitas.</p>
      <div className="field">
        <label>Número de cuenta / CLABE</label>
        <input value={num} onChange={e=>setNum(e.target.value)} placeholder="Ej. 012180001234567895" inputMode="numeric"/>
        {num && !valido && <div style={{fontSize:12,color:"var(--bad)",marginTop:4}}><AlertCircle size={12} style={{verticalAlign:-2}}/> Debe tener entre 10 y 18 dígitos.</div>}
      </div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button className="btn gold" disabled={!valido} onClick={()=>onSave(limpio)}><CheckCircle2 size={15}/> Guardar cuenta</button>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

/* Preguntas filtro (killer questions) — compartido por PostulacionForm y AplicarModal */
function KillerPreguntas({v, resp, setResp}){
  if(!v.req.killer.length) return null;
  return (<>
    <label>Preguntas filtro de la vacante</label>
    {v.req.killer.map((k,i)=>(
      <div key={i} className="trow">
        <div style={{flex:1,fontSize:13}}>{k.q}</div>
        <div className="tagpick">
          <button className={"tag"+(resp[i]===true?" on":"")} onClick={()=>setResp(r=>({...r,[i]:true}))}>Sí</button>
          <button className={"tag"+(resp[i]===false?" on":"")} onClick={()=>setResp(r=>({...r,[i]:false}))}>No</button>
        </div>
      </div>
    ))}
  </>);
}

function PostulacionForm({v, onAplicar}){
  const [resp,setResp]=useState({});
  const todas=v.req.killer.every((_,i)=>resp[i]!=null);
  const ok=v.req.killer.every((_,i)=>resp[i]===true);
  return (
    <div>
      <KillerPreguntas v={v} resp={resp} setResp={setResp}/>
      <button className="btn gold" style={{marginTop:12}} disabled={v.req.killer.length>0&&!todas} onClick={()=>onAplicar(ok||v.req.killer.length===0)}>
        <Send size={15}/> Postularme a esta vacante
      </button>
      {v.req.killer.length>0 && <div className="help" style={{marginTop:6}}>Si alguna respuesta no cumple los requisitos indispensables, el sistema cerrará tu postulación automáticamente y te lo notificará.</div>}
    </div>
  );
}

/* ===== Buscar Vacantes (Batch 3): tarjetas, filtros, favoritos y aplicación directa ===== */
function DetalleVacanteModal({v, cand, p, onAplicar, onClose}){
  const r=v.req;
  const Row=({l,c})=><div style={{marginBottom:10}}><label>{l}</label><div style={{fontSize:13.5}}>{c}</div></div>;
  /* Resalta en verde lo que el candidato ya tiene y coincide con el requisito de la vacante */
  const has=(arr,e)=> (arr||[]).includes(e);
  const MC=({e,hit,base})=><span className={"chip "+(hit?"ok":base||"")}>{hit && <CheckCircle2 size={11}/>}{e}</span>;
  return (
    <Modal onClose={onClose} wide>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,flexWrap:"wrap"}}>
        <MatchRing v={matchScore(cand,r)} size={56}/>
        <div style={{flex:1,minWidth:220}}>
          <h3>{r.titulo}</h3>
          <div className="tagpick" style={{marginTop:6}}>
            <Chip>{r.area}</Chip>
            <Chip icon={MapPin}>{r.ubicacionTrabajo} · {r.modalidad}</Chip>
            <Chip>{r.nivelPuesto}</Chip>
          </div>
        </div>
      </div>
      <div className="chip ok" style={{marginBottom:12}}><CheckCircle2 size={12}/> En verde: lo que coincide con tu perfil</div>
      <div className="grid2">
        <div>
          <Row l="Descripción" c={r.descripcion}/>
          <Row l="Especialidades requeridas" c={<div className="tagpick">{r.espRequeridas.map(e=><MC key={e} e={e} hit={has(cand.esp,e)} base="gold"/>)}</div>}/>
          {r.espOpcionales.length>0 && <Row l="Especialidades opcionales" c={<div className="tagpick">{r.espOpcionales.map(e=><MC key={e} e={e} hit={has(cand.esp,e)}/>)}</div>}/>}
          <Row l="Habilidades técnicas" c={<div className="tagpick">{r.hardSkills.map(e=><MC key={e} e={e} hit={has(cand.hard,e)}/>)}</div>}/>
          <Row l="Habilidades blandas" c={<div className="tagpick">{r.softSkills.map(e=><MC key={e} e={e} hit={has(cand.soft,e)}/>)}</div>}/>
          {r.aptitudes.length>0 && <Row l="Aptitudes a evaluar" c={<div className="tagpick">{r.aptitudes.map(e=><span key={e} className="chip">{e}</span>)}</div>}/>}
        </div>
        <div>
          <div className="grid2">
            <Row l="Área" c={r.area}/><Row l="Nivel" c={r.nivelPuesto}/>
            <Row l="Experiencia mínima" c={r.expNoRelevante? "No relevante" : r.anosExp+" años"}/><Row l="Estudios" c={r.educacion+(r.puedeSerSuperior?" o superior":"")}/>
            <Row l="Ubicación del trabajo" c={r.ubicacionTrabajo}/><Row l="Modalidad" c={r.modalidad}/>
            <Row l="Horario" c={r.horario}/><Row l="Días" c={r.dias.join(", ")}/>
            <Row l="Rango salarial" c={money(r.salarioMin)+" – "+money(r.salarioMax)}/><Row l="Posiciones" c={r.numVacantes}/>
            {r.sede && <Row l="Sede" c={`${r.tipoSede} · ${r.sede}`}/>}
            {r.unidadNegocio && <Row l="Unidad de Negocio" c={r.unidadNegocio}/>}
          </div>
          {r.examenMedico && <Row l="Examen médico" c={<Chip tone="gold" icon={ShieldCheck}>Requerido al ser seleccionado(a)</Chip>}/>}
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:16,alignItems:"center"}}>
        {p
          ? <EstadoChip estado={p.estado} candView/>
          : <button className="btn gold" onClick={onAplicar}><Send size={15}/> Aplicar a la vacante</button>}
        <button className="btn ghost" onClick={onClose}>Cerrar</button>
      </div>
    </Modal>
  );
}

function AplicarModal({cand, v, onSend, onClose}){
  const def=`Hola, soy ${cand.nombre.split(" ")[0]} y me interesa mucho la vacante "${v.req.titulo}" (${v.req.modalidad}, ${v.req.ubicacionTrabajo}). Considero que mi perfil es compatible y me encantaría participar en el proceso. ¡Saludos!`;
  const [tipo,setTipo]=useState("default");
  const [msg,setMsg]=useState(def);
  const [resp,setResp]=useState({});
  const todas=v.req.killer.every((_,i)=>resp[i]!=null);
  const ok=v.req.killer.every((_,i)=>resp[i]===true);
  return (
    <Modal onClose={onClose}>
      <h3 style={{marginBottom:4}}>Aplicar a la vacante</h3>
      <p className="help" style={{marginBottom:14}}>El formador de "{v.req.titulo}" recibirá tu postulación con tu mensaje (y por correo/WhatsApp en la versión final).</p>
      <div className="tagpick" style={{marginBottom:12}}>
        <button className={"tag"+(tipo==="default"?" on":"")} onClick={()=>{setTipo("default");setMsg(def);}}>Mensaje predefinido</button>
        <button className={"tag"+(tipo==="custom"?" on":"")} onClick={()=>setTipo("custom")}>Personalizar mensaje</button>
      </div>
      <textarea rows={4} value={msg} onChange={e=>{setMsg(e.target.value);setTipo("custom");}}/>
      {v.req.killer.length>0 && (
        <div style={{marginTop:12}}>
          <KillerPreguntas v={v} resp={resp} setResp={setResp}/>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginTop:14}}>
        <button className="btn gold" disabled={v.req.killer.length>0&&!todas} onClick={()=>onSend(msg, ok||v.req.killer.length===0)}><Send size={15}/> Enviar postulación</button>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
      </div>
      {v.req.killer.length>0 && <div className="help" style={{marginTop:8}}>Si alguna respuesta no cumple los requisitos indispensables, el sistema cerrará tu postulación automáticamente y te lo notificará.</div>}
    </Modal>
  );
}

function BuscarVacantes({db, cand, run, toast}){
  const [fCiudad,setFCiudad]=useState("todas");
  const [fNivel,setFNivel]=useState("todos");
  const [fArea,setFArea]=useState("todas");
  const [fSueldo,setFSueldo]=useState("todos");
  const [orden,setOrden]=useState("match");
  const [asc,setAsc]=useState(false);
  const [soloFav,setSoloFav]=useState(false);
  const [detalle,setDetalle]=useState(null);
  const [aplicarA,setAplicarA]=useState(null);
  const favoritos=cand.favoritos||[];
  const SUELDOS={ todos:[0,Infinity], s1:[0,15000], s2:[15000,25000], s3:[25000,Infinity] };
  /* Las vacantes Confidenciales no aparecen en la búsqueda por cuenta propia del candidato (Batch 6) */
  const lista=db.vacantes.filter(v=>v.estado==="abierta" && v.req.tipoVacante!=="Confidencial")
    .filter(v=>fCiudad==="todas"||v.req.ubicacionTrabajo===fCiudad)
    .filter(v=>fNivel==="todos"||v.req.nivelPuesto===fNivel)
    .filter(v=>fArea==="todas"||v.req.area===fArea)
    .filter(v=>{ const [a,b]=SUELDOS[fSueldo]; return v.req.salarioMax>=a && v.req.salarioMin<=b; })
    .filter(v=>!soloFav||favoritos.includes(v.id))
    .map(v=>({v, match:matchScore(cand,v.req)}))
    .sort((x,y)=>{
      const d= orden==="titulo"? x.v.req.titulo.localeCompare(y.v.req.titulo,"es")
        : orden==="fecha"? fechaVal(x.v.creada)-fechaVal(y.v.creada)
        : orden==="sueldo"? x.v.req.salarioMax-y.v.req.salarioMax
        : x.match-y.match;
      return asc? d : -d;
    });
  const toggleFav=(vid)=> run(d=>{
    const c=d.candidatos.find(x=>x.id===cand.id);
    c.favoritos=(c.favoritos||[]).includes(vid)? c.favoritos.filter(f=>f!==vid) : [...(c.favoritos||[]), vid];
  });
  const vDet=detalle && db.vacantes.find(v=>v.id===detalle);
  const vApl=aplicarA && db.vacantes.find(v=>v.id===aplicarA);
  return (
    <div>
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div className="field" style={{marginBottom:0,minWidth:130}}><label>Ubicación</label>
            <select value={fCiudad} onChange={e=>setFCiudad(e.target.value)}><option value="todas">Todas</option>{CIUDADES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="field" style={{marginBottom:0,minWidth:140}}><label>Nivel de puesto</label>
            <select value={fNivel} onChange={e=>setFNivel(e.target.value)}><option value="todos">Todos</option>{NIVELES.map(n=><option key={n}>{n}</option>)}</select></div>
          <div className="field" style={{marginBottom:0,minWidth:150}}><label>Área</label>
            <select value={fArea} onChange={e=>setFArea(e.target.value)}><option value="todas">Todas</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select></div>
          <div className="field" style={{marginBottom:0,minWidth:160}}><label>Rango de sueldo</label>
            <select value={fSueldo} onChange={e=>setFSueldo(e.target.value)}>
              <option value="todos">Todos</option><option value="s1">Hasta $15,000</option><option value="s2">$15,000 – $25,000</option><option value="s3">Más de $25,000</option>
            </select></div>
          <div className="field" style={{marginBottom:0,minWidth:170}}><label>Ordenar por</label>
            <select value={orden} onChange={e=>{setOrden(e.target.value); setAsc(e.target.value==="titulo");}}>
              <option value="match">Compatibilidad</option><option value="fecha">Tiempo de publicación</option><option value="titulo">Título (A–Z)</option><option value="sueldo">Sueldo</option>
            </select></div>
          <button className="btn ghost sm" onClick={()=>setAsc(a=>!a)} title="Cambiar dirección del ordenamiento">{asc?"↑ Ascendente":"↓ Descendente"}</button>
          <button className={"tag"+(soloFav?" on":"")} style={{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:6}} onClick={()=>setSoloFav(f=>!f)}>
            <Heart size={12} fill={soloFav?"currentColor":"none"}/> Mis vacantes guardadas ({favoritos.length})
          </button>
        </div>
      </div>
      {!lista.length ? (
        <div className="card" style={{textAlign:"center",color:"var(--gray)",padding:36}}>
          {soloFav? "Aún no tienes vacantes guardadas. Usa el corazón de cada tarjeta para guardarlas."
            : "No hay vacantes abiertas que coincidan con tus filtros. Ajusta los filtros o vuelve a intentarlo más tarde."}
        </div>
      ) : (
        <div className="vac-grid">
          {lista.map(({v,match})=>{
            const p=v.pipeline[cand.id];
            const fav=favoritos.includes(v.id);
            return (
              <div className="card" key={v.id} style={{display:"flex",flexDirection:"column",gap:10,margin:0}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <b style={{fontSize:14.5}}>{v.req.titulo}</b>
                    <div className="tagpick" style={{marginTop:6}}>
                      <Chip>{v.req.area}</Chip>
                      <Chip icon={MapPin}>{v.req.ubicacionTrabajo} · {v.req.modalidad}</Chip>
                      <Chip>{v.req.nivelPuesto}</Chip>
                    </div>
                  </div>
                  <MatchRing v={match}/>
                </div>
                <div style={{fontSize:12.5,color:"var(--ink2)",lineHeight:1.5}}>{v.req.descripcion.length>110? v.req.descripcion.slice(0,110).trimEnd()+"…" : v.req.descripcion}</div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--gold-dark)"}}>{money(v.req.salarioMin)} – {money(v.req.salarioMax)}</div>
                <div className="help" style={{marginTop:-4,display:"flex",alignItems:"center",gap:4}}><Calendar size={11}/> Publicada el {v.creada}</div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginTop:"auto",flexWrap:"wrap"}}>
                  <button className="btn dark sm" onClick={()=>setDetalle(v.id)}><FileText size={13}/> Ver detalles</button>
                  {p && <EstadoChip estado={p.estado} candView/>}
                  <button className={"heart"+(fav?" on":"")} style={{marginLeft:"auto"}} title={fav?"Quitar de mis vacantes guardadas":"Guardar vacante"} onClick={()=>toggleFav(v.id)}>
                    <Heart size={15} fill={fav?"currentColor":"none"}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {vDet && <DetalleVacanteModal v={vDet} cand={cand} p={vDet.pipeline[cand.id]}
        onAplicar={()=>{ setAplicarA(vDet.id); setDetalle(null); }}
        onClose={()=>setDetalle(null)}/>}
      {vApl && <AplicarModal cand={cand} v={vApl}
        onSend={(msg,ok)=>{ run(d=>ACT.postularDirecto(d,vApl.id,cand.id,ok,msg)); setAplicarA(null); toast(ok?"¡Postulación enviada!":"Gracias, registramos tus respuestas"); }}
        onClose={()=>setAplicarA(null)}/>}
    </div>
  );
}

/* ============================== PANEL DE ADMIN ============================== */
function CandidatoForm({inicial, onSave, onClose}){
  const [c,setC]=useState(inicial||{id:null,nombre:"",tipo:"externo",area:AREAS[0],puesto:"",nivel:"Junior",exp:1,edu:"Licenciatura titulado",ciudad:"CDMX",modalidad:"Presencial",salario:15000,esp:[],hard:[],soft:[],resumen:"",email:"",tel:""});
  const set=(k,v)=>setC(x=>({...x,[k]:v}));
  const valido=c.nombre.trim()&&c.puesto.trim()&&c.esp.length;
  return (
    <Modal onClose={onClose} wide>
      <h3 style={{marginBottom:14}}>{inicial?"Editar perfil de candidato":"Subir nuevo candidato al marketplace"}</h3>
      <div className="grid3">
        <div className="field"><label>Nombre completo *</label><input value={c.nombre} onChange={e=>set("nombre",e.target.value)}/></div>
        <div className="field"><label>Puesto actual *</label><input value={c.puesto} onChange={e=>set("puesto",e.target.value)}/></div>
        <div className="field"><label>Tipo</label><select value={c.tipo} onChange={e=>set("tipo",e.target.value)}><option value="externo">Externo</option><option value="interno">Interno</option></select></div>
        <div className="field"><label>Área</label><select value={c.area} onChange={e=>set("area",e.target.value)}>{AREAS.map(a=><option key={a}>{a}</option>)}</select></div>
        <div className="field"><label>Nivel</label><select value={c.nivel} onChange={e=>set("nivel",e.target.value)}>{NIVELES.map(a=><option key={a}>{a}</option>)}</select></div>
        <div className="field"><label>Años de experiencia</label><input type="number" value={c.exp} onChange={e=>set("exp",+e.target.value)}/></div>
        <div className="field"><label>Estudios</label><select value={c.edu} onChange={e=>set("edu",e.target.value)}>{EDUCACION.map(a=><option key={a}>{a}</option>)}</select></div>
        <div className="field"><label>Ciudad</label><select value={c.ciudad} onChange={e=>set("ciudad",e.target.value)}>{CIUDADES.map(a=><option key={a}>{a}</option>)}</select></div>
        <div className="field"><label>Expectativa salarial</label><input type="number" value={c.salario} onChange={e=>set("salario",+e.target.value)}/></div>
      </div>
      <div className="field"><label>Especialidades *</label><TagPicker options={ESPECIALIDADES} value={c.esp} onChange={v=>set("esp",v)} addNew/></div>
      <div className="field"><label>Habilidades técnicas</label><TagPicker options={HARD_SKILLS} value={c.hard} onChange={v=>set("hard",v)} addNew/></div>
      <div className="field"><label>Habilidades blandas</label><TagPicker options={SOFT_SKILLS} value={c.soft} onChange={v=>set("soft",v)}/></div>
      <div className="field"><label>Resumen profesional</label><textarea rows={2} value={c.resumen} onChange={e=>set("resumen",e.target.value)}/></div>
      <div className="field"><UploadPDF label="CV del candidato (opcional)" value={c.cv} onDone={n=>set("cv",n)}/></div>
      <button className="btn gold" disabled={!valido} onClick={()=>onSave(c)}><CheckCircle2 size={15}/> Guardar candidato</button>
    </Modal>
  );
}

function AdminPanel({db, run, toast, vista, setVista}){
  const [editV,setEditV]=useState(null);
  const [editC,setEditC]=useState(undefined);
  const [formadorSel,setFormadorSel]=useState(FORMADORES[0].id);
  const [q,setQ]=useState("");
  /* Popup de nota al reenviar (Batch 6 · A8): {req, rech} pendientes de confirmar */
  const [confirmSave,setConfirmSave]=useState(null);
  const [nota,setNota]=useState("");
  if(vista==="nueva") return (
    <div className="card">
      <h3 style={{marginBottom:4}}>Nueva vacante · formulario estandarizado</h3>
      <p className="help" style={{marginBottom:14}}>Llena los requerimientos y asígnala a un formador. Él podrá revisar, solicitar cambios y aprobar antes de iniciar la búsqueda.</p>
      <div className="field" style={{maxWidth:340}}>
        <label>Asignar al formador</label>
        <select value={formadorSel} onChange={e=>setFormadorSel(e.target.value)}>{db.formadores.map(f=><option key={f.id} value={f.id}>{f.nombre} · {f.puesto}</option>)}</select>
      </div>
      <VacanteForm saveLabel="Crear y asignar al formador" onSave={(req)=>{run(d=>ACT.crearVacante(d,req,formadorSel)); setVista("vacantes"); toast("Vacante creada y asignada · el formador fue notificado");}}/>
    </div>
  );
  if(vista==="candidatos") return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
        <div style={{position:"relative",flex:1,maxWidth:340}}>
          <Search size={14} style={{position:"absolute",left:11,top:12,color:"var(--gray)"}}/>
          <input placeholder="Buscar por nombre, área o skill…" value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:32}}/>
        </div>
        <button className="btn gold" onClick={()=>setEditC(null)}><Plus size={15}/> Subir candidato</button>
      </div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <table className="table">
          <thead><tr><th>CANDIDATO</th><th>ÁREA / NIVEL</th><th>ESPECIALIDADES</th><th>CIUDAD</th><th>TIPO</th><th></th></tr></thead>
          <tbody>
            {db.candidatos.filter(c=>(c.nombre+c.area+c.esp.join()+c.hard.join()).toLowerCase().includes(q.toLowerCase())).map(c=>(
              <tr key={c.id}>
                <td><b>{c.nombre}</b><div className="help">{c.puesto}</div></td>
                <td>{c.area}<div className="help">{c.nivel} · {c.exp} años</div></td>
                <td>{c.esp.slice(0,2).join(", ")}</td>
                <td>{c.ciudad}</td>
                <td><Chip tone={c.tipo==="interno"?"gold":""}>{c.tipo}</Chip></td>
                <td style={{textAlign:"right"}}>
                  <button className="btn ghost sm" onClick={()=>setEditC(c)}><Edit3 size={12}/> Editar</button>{" "}
                  <button className="btn ghost sm" onClick={()=>descargarCV(c)}><Download size={12}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editC!==undefined && <CandidatoForm inicial={editC} onClose={()=>setEditC(undefined)}
        onSave={(c)=>{run(d=>ACT.guardarCandidato(d,c)); setEditC(undefined); toast("Perfil guardado en el marketplace");}}/>}
    </div>
  );
  if(vista==="notif") return <NotifList db={db} para={{tipo:"admin",id:"A1"}} run={run}/>;
  /* vista === vacantes */
  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="btn gold" onClick={()=>setVista("nueva")}><Plus size={15}/> Nueva vacante</button>
      </div>
      {db.vacantes.map(v=>(
        <div className={"card"+(v.estado==="cerrada"?" ok":"")} key={v.id} style={{marginBottom:12}}>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <b>{v.req.titulo}</b><Chip>{v.id}</Chip>
            {v.req.tipoVacante==="Confidencial"&&<Chip tone="gold" icon={ShieldCheck}>Confidencial</Chip>}
            <Chip icon={User}>Formador: {db.formadores.find(f=>f.id===v.formadorId)?.nombre||"—"}</Chip>
            {v.estado==="asignada"&&<Chip tone="gold">En revisión del formador</Chip>}
            {v.estado==="cambios"&&<Chip tone="bad" icon={AlertCircle}>Cambios solicitados</Chip>}
            {v.estado==="abierta"&&(candidatoElegido(v)?<Chip tone="ok" icon={CheckCircle2}>Candidato elegido</Chip>:<Chip tone="ok">Búsqueda activa</Chip>)}
            {v.estado==="cerrada"&&<Chip tone="ok" icon={CheckCircle2}>Cubierta</Chip>}
            <span style={{marginLeft:"auto"}}>
              {["asignada","cambios"].includes(v.estado) && <button className="btn ghost sm" onClick={()=>setEditV(v)}><Edit3 size={12}/> Editar descriptivo</button>}
            </span>
          </div>
          {v.estado==="cambios" && <div className="card" style={{marginTop:10,background:"var(--bad-soft)",borderColor:"#F0C4C1",padding:"10px 14px",fontSize:12.5}}><b>El formador solicitó:</b><CambiosResumen cambios={v.cambios}/></div>}
          <div style={{marginTop:12}}><FasesBar v={v} compact/></div>
        </div>
      ))}
      {editV && (
        <Modal onClose={()=>setEditV(null)} wide>
          <h3 style={{marginBottom:8}}>Editar descriptivo · {editV.id}</h3>
          {editV.historial.length>0 && (
            <div style={{maxHeight:110,overflowY:"auto",border:"1px solid var(--line)",borderRadius:10,padding:"8px 12px",marginBottom:12}}>
              <label>Historial del descriptivo</label>
              {editV.historial.map((h,i)=><div key={i} className="help">• {h}</div>)}
            </div>
          )}
          <VacanteForm inicial={editV.req} cambios={editV.cambios} saveLabel="Guardar y reenviar al formador"
            onSave={(req,rech)=>setConfirmSave({req,rech})}/>
        </Modal>
      )}
      {confirmSave && (
        <Modal onClose={()=>setConfirmSave(null)}>
          <h3 style={{marginBottom:6}}>Reenviar descriptivo al formador</h3>
          <p className="help" style={{marginBottom:14}}>Si lo requieres, agrega una nota o comentario sobre los ajustes realizados o rechazados. Quedará registrada en el historial del descriptivo, visible para ti y para el formador.</p>
          <label>Nota o comentario (opcional)</label>
          <textarea rows={3} value={nota} onChange={e=>setNota(e.target.value)} placeholder="p. ej. Ajusté el rango salarial al tabulador vigente; el radio de búsqueda no puede ampliarse por política interna…"/>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button className="btn gold" onClick={()=>{ run(d=>ACT.editarVacante(d,editV.id,confirmSave.req,confirmSave.rech,nota.trim())); setConfirmSave(null); setEditV(null); setNota(""); toast("Descriptivo actualizado · el formador fue notificado"); }}><Send size={15}/> Guardar y reenviar</button>
            <button className="btn ghost" onClick={()=>setConfirmSave(null)}>Volver al formulario</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== APP ============================== */
export default function App(){
  const [db,setDb]=useState(()=>({ candidatos:SEED_CANDIDATOS, vacantes:SEED_VACANTES, formadores:FORMADORES, notifs:[
    { id:"N1", para:{tipo:"formador",id:"F1"}, titulo:"Se te liberó una nueva vacante", msg:'La vacante V-1042 · "Ejecutivo de Ventas Digitales" fue asignada a ti. Revisa el descriptivo, solicita cambios o apruébala para iniciar la búsqueda.', vacId:"V-1042", fecha:"01 jul 2026 · 09:12", leida:false },
  ]}));
  const run=(fn)=> setDb(d=>{ const nd=structuredClone(d); fn(nd); return nd; });
  const [rol,setRol]=useState("formador");
  const [formadorId,setFormadorId]=useState("F1");
  const [candId,setCandId]=useState(1);
  const [vista,setVista]=useState("inicio");
  const [vacAbierta,setVacAbierta]=useState(null);
  const [editPerfil,setEditPerfil]=useState(false);
  const [toastMsg,setToastMsg]=useState("");
  const toast=(m)=>{ setToastMsg(m); setTimeout(()=>setToastMsg(""),2600); };
  const formador=db.formadores.find(f=>f.id===formadorId);
  const candidato=db.candidatos.find(c=>c.id===candId);
  const para= rol==="formador"?{tipo:"formador",id:formadorId} : rol==="candidato"?{tipo:"candidato",id:candId} : {tipo:"admin",id:"A1"};
  const noLeidas=db.notifs.filter(n=>n.para.tipo===para.tipo&&String(n.para.id)===String(para.id)&&!n.leida).length;
  const vAb=vacAbierta && db.vacantes.find(v=>v.id===vacAbierta);
  const abrirVac=(id)=>{ setVacAbierta(id); setVista("vacante"); };
  const NavItem=({id,icon:Icon,children})=>(
    <button className={"nav-item"+((vista===id||(id==="inicio"&&vista==="vacante"&&rol==="formador"))?" on":"")}
      onClick={()=>{setVista(id); if(id!=="vacante") setVacAbierta(null);}}>
      <Icon size={16}/>{children}
    </button>
  );
  const titulos={ inicio: rol==="formador"?"Mis vacantes":rol==="admin"?"Vacantes":"Mis procesos",
    vacantes:"Vacantes", nueva:"Nueva vacante", candidatos:"Pool de talento (marketplace)", buscar:"Buscar vacantes", notif:"Centro de notificaciones", vacante: vAb? vAb.req.titulo : "" };
  useEffect(()=>{ setVista("inicio"); setVacAbierta(null); },[rol]);
  return (
    <div className="rk">
      <style>{CSS}</style>
      <aside className="side">
        <div className="logo">
          <div className="mark">R</div>
          <div><b>Reclutalia</b><span>COBERTURA DE VACANTES</span></div>
        </div>
        {rol==="formador" && (<>
          <NavItem id="inicio" icon={Home}>Mis vacantes</NavItem>
          <NavItem id="notif" icon={Bell}>Notificaciones {noLeidas>0&&<span className="chip gold" style={{marginLeft:"auto"}}>{noLeidas}</span>}</NavItem>
        </>)}
        {rol==="admin" && (<>
          <NavItem id="inicio" icon={LayoutGrid}>Vacantes</NavItem>
          <NavItem id="nueva" icon={Plus}>Nueva vacante</NavItem>
          <NavItem id="candidatos" icon={Users}>Pool de talento</NavItem>
          <NavItem id="notif" icon={Bell}>Notificaciones {noLeidas>0&&<span className="chip gold" style={{marginLeft:"auto"}}>{noLeidas}</span>}</NavItem>
        </>)}
        {rol==="candidato" && (<>
          <NavItem id="inicio" icon={Briefcase}>Mis procesos</NavItem>
          <NavItem id="buscar" icon={Search}>Buscar vacantes</NavItem>
          <NavItem id="notif" icon={Bell}>Notificaciones {noLeidas>0&&<span className="chip gold" style={{marginLeft:"auto"}}>{noLeidas}</span>}</NavItem>
        </>)}
        <div className="rolebox">
          <p>VISTA DEMO — CAMBIAR ROL</p>
          <select value={rol} onChange={e=>setRol(e.target.value)}>
            <option value="formador">Formador de equipo</option>
            <option value="admin">Administrador</option>
            <option value="candidato">Candidato</option>
          </select>
          {rol==="formador" && (
            <select style={{marginTop:8}} value={formadorId} onChange={e=>setFormadorId(e.target.value)}>
              {db.formadores.map(f=><option key={f.id} value={f.id}>{f.nombre}</option>)}
            </select>
          )}
          {rol==="candidato" && (
            <select style={{marginTop:8}} value={candId} onChange={e=>setCandId(+e.target.value)}>
              {db.candidatos.map(c=><option key={c.id} value={c.id}>{c.nombre}{Object.values(db.vacantes).some(v=>v.pipeline[c.id])?" · en proceso":""}</option>)}
            </select>
          )}
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div style={{flex:1}}>
            {vista==="vacante" && <div className="crumb" style={{cursor:"pointer"}} onClick={()=>setVista("inicio")}>← Volver a mis vacantes</div>}
            <h2>{titulos[vista]||""}</h2>
          </div>
          <button className="iconbtn" onClick={()=>setVista("notif")} title="Notificaciones">
            <Bell size={17}/>{noLeidas>0&&<span className="dot">{noLeidas}</span>}
          </button>
          <div onClick={rol==="candidato"?()=>setEditPerfil(true):undefined}
               title={rol==="candidato"?"Editar perfil":undefined}
               style={{display:"flex",alignItems:"center",gap:10,cursor:rol==="candidato"?"pointer":"default"}}>
            <Avatar nombre={rol==="formador"?formador.nombre:rol==="candidato"?candidato.nombre:ADMIN.nombre} foto={rol==="candidato"?candidato.foto:undefined}/>
            <div>
              <div style={{fontSize:13,fontWeight:700}}>{rol==="formador"?formador.nombre:rol==="candidato"?candidato.nombre:ADMIN.nombre}</div>
              <div style={{fontSize:11,color:"var(--gray)"}}>{rol==="formador"?formador.puesto:rol==="candidato"?"Candidato":ADMIN.puesto}</div>
            </div>
          </div>
          {rol==="candidato" && <button className="btn ghost sm" onClick={()=>setEditPerfil(true)}><Edit3 size={13}/> Editar perfil</button>}
        </header>
        <div className="content">
          {rol==="formador" && vista==="inicio" && <FormadorHome db={db} formador={formador} run={run} onOpen={abrirVac}/>}
          {rol==="formador" && vista==="vacante" && vAb && <VacanteDetail db={db} v={vAb} run={run} toast={toast}/>}
          {rol==="admin" && vista!=="notif" && <AdminPanel db={db} run={run} toast={toast} vista={vista==="inicio"?"vacantes":vista} setVista={setVista}/>}
          {rol==="admin" && vista==="notif" && <NotifList db={db} para={para} run={run}/>}
          {rol==="candidato" && vista==="inicio" && <CandidatoHome db={db} cand={candidato} run={run} toast={toast} onBuscar={()=>setVista("buscar")}/>}
          {rol==="candidato" && vista==="buscar" && <BuscarVacantes db={db} cand={candidato} run={run} toast={toast}/>}
          {vista==="notif" && rol!=="admin" && <NotifList db={db} para={para} run={run} onGo={rol==="formador"?abrirVac:null}/>}
        </div>
      </div>
      {rol==="candidato" && editPerfil && (
        <PerfilEditor cand={candidato}
          onClose={()=>setEditPerfil(false)}
          onSave={(c)=>{ run(d=>ACT.guardarCandidato(d,c)); setEditPerfil(false); toast("Perfil actualizado"); }}/>
      )}
      <BotSoporte/>
      {toastMsg && <div className="toast"><CheckCircle2 size={15} color="var(--gold)"/>{toastMsg}</div>}
    </div>
  );
}

