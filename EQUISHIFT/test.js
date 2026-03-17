// ============================================================
//  EquiShift Málaga 2026 — Motor v2
//  Autor: Jose María Aparicio
//
//  RESTRICCIONES DURAS (invariantes):
//  A) Cada día: exactamente 3 trabajan, 2 descansan
//  B) Los 3 turnos (Mañana, Tarde, Noche) cubiertos cada día
//  C) Rafa = Noche fija. Cuando libra, un rotativo cubre su Noche
//  D) 40h  → 2 libres/semana  (~104 días/año)
//  E) 37,5h → variable 2-3/semana (~157 días/año)
//  F) Descansos consecutivos (Vie+Sáb+Dom si son 3)
//  G) Bloques 2 semanas Mañana / 2 semanas Tarde por trabajador
//  H) FdS libres equitativos entre los 4 rotativos
//
//  FESTIVOS:
//  - Cada trabajador "pide" los suyos (respetando cola anual)
//  - Si festivo cae en FdS → deuda anotada, compensada mes siguiente
//
//  VACACIONES:
//  - Bloques de fechas; calendario recalcula automáticamente
// ============================================================
"use strict";

const T = {
  M:"Mañana", Ta:"Tarde", N:"Noche",
  L:"Libre",  F:"Festivo", V:"Vacaciones"
};

const FESTIVOS_2026 = {
  "2026-01-01":"Año Nuevo",         "2026-01-06":"Reyes Magos",
  "2026-02-28":"Día de Andalucía",  "2026-04-02":"Jueves Santo",
  "2026-04-03":"Viernes Santo",     "2026-05-01":"Día del Trabajo",
  "2026-06-15":"Corpus Christi",    "2026-08-15":"Asunción",
  "2026-08-22":"Feria Málaga",      "2026-08-24":"Feria Málaga",
  "2026-10-12":"Fiesta Nacional",   "2026-11-02":"Todos los Santos",
  "2026-12-07":"Inmaculada (trasl.)","2026-12-08":"Inmaculada",
  "2026-12-25":"Navidad",
};
const FESTIVOS_SET = new Set(Object.keys(FESTIVOS_2026));
const DOW_ES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const trabajadores = [
  { id:1, nombre:"Jose María", contrato:37.5, festivosAnuales:13, turnoFijo:null },
  { id:2, nombre:"Salvador",   contrato:37.5, festivosAnuales:13, turnoFijo:null },
  { id:3, nombre:"Miguel",     contrato:37.5, festivosAnuales:13, turnoFijo:null },
  { id:4, nombre:"Diego",      contrato:40,   festivosAnuales:14, turnoFijo:null },
  { id:5, nombre:"Rafa",       contrato:40,   festivosAnuales:14, turnoFijo:T.N  },
];

// ─────────────────────────────────────────────────────────
//  ESTADO MUTABLE (serializable)
// ─────────────────────────────────────────────────────────

function estadoInicial() {
  return {
    vacaciones:      { 1:[], 2:[], 3:[], 4:[], 5:[] },
    festivosPedidos: { 1:[], 2:[], 3:[], 4:[], 5:[] },
    deudaFds:        { 1:0,  2:0,  3:0,  4:0,  5:0  },
    colaFestivos:    [1, 2, 3, 4, 5], // orden de elección 2026
  };
}

// ─────────────────────────────────────────────────────────
//  UTILIDADES FECHA
// ─────────────────────────────────────────────────────────

function diasDelAño() {
  const dias = [];
  for (let d = new Date("2026-01-01"); d <= new Date("2026-12-31"); d.setDate(d.getDate()+1)) {
    const iso = d.toISOString().split("T")[0];
    const dow = d.getDay();
    dias.push({
      fecha: iso,
      dow,
      esFds:     dow === 0 || dow === 6,
      esFestivo: FESTIVOS_SET.has(iso),
      nombreFestivo: FESTIVOS_2026[iso] || null,
      mes:    d.getMonth(),
      semana: isoWeek(new Date(iso)),
    });
  }
  return dias;
}

function isoWeek(d) {
  const tmp = new Date(d);
  tmp.setHours(0,0,0,0);
  tmp.setDate(tmp.getDate() + 3 - (tmp.getDay()+6)%7);
  const w1 = new Date(tmp.getFullYear(), 0, 4);
  return 1 + Math.round(((tmp - w1)/86400000 - 3 + (w1.getDay()+6)%7)/7);
}

function addDays(isoStr, n) {
  const d = new Date(isoStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

// ─────────────────────────────────────────────────────────
//  TURNO DE BLOQUE (2 sem Mañana / 2 sem Tarde)
// ─────────────────────────────────────────────────────────

// Los 4 rotativos se desplazan entre sí en 2 semanas para no coincidir
const ROTATIVO_OFFSET = { 1:0, 2:1, 3:2, 4:3 };

function turnoBloque(semana, workerId) {
  const offset = ROTATIVO_OFFSET[workerId] ?? 0;
  return ((semana - 1 + offset * 2) % 4) < 2 ? T.M : T.Ta;
}

// ─────────────────────────────────────────────────────────
//  DÍAS LIBRES CONSECUTIVOS
// ─────────────────────────────────────────────────────────

/**
 * Elige `num` días consecutivos de `diasDisp` priorizando FdS.
 * Si tieneDeuda=true, fuerza que al menos 1 FdS esté incluido.
 */
function elegirDiasLibresConsecutivos(diasDisp, num, priorizarFds, tieneDeuda) {
  if (!diasDisp || diasDisp.length === 0) return new Set();
  num = Math.min(num, diasDisp.length);
  if (num === 0) return new Set();

  // Generar todos los bloques consecutivos posibles
  const bloques = [];
  for (let i = 0; i <= diasDisp.length - num; i++) {
    const bloque = diasDisp.slice(i, i + num);
    // Verificar consecutividad
    let ok = true;
    for (let j = 1; j < bloque.length; j++) {
      if (addDays(bloque[j-1].fecha, 1) !== bloque[j].fecha) { ok = false; break; }
    }
    if (!ok) continue;
    const fdsN = bloque.filter(d => d.esFds).length;
    bloques.push({ bloque, fdsN });
  }

  if (bloques.length === 0) {
    // No hay consecutivos en los días disponibles (semana partida)
    return new Set(diasDisp.slice(0, num).map(d => d.fecha));
  }

  let candidatos = bloques;
  if (tieneDeuda) candidatos = bloques.filter(b => b.fdsN > 0) || bloques;
  if (candidatos.length === 0) candidatos = bloques;

  if (priorizarFds) {
    candidatos.sort((a,b) => b.fdsN - a.fdsN);
  } else {
    candidatos.sort((a,b) => a.fdsN - b.fdsN);
  }

  return new Set(candidatos[0].bloque.map(d => d.fecha));
}

// ─────────────────────────────────────────────────────────
//  MOTOR PRINCIPAL
// ─────────────────────────────────────────────────────────

function generarCalendario(estado) {
  const DIAS = diasDelAño();
  const resultado = new Map();

  const rotativos = trabajadores.filter(t => !t.turnoFijo); // ids 1-4
  const rafa      = trabajadores.find(t => t.turnoFijo === T.N); // id 5

  // Contadores para equidad
  const cFds   = new Map(trabajadores.map(t => [t.id, 0])); // FdS libres acumulados
  const cNoches= new Map(trabajadores.map(t => [t.id, 0])); // Noches cubiertas (rotativos)
  const cLibres= new Map(trabajadores.map(t => [t.id, 0])); // días libres totales

  // Target anual de días libres
  const targetLibres = t => t.contrato === 40 ? 104 : 157;

  // Deuda de FdS mutable local
  const deuda = { ...estado.deudaFds };

  // Helpers de estado
  const esVac  = (id, f) => (estado.vacaciones[id] || []).includes(f);
  const esFest = (id, f) => (estado.festivosPedidos[id] || []).includes(f);

  // ── Agrupar por semana ──
  const semanas = new Map();
  for (const d of DIAS) {
    if (!semanas.has(d.semana)) semanas.set(d.semana, []);
    semanas.get(d.semana).push(d);
  }

  const semanasOrdenadas = [...semanas.entries()].sort((a,b) => a[0]-b[0]);
  const totalSemanas = semanasOrdenadas.length;

  for (const [numSem, diasSem] of semanasOrdenadas) {
    // ── A. Pre-calcular libres forzados (vac/festivos) por día ──
    // forzadoLibre[fecha] = [ids que no pueden trabajar ese día]
    const forzadoLibre = new Map(diasSem.map(d => [d.fecha, []]));
    for (const dia of diasSem) {
      for (const t of trabajadores) {
        if (esVac(t.id, dia.fecha) || esFest(t.id, dia.fecha)) {
          forzadoLibre.get(dia.fecha).push(t.id);
        }
      }
    }

    // ── B. Calcular libres necesarios para Rafa esta semana ──
    const semsRestantes = Math.max(1, totalSemanas - semanasOrdenadas.findIndex(s => s[0]===numSem));
    const libresNecRafa = 2; // siempre 2 libres/semana para 40h

    // Días de Rafa disponibles para librar (no forzados por otro motivo)
    const diasRafaDisp = diasSem.filter(d => {
      const fl = forzadoLibre.get(d.fecha) || [];
      return !fl.includes(rafa.id); // si está forzado libre ya, no contar
    });

    // Libres de Rafa — priorizando FdS, deuda si la tiene
    const libresRafaSet = elegirDiasLibresConsecutivos(
      diasRafaDisp,
      libresNecRafa,
      true,
      deuda[rafa.id] > 0
    );

    // Añadir también los forzados
    for (const dia of diasSem) {
      const fl = forzadoLibre.get(dia.fecha) || [];
      if (fl.includes(rafa.id)) libresRafaSet.add(dia.fecha);
    }

    // ── C. Calcular libres de cada rotativo ──
    const libresRotSet = new Map(); // id → Set<fecha>

    for (const rot of rotativos) {
      const libresRestantes  = Math.max(0, targetLibres(rot) - (cLibres.get(rot.id)||0));
      const semRestantes2    = Math.max(1, semsRestantes);
      const libresBase       = rot.contrato === 40 ? 2 : Math.min(3, Math.max(2, Math.round(libresRestantes / semRestantes2)));

      const diasRotDisp = diasSem.filter(d => {
        const fl = forzadoLibre.get(d.fecha) || [];
        return !fl.includes(rot.id);
      });

      const libresSet = elegirDiasLibresConsecutivos(
        diasRotDisp,
        libresBase,
        true,
        deuda[rot.id] > 0
      );

      // Añadir forzados
      for (const dia of diasSem) {
        const fl = forzadoLibre.get(dia.fecha) || [];
        if (fl.includes(rot.id)) libresSet.add(dia.fecha);
      }

      libresRotSet.set(rot.id, libresSet);
    }

    // ── D. Asignar turnos día a día ──
    for (const dia of diasSem) {
      const turnos = new Map();

      // Determinar quién libra hoy
      const libraHoy = new Set();

      // Forzados (vac/festivos)
      for (const id of (forzadoLibre.get(dia.fecha)||[])) {
        libraHoy.add(id);
        const fl = forzadoLibre.get(dia.fecha) || [];
        const esV = esVac(id, dia.fecha);
        const esF = esFest(id, dia.fecha);
        turnos.set(id, esV ? T.V : T.F);
      }

      // Rafa
      if (libresRafaSet.has(dia.fecha) && !libraHoy.has(rafa.id)) {
        libraHoy.add(rafa.id);
        turnos.set(rafa.id, T.L);
      }

      // Rotativos
      for (const rot of rotativos) {
        if (libraHoy.has(rot.id)) continue;
        if (libresRotSet.get(rot.id)?.has(dia.fecha)) {
          libraHoy.add(rot.id);
          // No asignar turno aún — se asigna abajo
        }
      }

      // ── GARANTIZAR EXACTAMENTE 2 LIBRANDO ──
      // Si hay más de 2, quitar libres "normales" (no forzados, no vac/fest)
      if (libraHoy.size > 2) {
        const normales = [...libraHoy].filter(id => !turnos.has(id));
        // Ordenar: cede primero quien tiene más FdS libres
        normales.sort((a,b) => (cFds.get(b)||0) - (cFds.get(a)||0));
        while (libraHoy.size > 2 && normales.length > 0) {
          libraHoy.delete(normales.shift());
        }
      }

      // Si hay menos de 2, añadir el rotativo con más FdS acumulados
      if (libraHoy.size < 2) {
        const candidatos = rotativos
          .filter(r => !libraHoy.has(r.id) && !turnos.has(r.id))
          .sort((a,b) => (cFds.get(b.id)||0) - (cFds.get(a.id)||0));
        while (libraHoy.size < 2 && candidatos.length > 0) {
          const r = candidatos.shift();
          libraHoy.add(r.id);
        }
      }

      // ── ASIGNAR TURNOS ──

      // Libres
      for (const id of libraHoy) {
        if (!turnos.has(id)) turnos.set(id, T.L);
        if (dia.esFds) cFds.set(id, (cFds.get(id)||0) + 1);
        cLibres.set(id, (cLibres.get(id)||0) + 1);
      }

      // Noche
      if (libraHoy.has(rafa.id)) {
        // Rafa libra → rotativo disponible cubre Noche (equidad: menos noches)
        const candidatos = rotativos
          .filter(r => !libraHoy.has(r.id))
          .sort((a,b) => (cNoches.get(a.id)||0) - (cNoches.get(b.id)||0));
        if (candidatos.length > 0) {
          const cubreId = candidatos[0].id;
          turnos.set(cubreId, T.N);
          cNoches.set(cubreId, (cNoches.get(cubreId)||0) + 1);
        }
      } else {
        if (!turnos.has(rafa.id)) {
          turnos.set(rafa.id, T.N);
        }
      }

      // Mañana y Tarde para los que quedan sin turno
      const sinTurno = trabajadores.filter(t => !turnos.has(t.id));
      const tieneMañana = [...turnos.values()].includes(T.M);
      const tieneTarde  = [...turnos.values()].includes(T.Ta);

      if (sinTurno.length === 2) {
        const b0 = turnoBloque(numSem, sinTurno[0].id);
        const b1 = turnoBloque(numSem, sinTurno[1].id);
        if (b0 !== b1) {
          turnos.set(sinTurno[0].id, b0);
          turnos.set(sinTurno[1].id, b1);
        } else {
          turnos.set(sinTurno[0].id, T.M);
          turnos.set(sinTurno[1].id, T.Ta);
        }
      } else if (sinTurno.length === 1) {
        if (!tieneMañana)     turnos.set(sinTurno[0].id, T.M);
        else if (!tieneTarde) turnos.set(sinTurno[0].id, T.Ta);
        else                  turnos.set(sinTurno[0].id, turnoBloque(numSem, sinTurno[0].id));
      } else if (sinTurno.length > 2) {
        const necesitan = [];
        if (!tieneMañana) necesitan.push(T.M);
        if (!tieneTarde)  necesitan.push(T.Ta);
        for (let i = 0; i < sinTurno.length; i++) {
          turnos.set(sinTurno[i].id, necesitan[i] || turnoBloque(numSem, sinTurno[i].id));
        }
      }

      // Guardar en resultado
      resultado.set(dia.fecha, {
        turnos,
        esFds: dia.esFds,
        esFestivo: dia.esFestivo,
        nombreFestivo: dia.nombreFestivo,
        dow: dia.dow,
        semana: numSem,
        mes: dia.mes,
      });
    }

    // ── E. Actualizar deuda de FdS ──
    for (const dia of diasSem) {
      if (!dia.esFds) continue;
      for (const t of trabajadores) {
        // Acumular deuda si pidió festivo en FdS
        if (esFest(t.id, dia.fecha)) {
          deuda[t.id] = (deuda[t.id]||0) + 1;
        }
        // Reducir deuda si libró en FdS este mes
        const diaRes = resultado.get(dia.fecha);
        if (diaRes) {
          const turno = diaRes.turnos.get(t.id);
          if ((turno === T.L || turno === T.F) && deuda[t.id] > 0) {
            deuda[t.id]--;
          }
        }
      }
    }
  }

  return resultado;
}

// ─────────────────────────────────────────────────────────
//  API: VACACIONES
// ─────────────────────────────────────────────────────────

function asignarVacaciones(estado, trabajadorId, fechaInicio, fechaFin) {
  const s = JSON.parse(JSON.stringify(estado));
  const fechas = [];
  for (let d = new Date(fechaInicio); d <= new Date(fechaFin); d.setDate(d.getDate()+1)) {
    fechas.push(d.toISOString().split("T")[0]);
  }
  s.vacaciones[trabajadorId] = [...new Set([...s.vacaciones[trabajadorId], ...fechas])].sort();
  return s;
}

function eliminarVacaciones(estado, trabajadorId, fechaInicio, fechaFin) {
  const s = JSON.parse(JSON.stringify(estado));
  const fechas = new Set();
  for (let d = new Date(fechaInicio); d <= new Date(fechaFin); d.setDate(d.getDate()+1)) {
    fechas.add(d.toISOString().split("T")[0]);
  }
  s.vacaciones[trabajadorId] = s.vacaciones[trabajadorId].filter(f => !fechas.has(f));
  return s;
}

// ─────────────────────────────────────────────────────────
//  API: FESTIVOS
// ─────────────────────────────────────────────────────────

function pedirFestivo(estado, trabajadorId, fecha) {
  if (!FESTIVOS_SET.has(fecha))
    return { ok:false, estado, msg:`${fecha} no es festivo oficial.` };

  const t = trabajadores.find(w => w.id === trabajadorId);
  if ((estado.festivosPedidos[trabajadorId]||[]).length >= t.festivosAnuales)
    return { ok:false, estado, msg:`${t.nombre} ha agotado sus ${t.festivosAnuales} festivos.` };

  if ((estado.festivosPedidos[trabajadorId]||[]).includes(fecha))
    return { ok:false, estado, msg:`${t.nombre} ya tiene el festivo ${fecha}.` };

  // Verificar que no libren más de 2 ese día
  const otrosLibres = trabajadores
    .filter(w => w.id !== trabajadorId)
    .filter(w =>
      (estado.festivosPedidos[w.id]||[]).includes(fecha) ||
      (estado.vacaciones[w.id]||[]).includes(fecha)
    ).length;

  if (otrosLibres >= 2)
    return { ok:false, estado, msg:`Ya hay 2 compañeros libres el ${fecha}.` };

  const s = JSON.parse(JSON.stringify(estado));
  s.festivosPedidos[trabajadorId].push(fecha);
  s.festivosPedidos[trabajadorId].sort();

  const dow = new Date(fecha).getDay();
  if (dow === 0 || dow === 6) {
    s.deudaFds[trabajadorId] = (s.deudaFds[trabajadorId]||0) + 1;
  }

  const nombre = FESTIVOS_2026[fecha] || fecha;
  const aviso  = (dow===0||dow===6) ? " ⚠ FdS — deuda anotada, compensar mes siguiente." : "";
  return { ok:true, estado:s, msg:`✓ ${t.nombre} → ${nombre}${aviso}` };
}

function devolverFestivo(estado, trabajadorId, fecha) {
  const s = JSON.parse(JSON.stringify(estado));
  s.festivosPedidos[trabajadorId] = s.festivosPedidos[trabajadorId].filter(f => f !== fecha);
  return s;
}

function rotarColaAnual(estado) {
  const s = JSON.parse(JSON.stringify(estado));
  s.colaFestivos.unshift(s.colaFestivos.pop());
  return s;
}

// ─────────────────────────────────────────────────────────
//  VALIDACIÓN Y ESTADÍSTICAS
// ─────────────────────────────────────────────────────────

function validarCobertura(calendario) {
  const errores = [];
  for (const [fecha, dia] of calendario) {
    const vals   = [...dia.turnos.values()];
    const trabN  = vals.filter(v => v===T.M||v===T.Ta||v===T.N).length;
    const libreN = vals.filter(v => v===T.L||v===T.F||v===T.V).length;
    if (trabN  !== 3) errores.push(`${fecha}: trabajan ${trabN} (esperado 3)`);
    if (libreN !== 2) errores.push(`${fecha}: libran   ${libreN} (esperado 2)`);
    if (!vals.includes(T.M))  errores.push(`${fecha}: sin Mañana`);
    if (!vals.includes(T.Ta)) errores.push(`${fecha}: sin Tarde`);
    if (!vals.includes(T.N))  errores.push(`${fecha}: sin Noche`);
  }
  return errores;
}

function calcularEstadisticas(calendario) {
  const s = new Map(trabajadores.map(t => [t.id, {
    nombre:t.nombre, contrato:t.contrato,
    trabajados:0, libres:0, vacaciones:0, festivos:0,
    mañanas:0, tardes:0, noches:0, fdsLibres:0, fdsTotal:0,
  }]));

  for (const [fecha, dia] of calendario) {
    const esFds = [0,6].includes(new Date(fecha).getDay());
    if (esFds) trabajadores.forEach(t => s.get(t.id).fdsTotal++);

    for (const t of trabajadores) {
      const st = s.get(t.id);
      const turno = dia.turnos.get(t.id);
      if      (turno===T.M)  { st.trabajados++; st.mañanas++;   }
      else if (turno===T.Ta) { st.trabajados++; st.tardes++;    }
      else if (turno===T.N)  { st.trabajados++; st.noches++;    }
      else if (turno===T.L)  { st.libres++;     if(esFds) st.fdsLibres++; }
      else if (turno===T.F)  { st.festivos++;   if(esFds) st.fdsLibres++; }
      else if (turno===T.V)  { st.vacaciones++;              }
    }
  }
  return [...s.values()];
}

// ─────────────────────────────────────────────────────────
//  DEMO
// ─────────────────────────────────────────────────────────

let estado = estadoInicial();

// Vacaciones
estado = asignarVacaciones(estado, 1, "2026-07-01", "2026-07-14");
estado = asignarVacaciones(estado, 2, "2026-08-01", "2026-08-14");

// Festivos
const ops = [
  pedirFestivo(estado, 1, "2026-01-01"),
  pedirFestivo(estado, 4, "2026-01-06"),
  pedirFestivo(estado, 2, "2026-05-01"),
];
for (const op of ops) { if (op.ok) estado = op.estado; }

// Generar
const calendario = generarCalendario(estado);

// Validar cobertura
const errores = validarCobertura(calendario);
console.log("\n╔═══════════════════════════════════════════╗");
console.log("║       EquiShift v2 — Validación           ║");
console.log("╚═══════════════════════════════════════════╝");
if (errores.length === 0) {
  console.log("✓  COBERTURA PERFECTA — 365 días × 3 trabajando, 2 librando");
} else {
  console.log(`✗  ${errores.length} errores:`);
  errores.slice(0, 15).forEach(e => console.log("   " + e));
}

// Semana 1
console.log("\n── Semana 1 (Ene) ──────────────────────────────────────────");
const semana1 = [...calendario.entries()].slice(0, 7);
const HDR = ["Fecha  ","Día ","Jose María  ","Salvador    ","Miguel      ","Diego       ","Rafa  "].join("│");
console.log(HDR); console.log("─".repeat(HDR.length));
for (const [f, d] of semana1) {
  const row = [f.slice(5), DOW_ES[d.dow].padEnd(4),
    ...trabajadores.map(t => (d.turnos.get(t.id)||"?").padEnd(12))
  ].join("│");
  console.log(row + (d.esFestivo ? `  ★ ${d.nombreFestivo}` : ""));
}

// Estadísticas
console.log("\n── Estadísticas anuales ────────────────────────────────────");
const stats = calcularEstadisticas(calendario);
console.log(["Nombre       ","Contrato","Trabajan","Mañana","Tarde ","Noche ","FdS lib","Festivos","Vacac."].join(" │ "));
for (const s of stats) {
  console.log([
    s.nombre.padEnd(13), `${s.contrato}h`.padEnd(8),
    String(s.trabajados).padEnd(8), String(s.mañanas).padEnd(6),
    String(s.tardes).padEnd(6),     String(s.noches).padEnd(6),
    String(s.fdsLibres).padEnd(7),  String(s.festivos).padEnd(8),
    String(s.vacaciones),
  ].join(" │ "));
}

// Mensajes
console.log("\n── Operaciones ─────────────────────────────────────────────");
ops.forEach(o => console.log(o.msg));

// Export
if (typeof module !== "undefined") module.exports = {
  trabajadores, estadoInicial, generarCalendario,
  asignarVacaciones, eliminarVacaciones,
  pedirFestivo, devolverFestivo, rotarColaAnual,
  calcularEstadisticas, validarCobertura,
  FESTIVOS_2026, T,
};