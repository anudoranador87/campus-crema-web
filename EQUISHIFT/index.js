const trabajadores = [
  {
    id: 1,
    nombre: "Jose María",
    contrato: 37.50,
    festivosDisponibles: 13,
    vacacionesDisponibles: 28,
    saldoHorasAcumuladas: 0,
    calendario: [] 
  },

  {
    id: 2,
    nombre: "Salvador",
    contrato: 37.50,
    festivosDisponibles: 13,
    vacacionesDisponibles: 28,
    saldoHorasAcumuladas: 0,
    calendario: [] 
  },

  {
    id: 3,
    nombre: "Miguel",
    contrato: 37.50,
    festivosDisponibles: 13,
    vacacionesDisponibles: 28,
    saldoHorasAcumuladas: 0,
    calendario: [] 
  },

  {
    id: 4,
    nombre: "Diego",
    contrato: 40,
    festivosDisponibles: 14,
    vacacionesDisponibles: 28,
    calendario: [] 
  },

  {
    id: 5,
    nombre: "Rafa",
    contrato: 40,
    festivosDisponibles: 14,
    vacacionesDisponibles: 28,
    calendario: [] 
  },
]
const festivosMalaga2026 = [
  "2026-01-01", // Año Nuevo
  "2026-01-06", // Epifanía del Señor
  "2026-02-28", // Día de Andalucía
  "2026-04-02", // Jueves Santo
  "2026-04-03", // Viernes Santo
  "2026-05-01", // Fiesta del Trabajo
  "2026-08-15", // Asunción de la Virgen
  "2026-08-19", // Feria de Málaga (Local)
  "2026-09-08", // Virgen de la Victoria (Local)
  "2026-10-12", // Fiesta Nacional de España
  "2026-11-02", // Lunes tras Todos los Santos
  "2026-12-07", // Lunes tras la Constitución
  "2026-12-08", // Inmaculada Concepción
  "2026-12-25"  // Navidad
];
/*ctualmente en mi empresa para 2026, el reparto es asi
Diego    78 días  →  debería tener 41  →  tiene 37 DE MÁS
Salvador 37 días  →  debería tener 41  →  le faltan  4
Miguel   34 días  →  debería tener 41  →  le faltan  7
Jose     30 días  →  debería tener 41  →  le faltan 11
Rafa     25 días  →  debería tener 41  →  le faltan 16
─────────────────────────────────────────────
TOTAL disponibles →  52 fines de semana en 2026 
 */

// Filtramos a los trabajadores por su tipo de contrato semanal

const jornada375 = trabajadores.filter(function(trabajador) {
    return trabajador.contrato === 37.50;
});

const jornada40 = trabajadores.filter(function(trabajador) {
    return trabajador.contrato === 40;
});

// Llamamos a los trabajadores ya filtrados para mostrarlos y que nos muestre que tipo de contrato y cuantos festivos tienen cada uno
jornada375.forEach(function(mostrar){
console.log(`Jornada de ${mostrar.contrato} — ${mostrar.nombre}— ${mostrar.festivosDisponibles} festivos`)
});

jornada40.forEach(function(mostrar){
console.log(`Jornada de ${mostrar.contrato} — ${mostrar.nombre}— ${mostrar.festivosDisponibles} festivos`)
});

// 