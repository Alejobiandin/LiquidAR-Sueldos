// ============================================================
// LiquidAR — Base de datos de Convenios Colectivos de Trabajo
// Datos actualizados a julio 2026
// ============================================================

export interface Categoria {
  id: string;
  nombre: string;
  salarioBasico: number; // Salario básico bruto mensual
  jornal?: number; // Para trabajadores jornalizados (por día)
  descripcion?: string;
}

export interface Adicional {
  id: string;
  nombre: string;
  tipo: "porcentaje" | "fijo" | "jornal_porcentaje";
  valor: number; // Porcentaje o monto fijo
  base?: "basico" | "bruto" | "smvm"; // Base de cálculo
  obligatorio: boolean;
  descripcion: string;
}

export interface Convenio {
  id: string;
  numero: string; // Ej: "130/75"
  nombre: string;
  sindicato: string;
  sector: string;
  tipoJornada: "mensual" | "jornal" | "mixto";
  horasSemana: number;
  categorias: Categoria[];
  adicionales: Adicional[];
  fondoCese?: boolean; // Fondo de cese laboral (construcción)
  descripcion: string;
  vigencia: string;
}

// ============================================================
// SALARIO MÍNIMO VITAL Y MÓVIL (SMVM) - Julio 2026
// ============================================================
export const SMVM = 1_100_000; // Referencia aproximada julio 2026

// ============================================================
// APORTES Y CONTRIBUCIONES — Seguridad Social
// Fuente: argentina.gob.ar / AFIP
// ============================================================
export const APORTES_EMPLEADO = {
  jubilacion: 0.11, // 11% SIPA
  pami: 0.03, // 3% INSSJP
  obraSocial: 0.03, // 3% Obra Social
  // Total empleado: 17%
};

export const CONTRIBUCIONES_EMPLEADOR = {
  jubilacion: 0.16, // 16% SIPA
  pami: 0.02, // 2% INSSJP
  obraSocial: 0.06, // 6% Obra Social
  fondoEmpleo: 0.015, // 1.5% Fondo Nacional de Empleo
  // Total empleador: 23.5% (sin ART ni seguro de vida)
};

export const APORTE_SINDICAL = 0.02; // 2% cuota sindical (varía por CCT)
export const SEGURO_VIDA_OBLIGATORIO = 300; // Monto fijo aproximado

// ============================================================
// TOPE BASE IMPONIBLE (Julio 2026 — referencia)
// ============================================================
export const TOPE_BASE_IMPONIBLE_JUBILACION = 5_500_000; // Tope máximo para aportes jubilación

// ============================================================
// CONVENIOS COLECTIVOS DE TRABAJO
// ============================================================

export const CONVENIOS: Convenio[] = [
  // ─────────────────────────────────────────────────────────
  // CCT 130/75 — EMPLEADOS DE COMERCIO (FAECYS)
  // ─────────────────────────────────────────────────────────
  {
    id: "comercio",
    numero: "130/75",
    nombre: "Empleados de Comercio",
    sindicato: "FAECYS",
    sector: "Comercio",
    tipoJornada: "mensual",
    horasSemana: 48,
    descripcion:
      "Aplica a trabajadores de comercio minorista, mayorista, farmacias, call centers, supermercados y servicios.",
    vigencia: "Acuerdo abril 2026 (26/03/2026)",
    categorias: [
      { id: "maestranza_a", nombre: "Maestranza A", salarioBasico: 1_245_631, descripcion: "Personal de limpieza y mantenimiento básico" },
      { id: "maestranza_b", nombre: "Maestranza B", salarioBasico: 1_250_454, descripcion: "Personal de limpieza y mantenimiento con experiencia" },
      { id: "maestranza_c", nombre: "Maestranza C", salarioBasico: 1_255_270, descripcion: "Encargado de maestranza" },
      { id: "administrativo_a", nombre: "Administrativo A", salarioBasico: 1_267_268, descripcion: "Empleado administrativo inicial" },
      { id: "administrativo_b", nombre: "Administrativo B", salarioBasico: 1_272_500, descripcion: "Empleado administrativo con experiencia" },
      { id: "administrativo_c", nombre: "Administrativo C", salarioBasico: 1_280_000, descripcion: "Empleado administrativo avanzado" },
      { id: "cajero_a", nombre: "Cajero A", salarioBasico: 1_271_091, descripcion: "Cajero inicial" },
      { id: "cajero_b", nombre: "Cajero B", salarioBasico: 1_278_000, descripcion: "Cajero con experiencia" },
      { id: "cajero_c", nombre: "Cajero C", salarioBasico: 1_285_000, descripcion: "Cajero especializado" },
      { id: "vendedor_a", nombre: "Vendedor A", salarioBasico: 1_269_729, descripcion: "Vendedor inicial" },
      { id: "vendedor_b", nombre: "Vendedor B", salarioBasico: 1_281_775, descripcion: "Vendedor con experiencia" },
      { id: "vendedor_c", nombre: "Vendedor C", salarioBasico: 1_294_044, descripcion: "Vendedor especializado" },
      { id: "aux_especializado_a", nombre: "Auxiliar Especializado A", salarioBasico: 1_280_274, descripcion: "Auxiliar con especialización técnica" },
      { id: "aux_especializado_b", nombre: "Auxiliar Especializado B", salarioBasico: 1_295_000, descripcion: "Auxiliar especializado avanzado" },
      { id: "supervisor", nombre: "Supervisor / Encargado", salarioBasico: 1_380_000, descripcion: "Encargado de sección o turno" },
      { id: "jefe_seccion", nombre: "Jefe de Sección", salarioBasico: 1_450_000, descripcion: "Responsable de sección" },
      { id: "subgerente", nombre: "Subgerente", salarioBasico: 1_600_000, descripcion: "Subgerente de local o área" },
    ],
    adicionales: [
      { id: "presentismo", nombre: "Presentismo (Art. 40)", tipo: "porcentaje", valor: 8.33, base: "basico", obligatorio: false, descripcion: "Se abona cuando el trabajador no registra ausencias injustificadas en el mes" },
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% del salario básico por cada año de antigüedad" },
      { id: "adicional_cajero_ac", nombre: "Adicional Cajeros A y C (Art. 30)", tipo: "fijo", valor: 153_081.58, base: "basico", obligatorio: false, descripcion: "Adicional mensual para cajeros categoría A y C" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT 76/75 — CONSTRUCCIÓN (UOCRA)
  // ─────────────────────────────────────────────────────────
  {
    id: "construccion",
    numero: "76/75",
    nombre: "Construcción (UOCRA)",
    sindicato: "UOCRA",
    sector: "Construcción",
    tipoJornada: "jornal",
    horasSemana: 44,
    descripcion:
      "Aplica a obreros de la construcción, obras civiles, viales e hidráulicas. Pago por jornal diario.",
    vigencia: "Acuerdo mayo-junio 2026",
    fondoCese: true,
    categorias: [
      { id: "peon", nombre: "Peón", jornal: 15_800, salarioBasico: 15_800 * 22, descripcion: "Trabajador sin especialización" },
      { id: "medio_oficial", nombre: "Medio Oficial", jornal: 17_200, salarioBasico: 17_200 * 22, descripcion: "Trabajador con conocimientos básicos del oficio" },
      { id: "oficial", nombre: "Oficial", jornal: 19_500, salarioBasico: 19_500 * 22, descripcion: "Trabajador con dominio del oficio" },
      { id: "oficial_especializado", nombre: "Oficial Especializado", jornal: 21_800, salarioBasico: 21_800 * 22, descripcion: "Oficial con especialización técnica" },
      { id: "capataz", nombre: "Capataz", jornal: 24_500, salarioBasico: 24_500 * 22, descripcion: "Supervisor de cuadrilla" },
      { id: "capataz_general", nombre: "Capataz General", jornal: 27_000, salarioBasico: 27_000 * 22, descripcion: "Supervisor general de obra" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "fondo_cese", nombre: "Fondo de Cese Laboral (IERIC)", tipo: "porcentaje", valor: 12, base: "bruto", obligatorio: true, descripcion: "Fondo de desempleo específico de la construcción, a cargo del empleador" },
      { id: "presentismo_construccion", nombre: "Presentismo", tipo: "porcentaje", valor: 8, base: "basico", obligatorio: false, descripcion: "Premio por asistencia perfecta" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT 260/75 — METALÚRGICOS (UOM)
  // ─────────────────────────────────────────────────────────
  {
    id: "metalurgia",
    numero: "260/75",
    nombre: "Metalúrgicos (UOM)",
    sindicato: "UOM",
    sector: "Industria Metalúrgica",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a trabajadores de la industria metalúrgica, automotriz, siderurgia y fabricación de partes.",
    vigencia: "Acuerdo septiembre 2025 - abril 2026",
    categorias: [
      { id: "ingresante", nombre: "Ingresante", salarioBasico: 1_150_000, descripcion: "Trabajador sin experiencia en el sector" },
      { id: "operario_semicalificado", nombre: "Operario Semicalificado", salarioBasico: 1_250_000, descripcion: "Operario con conocimientos básicos" },
      { id: "operario_calificado", nombre: "Operario Calificado", salarioBasico: 1_380_000, descripcion: "Operario con dominio de su función" },
      { id: "operario_especializado", nombre: "Operario Especializado", salarioBasico: 1_520_000, descripcion: "Operario con alta especialización técnica" },
      { id: "oficial_1", nombre: "Oficial de 1ra", salarioBasico: 1_680_000, descripcion: "Máxima categoría operaria" },
      { id: "capataz_metalurgia", nombre: "Capataz", salarioBasico: 1_850_000, descripcion: "Supervisor de línea de producción" },
      { id: "jefe_turno", nombre: "Jefe de Turno", salarioBasico: 2_100_000, descripcion: "Responsable de turno de producción" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "presentismo_uom", nombre: "Presentismo", tipo: "porcentaje", valor: 8.33, base: "basico", obligatorio: false, descripcion: "Premio mensual por asistencia perfecta" },
      { id: "adicional_convenio", nombre: "Adicional de Convenio", tipo: "porcentaje", valor: 5, base: "basico", obligatorio: true, descripcion: "Adicional establecido por el CCT 260/75" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT 389/04 — HOTELERÍA Y GASTRONOMÍA (UTHGRA)
  // ─────────────────────────────────────────────────────────
  {
    id: "gastronomia",
    numero: "389/04",
    nombre: "Hotelería y Gastronomía (UTHGRA)",
    sindicato: "UTHGRA",
    sector: "Hotelería y Gastronomía",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a trabajadores de hoteles, restaurantes, bares, cafeterías y establecimientos gastronómicos.",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "ayudante_cocina", nombre: "Ayudante de Cocina", salarioBasico: 1_100_000, descripcion: "Asistente de cocina sin especialización" },
      { id: "cocinero", nombre: "Cocinero", salarioBasico: 1_280_000, descripcion: "Cocinero con experiencia" },
      { id: "cocinero_especializado", nombre: "Cocinero Especializado", salarioBasico: 1_450_000, descripcion: "Cocinero con especialización" },
      { id: "mozo", nombre: "Mozo / Camarero", salarioBasico: 1_150_000, descripcion: "Personal de salón" },
      { id: "recepcionista", nombre: "Recepcionista", salarioBasico: 1_200_000, descripcion: "Personal de recepción hotelera" },
      { id: "mucama", nombre: "Mucama / Camarera de Pisos", salarioBasico: 1_100_000, descripcion: "Personal de limpieza hotelera" },
      { id: "barman", nombre: "Barman / Bartender", salarioBasico: 1_300_000, descripcion: "Especialista en bebidas" },
      { id: "maitre", nombre: "Maître", salarioBasico: 1_600_000, descripcion: "Jefe de salón" },
      { id: "chef", nombre: "Chef / Jefe de Cocina", salarioBasico: 1_900_000, descripcion: "Responsable de cocina" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "presentismo_uthgra", nombre: "Presentismo", tipo: "porcentaje", valor: 8.33, base: "basico", obligatorio: false, descripcion: "Premio por asistencia perfecta mensual" },
      { id: "propina_reglamentada", nombre: "Propina Reglamentada", tipo: "fijo", valor: 80_000, base: "basico", obligatorio: false, descripcion: "Monto estimado de propinas reglamentadas (varía por establecimiento)" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT 122/75 — SANIDAD (FATSA)
  // ─────────────────────────────────────────────────────────
  {
    id: "sanidad",
    numero: "122/75",
    nombre: "Sanidad (FATSA)",
    sindicato: "FATSA",
    sector: "Salud",
    tipoJornada: "mensual",
    horasSemana: 36,
    descripcion:
      "Aplica a personal de clínicas, sanatorios, hospitales privados y obras sociales.",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "aux_enfermeria", nombre: "Auxiliar de Enfermería", salarioBasico: 1_200_000, descripcion: "Auxiliar de enfermería sin título" },
      { id: "enfermero", nombre: "Enfermero/a", salarioBasico: 1_450_000, descripcion: "Enfermero/a con título habilitante" },
      { id: "enfermero_especializado", nombre: "Enfermero/a Especializado/a", salarioBasico: 1_700_000, descripcion: "Enfermero/a con especialización" },
      { id: "tecnico_laboratorio", nombre: "Técnico de Laboratorio", salarioBasico: 1_500_000, descripcion: "Técnico en análisis clínicos" },
      { id: "administrativo_sanidad", nombre: "Administrativo", salarioBasico: 1_250_000, descripcion: "Personal administrativo de salud" },
      { id: "camillero", nombre: "Camillero", salarioBasico: 1_150_000, descripcion: "Personal de traslado de pacientes" },
      { id: "mucama_sanidad", nombre: "Mucama", salarioBasico: 1_100_000, descripcion: "Personal de limpieza hospitalaria" },
      { id: "medico_guardia", nombre: "Médico de Guardia", salarioBasico: 3_500_000, descripcion: "Médico en guardia activa" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "nocturnidad", nombre: "Nocturnidad (entre 21 y 6 hs)", tipo: "porcentaje", valor: 30, base: "basico", obligatorio: false, descripcion: "Recargo del 30% por trabajo nocturno" },
      { id: "feriado_sanidad", nombre: "Franco compensatorio feriado", tipo: "porcentaje", valor: 100, base: "basico", obligatorio: false, descripcion: "Día libre compensatorio por feriado trabajado" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT BANCARIOS (ABAPRA / ASOCIACIÓN BANCARIA)
  // ─────────────────────────────────────────────────────────
  {
    id: "bancarios",
    numero: "18/75",
    nombre: "Bancarios (La Bancaria)",
    sindicato: "La Bancaria",
    sector: "Banca y Finanzas",
    tipoJornada: "mensual",
    horasSemana: 36,
    descripcion:
      "Aplica a empleados de bancos públicos y privados, entidades financieras y cajas de crédito.",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "cajero_bancario", nombre: "Cajero Bancario", salarioBasico: 1_500_000, descripcion: "Operador de caja bancaria" },
      { id: "administrativo_bancario_a", nombre: "Administrativo A", salarioBasico: 1_600_000, descripcion: "Empleado administrativo bancario inicial" },
      { id: "administrativo_bancario_b", nombre: "Administrativo B", salarioBasico: 1_800_000, descripcion: "Empleado administrativo bancario con experiencia" },
      { id: "analista_bancario", nombre: "Analista", salarioBasico: 2_200_000, descripcion: "Analista de créditos, riesgos o sistemas" },
      { id: "jefe_seccion_banco", nombre: "Jefe de Sección", salarioBasico: 2_800_000, descripcion: "Responsable de sección bancaria" },
      { id: "gerente_sucursal", nombre: "Gerente de Sucursal", salarioBasico: 4_500_000, descripcion: "Gerente de sucursal bancaria" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "presentismo_bancario", nombre: "Presentismo", tipo: "porcentaje", valor: 8.33, base: "basico", obligatorio: false, descripcion: "Premio mensual por asistencia perfecta" },
      { id: "titulo_universitario", nombre: "Título Universitario", tipo: "porcentaje", valor: 10, base: "basico", obligatorio: false, descripcion: "Adicional por título universitario habilitante" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT CAMIONEROS (FATAC)
  // ─────────────────────────────────────────────────────────
  {
    id: "camioneros",
    numero: "40/89",
    nombre: "Camioneros (FATAC)",
    sindicato: "FATAC",
    sector: "Transporte de Cargas",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a choferes y personal de transporte de cargas por automotor.",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "chofer_reparto", nombre: "Chofer de Reparto", salarioBasico: 1_400_000, descripcion: "Chofer de distribución urbana" },
      { id: "chofer_larga_distancia", nombre: "Chofer Larga Distancia", salarioBasico: 1_700_000, descripcion: "Chofer de transporte interurbano" },
      { id: "chofer_cargas_peligrosas", nombre: "Chofer Cargas Peligrosas", salarioBasico: 1_950_000, descripcion: "Chofer habilitado para materiales peligrosos" },
      { id: "ayudante_chofer", nombre: "Ayudante de Chofer", salarioBasico: 1_200_000, descripcion: "Acompañante y asistente del chofer" },
      { id: "despachante", nombre: "Despachante", salarioBasico: 1_350_000, descripcion: "Personal de despacho y logística" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "viaticos_camioneros", nombre: "Viáticos", tipo: "fijo", valor: 150_000, base: "basico", obligatorio: false, descripcion: "Viáticos por viajes de larga distancia (no remunerativo)" },
      { id: "adicional_nocturnidad_camioneros", nombre: "Nocturnidad", tipo: "porcentaje", valor: 25, base: "basico", obligatorio: false, descripcion: "Recargo por conducción nocturna" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT DOCENTES PRIVADOS (SADOP)
  // ─────────────────────────────────────────────────────────
  {
    id: "docentes_privados",
    numero: "201/92",
    nombre: "Docentes de Establecimientos Privados (SADOP)",
    sindicato: "SADOP",
    sector: "Educación Privada",
    tipoJornada: "mensual",
    horasSemana: 36,
    descripcion:
      "Aplica a docentes de colegios, institutos y universidades privadas.",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "maestro_inicial", nombre: "Maestro/a Nivel Inicial", salarioBasico: 1_300_000, descripcion: "Docente de jardín de infantes" },
      { id: "maestro_primario", nombre: "Maestro/a Nivel Primario", salarioBasico: 1_350_000, descripcion: "Docente de escuela primaria" },
      { id: "profesor_secundario", nombre: "Profesor/a Nivel Secundario", salarioBasico: 1_450_000, descripcion: "Docente de escuela secundaria" },
      { id: "profesor_universitario", nombre: "Profesor/a Universitario/a", salarioBasico: 1_800_000, descripcion: "Docente universitario" },
      { id: "directivo", nombre: "Directivo / Rector", salarioBasico: 2_200_000, descripcion: "Director o rector de establecimiento" },
      { id: "preceptor", nombre: "Preceptor/a", salarioBasico: 1_200_000, descripcion: "Personal de preceptoría" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "titulo_docente", nombre: "Título Docente Habilitante", tipo: "porcentaje", valor: 15, base: "basico", obligatorio: false, descripcion: "Adicional por título docente habilitante" },
      { id: "zona_desfavorable", nombre: "Zona Desfavorable", tipo: "porcentaje", valor: 20, base: "basico", obligatorio: false, descripcion: "Adicional por trabajo en zonas desfavorables" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT FARMACIA (FATSA / SAFYB)
  // ─────────────────────────────────────────────────────────
  {
    id: "farmacia",
    numero: "141/75",
    nombre: "Farmacia (FATSA / SAFYB)",
    sindicato: "FATSA",
    sector: "Farmacia",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a empleados de farmacias, droguerías y laboratorios farmacéuticos.",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "auxiliar_farmacia", nombre: "Auxiliar de Farmacia", salarioBasico: 1_150_000, descripcion: "Auxiliar sin título habilitante" },
      { id: "farmaceutico", nombre: "Farmacéutico/a", salarioBasico: 2_500_000, descripcion: "Farmacéutico con título habilitante" },
      { id: "bioquimico", nombre: "Bioquímico/a", salarioBasico: 2_800_000, descripcion: "Bioquímico con título habilitante" },
      { id: "administrativo_farmacia", nombre: "Administrativo", salarioBasico: 1_200_000, descripcion: "Personal administrativo de farmacia" },
      { id: "repositor", nombre: "Repositor", salarioBasico: 1_100_000, descripcion: "Personal de reposición de mercadería" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "titulo_farmacia", nombre: "Título Habilitante", tipo: "porcentaje", valor: 20, base: "basico", obligatorio: false, descripcion: "Adicional por título universitario habilitante" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT TEXTIL (AOT / FITA)
  // ─────────────────────────────────────────────────────────
  {
    id: "textil",
    numero: "500/07",
    nombre: "Industria Textil (AOT)",
    sindicato: "AOT",
    sector: "Industria Textil",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a trabajadores de la industria textil, confección y calzado.",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "operario_textil", nombre: "Operario General", salarioBasico: 1_150_000, descripcion: "Operario sin especialización" },
      { id: "costurero", nombre: "Costurero/a", salarioBasico: 1_280_000, descripcion: "Operario de costura" },
      { id: "cortador", nombre: "Cortador/a", salarioBasico: 1_380_000, descripcion: "Operario de corte" },
      { id: "oficial_textil", nombre: "Oficial Textil", salarioBasico: 1_500_000, descripcion: "Operario especializado" },
      { id: "supervisor_textil", nombre: "Supervisor", salarioBasico: 1_700_000, descripcion: "Supervisor de línea de producción" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "presentismo_textil", nombre: "Presentismo", tipo: "porcentaje", valor: 8.33, base: "basico", obligatorio: false, descripcion: "Premio mensual por asistencia perfecta" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT ADMINISTRACIÓN PÚBLICA NACIONAL (UPCN / ATE)
  // ─────────────────────────────────────────────────────────
  {
    id: "administracion_publica",
    numero: "214/06",
    nombre: "Administración Pública Nacional (UPCN/ATE)",
    sindicato: "UPCN / ATE",
    sector: "Sector Público",
    tipoJornada: "mensual",
    horasSemana: 35,
    descripcion:
      "Aplica a empleados de la Administración Pública Nacional (APN).",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "agrupamiento_a", nombre: "Agrupamiento A — Nivel 1", salarioBasico: 1_100_000, descripcion: "Nivel inicial del escalafón" },
      { id: "agrupamiento_a2", nombre: "Agrupamiento A — Nivel 2", salarioBasico: 1_200_000, descripcion: "Nivel 2 del escalafón" },
      { id: "agrupamiento_b", nombre: "Agrupamiento B — Nivel 1", salarioBasico: 1_350_000, descripcion: "Agrupamiento B nivel inicial" },
      { id: "agrupamiento_b2", nombre: "Agrupamiento B — Nivel 2", salarioBasico: 1_500_000, descripcion: "Agrupamiento B nivel 2" },
      { id: "agrupamiento_c", nombre: "Agrupamiento C — Profesional", salarioBasico: 1_800_000, descripcion: "Agrupamiento profesional" },
      { id: "jefe_departamento", nombre: "Jefe de Departamento", salarioBasico: 2_200_000, descripcion: "Jefe de departamento o división" },
      { id: "director_nacional", nombre: "Director Nacional", salarioBasico: 3_500_000, descripcion: "Director nacional o equivalente" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "titulo_universitario_pub", nombre: "Título Universitario", tipo: "porcentaje", valor: 15, base: "basico", obligatorio: false, descripcion: "Adicional por título universitario" },
      { id: "zona_desfavorable_pub", nombre: "Zona Desfavorable", tipo: "porcentaje", valor: 30, base: "basico", obligatorio: false, descripcion: "Adicional por trabajo en zonas desfavorables" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT PERIODISTAS (UTPBA / SIPREBA)
  // ─────────────────────────────────────────────────────────
  {
    id: "periodistas",
    numero: "301/75",
    nombre: "Periodistas (UTPBA / SIPREBA)",
    sindicato: "UTPBA",
    sector: "Medios de Comunicación",
    tipoJornada: "mensual",
    horasSemana: 36,
    descripcion:
      "Aplica a periodistas, redactores, fotógrafos y personal de medios de comunicación.",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "colaborador_periodista", nombre: "Colaborador", salarioBasico: 1_200_000, descripcion: "Periodista colaborador" },
      { id: "redactor", nombre: "Redactor", salarioBasico: 1_500_000, descripcion: "Redactor de planta" },
      { id: "redactor_especial", nombre: "Redactor Especial", salarioBasico: 1_800_000, descripcion: "Redactor con especialización" },
      { id: "fotografo", nombre: "Fotógrafo", salarioBasico: 1_600_000, descripcion: "Fotógrafo periodístico" },
      { id: "jefe_redaccion", nombre: "Jefe de Redacción", salarioBasico: 2_500_000, descripcion: "Jefe de redacción" },
      { id: "director_periodista", nombre: "Director Periodístico", salarioBasico: 3_200_000, descripcion: "Director de medio" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "titulo_periodista", nombre: "Título Habilitante", tipo: "porcentaje", valor: 10, base: "basico", obligatorio: false, descripcion: "Adicional por título de periodista o comunicador" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CCT ALIMENTACIÓN (STIA)
  // ─────────────────────────────────────────────────────────
  {
    id: "alimentacion",
    numero: "244/94",
    nombre: "Industria de la Alimentación (STIA)",
    sindicato: "STIA",
    sector: "Industria Alimentaria",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a trabajadores de la industria de alimentos, bebidas y afines.",
    vigencia: "Acuerdo 2025-2026",
    categorias: [
      { id: "operario_alimentacion", nombre: "Operario General", salarioBasico: 1_200_000, descripcion: "Operario sin especialización" },
      { id: "operario_calificado_alim", nombre: "Operario Calificado", salarioBasico: 1_380_000, descripcion: "Operario con especialización" },
      { id: "oficial_alimentacion", nombre: "Oficial", salarioBasico: 1_550_000, descripcion: "Oficial de producción" },
      { id: "supervisor_alimentacion", nombre: "Supervisor", salarioBasico: 1_800_000, descripcion: "Supervisor de línea" },
      { id: "tecnico_alimentacion", nombre: "Técnico de Calidad", salarioBasico: 1_950_000, descripcion: "Técnico en control de calidad" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "presentismo_alim", nombre: "Presentismo", tipo: "porcentaje", valor: 8.33, base: "basico", obligatorio: false, descripcion: "Premio mensual por asistencia perfecta" },
      { id: "adicional_frio", nombre: "Trabajo en Frío", tipo: "porcentaje", valor: 20, base: "basico", obligatorio: false, descripcion: "Adicional por trabajo en cámaras frigoríficas" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // TRABAJADORES RURALES (UATRE) — Régimen de Trabajo Agrario
  // ─────────────────────────────────────────────────────────
  {
    id: "rural",
    numero: "S/N — RTA (Ley 26.727)",
    nombre: "Trabajadores Rurales (UATRE)",
    sindicato: "UATRE",
    sector: "Trabajo Agrario",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a trabajadores permanentes del sector agropecuario: peones, tractoristas, aplicadores de fitosanitarios y personal de riego y cosecha, bajo el Régimen de Trabajo Agrario (Ley 26.727).",
    vigencia: "Acuerdo may-sep 2026 (Disposición DI-2026-643-APN-DNRYRT#MCH)",
    categorias: [
      { id: "peon_general", nombre: "Peón General", salarioBasico: 1_088_358, descripcion: "Trabajador sin especialización, tareas generales de campo" },
      { id: "peon_auxiliar_fitosanitarios", nombre: "Peón Auxiliar (Fitosanitarios)", salarioBasico: 1_761_297, descripcion: "Aplicación de productos fitosanitarios" },
      { id: "conductor_tractorista_cosecha", nombre: "Tractorista / Maquinista de Cosechadora", salarioBasico: 1_666_581, descripcion: "Afectado exclusivamente a cosecha de granos y oleaginosas" },
      { id: "trabajador_calificado_riego", nombre: "Trabajador Calificado de Riego", salarioBasico: 1_378_570, descripcion: "Actividad olivícola — riego calificado" },
      { id: "encargado_rural", nombre: "Encargado de Establecimiento", salarioBasico: 1_483_215, descripcion: "Responsable de establecimiento agropecuario" },
      { id: "conductor_equipos_autopropulsados", nombre: "Conductor de Equipos Autopropulsados", salarioBasico: 2_545_139, descripcion: "Categoría mejor remunerada del convenio rural" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% del básico por año hasta los 10 años; 1,5% por año a partir del año 11 (ajustar manualmente para antigüedades mayores a 10 años)" },
      { id: "zona_desfavorable_rural", nombre: "Zona Desfavorable", tipo: "porcentaje", valor: 20, base: "basico", obligatorio: false, descripcion: "Adicional para tareas en Chubut, Santa Cruz, Tierra del Fuego, Antártida e Islas del Atlántico Sur" },
      { id: "presentismo_rural", nombre: "Presentismo", tipo: "porcentaje", valor: 8.33, base: "basico", obligatorio: false, descripcion: "Premio por asistencia perfecta (según convenio de empresa)" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // SEGURIDAD PRIVADA (UPSRA)
  // ─────────────────────────────────────────────────────────
  {
    id: "seguridad_privada",
    numero: "507/07",
    nombre: "Seguridad Privada (UPSRA)",
    sindicato: "UPSRA",
    sector: "Seguridad Privada",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a vigiladores, operadores de monitoreo, técnicos y personal administrativo de empresas de seguridad privada (CCT 507/07, CAESI-UPSRA).",
    vigencia: "Acta acuerdo enero-junio 2026 (CAESI-UPSRA)",
    categorias: [
      { id: "vigilador_general", nombre: "Vigilador General", salarioBasico: 911_650, descripcion: "Vigilador sin especialización" },
      { id: "vigilador_bombero", nombre: "Vigilador Bombero", salarioBasico: 953_950, descripcion: "Vigilador con formación en prevención de incendios" },
      { id: "operador_monitoreo", nombre: "Operador de Monitoreo", salarioBasico: 953_950, descripcion: "Operador de central de monitoreo" },
      { id: "vigilador_principal", nombre: "Vigilador Principal", salarioBasico: 995_700, descripcion: "Vigilador con mayor responsabilidad o antigüedad" },
      { id: "administrativo_seguridad", nombre: "Administrativo / Guía Técnico", salarioBasico: 973_900, descripcion: "Personal administrativo y guías técnicos" },
      { id: "tecnico_instalador", nombre: "Técnico Instalador", salarioBasico: 1_050_000, descripcion: "Técnico instalador de sistemas de seguridad" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "presentismo_seguridad", nombre: "Presentismo", tipo: "porcentaje", valor: 18, base: "basico", obligatorio: false, descripcion: "Premio por presentismo — particularmente alto en este convenio" },
      { id: "viaticos_seguridad", nombre: "Viáticos", tipo: "fijo", valor: 498_000, base: "basico", obligatorio: false, descripcion: "Viáticos por traslado al puesto de trabajo" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // ENCARGADOS DE EDIFICIOS (SUTERH / FATERYH)
  // ─────────────────────────────────────────────────────────
  {
    id: "encargados_edificios",
    numero: "589/10",
    nombre: "Encargados de Edificios (SUTERH / FATERYH)",
    sindicato: "SUTERH / FATERYH",
    sector: "Propiedad Horizontal",
    tipoJornada: "mensual",
    horasSemana: 40,
    descripcion:
      "Aplica a encargados, mayordomos y personal de edificios de renta y propiedad horizontal (CCT 589/10).",
    vigencia: "Acuerdo julio 2026",
    categorias: [
      { id: "encargado_4ta_vivienda", nombre: "Encargado 4ª Cat. (con vivienda)", salarioBasico: 978_275, descripcion: "4ª categoría, con vivienda" },
      { id: "encargado_3ra_vivienda", nombre: "Encargado 3ª Cat. (con vivienda)", salarioBasico: 1_076_103, descripcion: "3ª categoría, con vivienda" },
      { id: "encargado_2da_vivienda", nombre: "Encargado 2ª Cat. (con vivienda)", salarioBasico: 1_125_017, descripcion: "2ª categoría, con vivienda" },
      { id: "encargado_1ra_vivienda", nombre: "Encargado 1ª Cat. (con vivienda)", salarioBasico: 1_173_930, descripcion: "1ª categoría, con vivienda" },
      { id: "encargado_4ta_sin_vivienda", nombre: "Encargado 4ª Cat. (sin vivienda)", salarioBasico: 1_123_693, descripcion: "4ª categoría, sin vivienda" },
      { id: "encargado_1ra_sin_vivienda", nombre: "Encargado 1ª Cat. (sin vivienda)", salarioBasico: 1_348_432, descripcion: "1ª categoría, sin vivienda" },
      { id: "mayordomo", nombre: "Mayordomo (sin vivienda)", salarioBasico: 1_396_203, descripcion: "Mayordomo, sin vivienda, 1ª categoría" },
      { id: "intendente", nombre: "Intendente", salarioBasico: 1_638_992, descripcion: "Intendente de edificio (todas las categorías)" },
      { id: "vigilancia_nocturna", nombre: "Vigilancia Nocturna", salarioBasico: 1_202_729, descripcion: "Personal de vigilancia nocturna" },
      { id: "ayudante_media_jornada", nombre: "Ayudante Media Jornada", salarioBasico: 674_216, descripcion: "Ayudante, media jornada, 1ª categoría" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad, calculado sobre el básico" },
      { id: "retiro_residuos", nombre: "Retiro y Clasificación de Residuos", tipo: "fijo", valor: 45_000, base: "basico", obligatorio: false, descripcion: "Plus por retiro y clasificación de residuos (monto de referencia, varía por edificio)" },
      { id: "limpieza_cocheras", nombre: "Limpieza de Cocheras", tipo: "fijo", valor: 35_000, base: "basico", obligatorio: false, descripcion: "Plus por limpieza de cocheras (monto de referencia)" },
      { id: "snr_julio2026", nombre: "Suma Remunerativa Julio 2026", tipo: "fijo", valor: 30_000, base: "basico", obligatorio: false, descripcion: "Suma remunerativa mensual incorporada en julio 2026 (jornada completa; proporcional en otros casos)" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // TRANSPORTE DE PASAJEROS — COLECTIVOS (UTA)
  // ─────────────────────────────────────────────────────────
  {
    id: "transporte_pasajeros",
    numero: "460/73",
    nombre: "Transporte de Pasajeros (UTA)",
    sindicato: "UTA",
    sector: "Transporte Automotor de Pasajeros",
    tipoJornada: "mensual",
    horasSemana: 48,
    descripcion:
      "Aplica a choferes, guardas, inspectores y personal de taller de empresas de transporte público de pasajeros (colectivos).",
    vigencia: "Escala AMBA — básico abril 2026 (paritaria de julio en negociación)",
    categorias: [
      { id: "conductor_urbano", nombre: "Conductor Urbano", salarioBasico: 1_545_278, descripcion: "Chofer de colectivo, servicios urbanos y suburbanos (AMBA)" },
      { id: "conductor_interurbano", nombre: "Conductor Interurbano", salarioBasico: 1_622_500, descripcion: "Chofer de corta y media distancia" },
      { id: "conductor_larga_distancia", nombre: "Conductor Larga Distancia", salarioBasico: 1_777_000, descripcion: "Chofer de larga distancia (más de 300 km)" },
      { id: "guarda_inspector", nombre: "Guarda / Inspector", salarioBasico: 1_390_750, descripcion: "Guarda o inspector de servicio" },
      { id: "encargado_taller_uta", nombre: "Encargado de Taller", salarioBasico: 1_699_800, descripcion: "Encargado de taller y mantenimiento" },
      { id: "mecanico_1ra_uta", nombre: "Mecánico de 1ª", salarioBasico: 1_622_500, descripcion: "Mecánico de primera" },
      { id: "mecanico_2da_uta", nombre: "Mecánico de 2ª", salarioBasico: 1_421_650, descripcion: "Mecánico de segunda" },
      { id: "ayudante_mecanico_uta", nombre: "Ayudante de Mecánico", salarioBasico: 1_158_950, descripcion: "Ayudante de mecánico" },
      { id: "administrativo_transporte", nombre: "Administrativo", salarioBasico: 1_313_500, descripcion: "Personal administrativo de la empresa de transporte" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% del básico por año, sin tope de años" },
      { id: "viaticos_transporte", nombre: "Viáticos", tipo: "fijo", valor: 456_000, base: "basico", obligatorio: false, descripcion: "Viáticos mensuales (referencia abril 2026)" },
      { id: "nocturnidad_transporte", nombre: "Nocturnidad (21 a 6 hs)", tipo: "porcentaje", valor: 30, base: "basico", obligatorio: false, descripcion: "Recargo por trabajo nocturno" },
      { id: "feriado_transporte", nombre: "Feriados Trabajados", tipo: "porcentaje", valor: 100, base: "basico", obligatorio: false, descripcion: "Recargo por trabajo en feriados nacionales" },
      { id: "presentismo_transporte", nombre: "Presentismo", tipo: "porcentaje", valor: 8.33, base: "basico", obligatorio: false, descripcion: "Premio por presentismo (varía según empresa)" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // ESTACIONES DE SERVICIO, GNC, GARAGES Y LAVADEROS (SOESGyPE)
  // ─────────────────────────────────────────────────────────
  {
    id: "estaciones_servicio",
    numero: "521/07",
    nombre: "Estaciones de Servicio, GNC y Lavaderos (SOESGyPE)",
    sindicato: "SOESGyPE",
    sector: "Combustibles y Servicios Automotor",
    tipoJornada: "mensual",
    horasSemana: 48,
    descripcion:
      "Aplica a playeros, operadores de servicio, administrativos y encargados de estaciones de servicio, GNC, garages, playas de estacionamiento y lavaderos.",
    vigencia: "Escala julio 2026 (SOESGyPE-FECRA), vigente hasta el 31/07/2026",
    categorias: [
      { id: "operador_auxiliar_est", nombre: "Operador Auxiliar", salarioBasico: 1_502_600, descripcion: "Personal de ingreso, tareas auxiliares" },
      { id: "operador_playa", nombre: "Operador de Playa (Playero)", salarioBasico: 1_545_472, descripcion: "Despacho de combustible y atención al surtidor" },
      { id: "operador_conductor_est", nombre: "Operador Conductor", salarioBasico: 1_534_970, descripcion: "Conducción de vehículos dentro del predio" },
      { id: "operador_servicio", nombre: "Operador de Servicio", salarioBasico: 1_564_269, descripcion: "Lavado, engrase y servicios adicionales" },
      { id: "administrativo_est", nombre: "Administrativo", salarioBasico: 1_570_824, descripcion: "Personal administrativo de la estación" },
      { id: "encargado_est", nombre: "Encargado", salarioBasico: 1_600_406, descripcion: "Responsable del turno o del establecimiento" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "presentismo_est", nombre: "Presentismo", tipo: "porcentaje", valor: 8.33, base: "basico", obligatorio: false, descripcion: "Premio mensual por asistencia perfecta" },
      { id: "nocturnidad_est", nombre: "Nocturnidad", tipo: "porcentaje", valor: 20, base: "basico", obligatorio: false, descripcion: "Recargo por trabajo nocturno" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // INDUSTRIA GRÁFICA (FAIGA / FGB / FATIDA)
  // ─────────────────────────────────────────────────────────
  {
    id: "grafica",
    numero: "60/89 y 409/05",
    nombre: "Industria Gráfica (FAIGA / FGB / FATIDA)",
    sindicato: "Federación Gráfica Bonaerense / FATIDA",
    sector: "Industria Gráfica",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a operarios de imprenta, encuadernación, diarios y afines. Escala verificada a marzo 2026 (última tabla en texto homologada); la actualización abril-junio 2026 está firmada pero FGB solo la publicó en formato imagen, sin cifras verificables carácter por carácter — ajustar cuando se publique en texto.",
    vigencia: "Escala marzo 2026 (verificada) — acuerdo abril-junio 2026 homologado, pendiente de publicación en texto",
    categorias: [
      { id: "grafico_cat_01", nombre: "Categoría 1", salarioBasico: 1_018_377, descripcion: "Categoría inicial del escalafón" },
      { id: "grafico_cat_03", nombre: "Categoría 3", salarioBasico: 1_095_364, descripcion: "Tareas de complejidad básica" },
      { id: "grafico_cat_05", nombre: "Categoría 5", salarioBasico: 1_238_242, descripcion: "Operario con oficio medio" },
      { id: "grafico_cat_07", nombre: "Categoría 7", salarioBasico: 1_438_356, descripcion: "Operario calificado" },
      { id: "grafico_cat_09", nombre: "Categoría 9", salarioBasico: 1_676_248, descripcion: "Oficial especializado" },
      { id: "grafico_cat_10", nombre: "Categoría 10", salarioBasico: 1_823_909, descripcion: "Categoría máxima del escalafón" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "El sistema aplica 1% por año; el CCT real pacta un monto fijo por antigüedad ($12.856 a marzo 2026) — ajustar manualmente si necesitás ese valor exacto" },
      { id: "comida_grafico", nombre: "Comida", tipo: "fijo", valor: 11_580, base: "basico", obligatorio: false, descripcion: "Adicional fijo por comida (marzo 2026)" },
      { id: "aporte_solidario_grafico", nombre: "Aporte Solidario", tipo: "porcentaje", valor: 1.5, base: "bruto", obligatorio: true, descripcion: "1,5% sobre la remuneración integral mensual, previsto en el acuerdo paritario" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // INDUSTRIA DEL PLÁSTICO (UOYEP)
  // ─────────────────────────────────────────────────────────
  {
    id: "plastico",
    numero: "797/22",
    nombre: "Industria del Plástico (UOYEP)",
    sindicato: "UOYEP",
    sector: "Industria del Plástico",
    tipoJornada: "mensual",
    horasSemana: 44,
    descripcion:
      "Aplica a operarios de producción, mantenimiento, choferes y personal administrativo de plantas de la industria plástica. El personal de producción y mantenimiento cobra por hora; los básicos aquí son el equivalente mensual (valor hora × 200).",
    vigencia: "Escala julio 2026 (UOYEP-CAIP, Anexo I), vigente hasta el 31/07/2026",
    categorias: [
      { id: "operario_plastico", nombre: "Operario", salarioBasico: 1_229_122, jornal: 6_146, descripcion: "Producción — nivel inicial (valor hora × 200)" },
      { id: "auxiliar_plastico", nombre: "Auxiliar", salarioBasico: 1_325_338, jornal: 6_627, descripcion: "Producción — tareas auxiliares (valor hora × 200)" },
      { id: "operador_plastico", nombre: "Operador", salarioBasico: 1_426_222, jornal: 7_131, descripcion: "Producción — manejo de máquina (valor hora × 200)" },
      { id: "operador_calificado_plastico", nombre: "Operador Calificado", salarioBasico: 1_490_022, jornal: 7_450, descripcion: "Producción — mayor especialización (valor hora × 200)" },
      { id: "oficial_mantenimiento_plastico", nombre: "Oficial de Mantenimiento", salarioBasico: 1_723_268, jornal: 8_616, descripcion: "Mantenimiento — máxima categoría técnica (valor hora × 200)" },
      { id: "nivel1_plastico", nombre: "Administrativo Nivel 1", salarioBasico: 1_229_441, descripcion: "Personal administrativo — nivel inicial" },
      { id: "nivel3_plastico", nombre: "Administrativo Nivel 3", salarioBasico: 1_318_253, descripcion: "Personal administrativo — nivel intermedio" },
      { id: "nivel5_plastico", nombre: "Administrativo Nivel 5", salarioBasico: 1_508_177, descripcion: "Personal administrativo — nivel superior" },
      { id: "capataz_plastico", nombre: "Capataz", salarioBasico: 1_539_675, descripcion: "Supervisor de planta" },
      { id: "chofer_plastico", nombre: "Chofer", salarioBasico: 1_382_061, descripcion: "Transporte pesado o interno de planta" },
      { id: "conductor_autoelevador_plastico", nombre: "Conductor de Autoelevador", salarioBasico: 1_543_313, descripcion: "Conducción de autoelevador dentro de planta" },
    ],
    adicionales: [
      { id: "antiguedad", nombre: "Antigüedad", tipo: "porcentaje", valor: 1, base: "basico", obligatorio: true, descripcion: "1% por año de antigüedad" },
      { id: "snr_plastico_julio2026", nombre: "Suma Fija No Remunerativa", tipo: "fijo", valor: 85_000, base: "basico", obligatorio: true, descripcion: "Suma fija para todas las categorías, vigente hasta julio 2026; se incorpora al básico desde agosto 2026" },
    ],
  },
];

// ============================================================
// MOTOR DE LIQUIDACIÓN
// ============================================================

export interface DatosLiquidacion {
  convenioId: string;
  categoriaId: string;
  antiguedad: number; // años
  horasExtras50: number;
  horasExtras100: number;
  presentismo: boolean;
  adicionales: string[]; // IDs de adicionales seleccionados
  periodo: string; // "YYYY-MM"
  diasTrabajados: number; // 30 = mes completo
  tipoEmpleador: "grande" | "pyme"; // Para contribuciones patronales
  adicionalesPersonalizados: AdicionalesPersonalizados;
  // ── Fuera de Convenio ─────────────────────────────────────
  // Cuando fueraConvenio = true, se ignora convenio/categoría y se
  // usa el básico manual ingresado por el usuario.
  fueraConvenio?: boolean;
  basicoManual?: number; // Salario básico bruto mensual manual
}

export interface AdicionalesPersonalizados {
  noRemunerativo: number;
  comisiones: number;
  viaticos: number;
  otros: number;
}

export interface ConceptoLiquidacion {
  id: string;
  nombre: string;
  tipo: "remunerativo" | "no_remunerativo" | "deduccion";
  monto: number;
  descripcion: string;
  base?: number;
  porcentaje?: number;
}

export interface ResultadoLiquidacion {
  periodo: string;
  convenio: Convenio;
  categoria: Categoria;
  conceptos: ConceptoLiquidacion[];
  totalBruto: number;
  totalBrutoRemunerativo: number;
  totalNoRemunerativo: number;
  totalDeducciones: number;
  totalNeto: number;
  costoEmpleador: number;
  aportes: {
    jubilacion: number;
    pami: number;
    obraSocial: number;
    sindical: number;
    total: number;
  };
  contribuciones: {
    jubilacion: number;
    pami: number;
    obraSocial: number;
    fondoEmpleo: number;
    total: number;
  };
  aguinaldo: {
    devengado: number;
    cuota: number;
  };
}

// Convenio "virtual" utilizado para liquidaciones fuera de convenio.
export const CONVENIO_FUERA: Convenio = {
  id: "fuera_convenio",
  numero: "S/C",
  nombre: "Fuera de Convenio",
  sindicato: "—",
  sector: "Personal fuera de convenio",
  tipoJornada: "mensual",
  horasSemana: 48,
  descripcion:
    "Personal jerárquico o fuera de todo convenio colectivo. El salario básico se define manualmente.",
  vigencia: "—",
  categorias: [],
  adicionales: [],
};

export function calcularLiquidacion(datos: DatosLiquidacion): ResultadoLiquidacion {
  const esFueraConvenio = datos.fueraConvenio === true;

  const convenio = esFueraConvenio
    ? CONVENIO_FUERA
    : CONVENIOS.find((c) => c.id === datos.convenioId)!;

  const categoria: Categoria = esFueraConvenio
    ? {
        id: "fuera_convenio",
        nombre: "Sueldo básico manual",
        salarioBasico: datos.basicoManual ?? 0,
        descripcion: "Salario básico definido manualmente",
      }
    : convenio.categorias.find((c) => c.id === datos.categoriaId)!;

  const conceptos: ConceptoLiquidacion[] = [];

  // ── 1. SALARIO BÁSICO ──────────────────────────────────────
  let salarioBasico = categoria.salarioBasico;

  // Proporcional por días trabajados
  if (datos.diasTrabajados < 30) {
    salarioBasico = (salarioBasico / 30) * datos.diasTrabajados;
  }

  conceptos.push({
    id: "salario_basico",
    nombre: "Salario Básico",
    tipo: "remunerativo",
    monto: salarioBasico,
    descripcion: `${categoria.nombre} — ${convenio.nombre}`,
  });

  // ── 2. ANTIGÜEDAD ──────────────────────────────────────────
  if (datos.antiguedad > 0) {
    const montoAntiguedad = salarioBasico * (datos.antiguedad * 0.01);
    conceptos.push({
      id: "antiguedad",
      nombre: `Antigüedad (${datos.antiguedad} año${datos.antiguedad > 1 ? "s" : ""})`,
      tipo: "remunerativo",
      monto: montoAntiguedad,
      descripcion: `1% del básico por cada año de antigüedad`,
      base: salarioBasico,
      porcentaje: datos.antiguedad,
    });
  }

  // ── 3. PRESENTISMO ─────────────────────────────────────────
  if (datos.presentismo) {
    const adicionalPresentismo = convenio.adicionales.find((a) => a.id.includes("presentismo"));
    const pct = adicionalPresentismo?.valor ?? 8.33;
    const montoPresentismo = salarioBasico * (pct / 100);
    conceptos.push({
      id: "presentismo",
      nombre: "Presentismo",
      tipo: "remunerativo",
      monto: montoPresentismo,
      descripcion: `${pct}% del salario básico`,
      base: salarioBasico,
      porcentaje: pct,
    });
  }

  // ── 4. HORAS EXTRAS ────────────────────────────────────────
  const valorHoraNormal = salarioBasico / (convenio.horasSemana * 4.33);

  if (datos.horasExtras50 > 0) {
    const montoHE50 = valorHoraNormal * 1.5 * datos.horasExtras50;
    conceptos.push({
      id: "horas_extras_50",
      nombre: `Horas Extras 50% (${datos.horasExtras50} hs)`,
      tipo: "remunerativo",
      monto: montoHE50,
      descripcion: `Valor hora: $${formatMonto(valorHoraNormal)} × 1.5 × ${datos.horasExtras50} hs`,
    });
  }

  if (datos.horasExtras100 > 0) {
    const montoHE100 = valorHoraNormal * 2 * datos.horasExtras100;
    conceptos.push({
      id: "horas_extras_100",
      nombre: `Horas Extras 100% (${datos.horasExtras100} hs)`,
      tipo: "remunerativo",
      monto: montoHE100,
      descripcion: `Valor hora: $${formatMonto(valorHoraNormal)} × 2 × ${datos.horasExtras100} hs`,
    });
  }

  // ── 5. ADICIONALES DEL CCT SELECCIONADOS ──────────────────
  for (const adicionalId of datos.adicionales) {
    const adicional = convenio.adicionales.find((a) => a.id === adicionalId);
    if (!adicional || adicional.id === "antiguedad" || adicional.id.includes("presentismo")) continue;

    let monto = 0;
    if (adicional.tipo === "porcentaje") {
      const base = adicional.base === "bruto" ? salarioBasico : salarioBasico;
      monto = base * (adicional.valor / 100);
    } else if (adicional.tipo === "fijo") {
      monto = adicional.valor;
    }

    conceptos.push({
      id: adicional.id,
      nombre: adicional.nombre,
      tipo: "remunerativo",
      monto,
      descripcion: adicional.descripcion,
      porcentaje: adicional.tipo === "porcentaje" ? adicional.valor : undefined,
    });
  }

  // ── 6. ADICIONALES PERSONALIZADOS ─────────────────────────
  if (datos.adicionalesPersonalizados.comisiones > 0) {
    conceptos.push({
      id: "comisiones",
      nombre: "Comisiones",
      tipo: "remunerativo",
      monto: datos.adicionalesPersonalizados.comisiones,
      descripcion: "Comisiones por ventas u objetivos",
    });
  }

  if (datos.adicionalesPersonalizados.noRemunerativo > 0) {
    conceptos.push({
      id: "no_remunerativo",
      nombre: "Suma No Remunerativa",
      tipo: "no_remunerativo",
      monto: datos.adicionalesPersonalizados.noRemunerativo,
      descripcion: "Suma fija no remunerativa (no tributa aportes)",
    });
  }

  if (datos.adicionalesPersonalizados.viaticos > 0) {
    conceptos.push({
      id: "viaticos",
      nombre: "Viáticos",
      tipo: "no_remunerativo",
      monto: datos.adicionalesPersonalizados.viaticos,
      descripcion: "Viáticos y gastos de representación (no remunerativo)",
    });
  }

  if (datos.adicionalesPersonalizados.otros > 0) {
    conceptos.push({
      id: "otros_adicionales",
      nombre: "Otros Adicionales",
      tipo: "remunerativo",
      monto: datos.adicionalesPersonalizados.otros,
      descripcion: "Otros adicionales remunerativos",
    });
  }

  // ── 7. CÁLCULO DE TOTALES ──────────────────────────────────
  const totalBrutoRemunerativo = conceptos
    .filter((c) => c.tipo === "remunerativo")
    .reduce((acc, c) => acc + c.monto, 0);

  const totalNoRemunerativo = conceptos
    .filter((c) => c.tipo === "no_remunerativo")
    .reduce((acc, c) => acc + c.monto, 0);

  const totalBruto = totalBrutoRemunerativo + totalNoRemunerativo;

  // ── 8. APORTES DEL EMPLEADO ────────────────────────────────
  // Los aportes se calculan sobre la base remunerativa (con tope)
  const baseImponibleJubilacion = Math.min(totalBrutoRemunerativo, TOPE_BASE_IMPONIBLE_JUBILACION);

  const aportesJubilacion = baseImponibleJubilacion * APORTES_EMPLEADO.jubilacion;
  const aportesPami = totalBrutoRemunerativo * APORTES_EMPLEADO.pami;
  const aportesObraSocial = totalBrutoRemunerativo * APORTES_EMPLEADO.obraSocial;
  // El personal fuera de convenio no está afiliado a ningún gremio, por lo
  // que no corresponde descontarle cuota sindical.
  const aportesSindical = esFueraConvenio ? 0 : totalBrutoRemunerativo * APORTE_SINDICAL;

  const totalAportes = aportesJubilacion + aportesPami + aportesObraSocial + aportesSindical;

  // Agregar deducciones a conceptos
  conceptos.push({
    id: "aporte_jubilacion",
    nombre: "Aporte Jubilación (11%)",
    tipo: "deduccion",
    monto: aportesJubilacion,
    descripcion: "SIPA — Sistema Integrado Previsional Argentino",
    base: baseImponibleJubilacion,
    porcentaje: 11,
  });

  conceptos.push({
    id: "aporte_pami",
    nombre: "Aporte PAMI (3%)",
    tipo: "deduccion",
    monto: aportesPami,
    descripcion: "INSSJP — Instituto Nacional de Servicios Sociales para Jubilados",
    base: totalBrutoRemunerativo,
    porcentaje: 3,
  });

  conceptos.push({
    id: "aporte_obra_social",
    nombre: "Aporte Obra Social (3%)",
    tipo: "deduccion",
    monto: aportesObraSocial,
    descripcion: "Aporte a la obra social del convenio",
    base: totalBrutoRemunerativo,
    porcentaje: 3,
  });

  if (!esFueraConvenio) {
    conceptos.push({
      id: "cuota_sindical",
      nombre: "Cuota Sindical (2%)",
      tipo: "deduccion",
      monto: aportesSindical,
      descripcion: `Cuota sindical — ${convenio.sindicato}`,
      base: totalBrutoRemunerativo,
      porcentaje: 2,
    });
  }

  const totalDeducciones = totalAportes;
  const totalNeto = totalBruto - totalDeducciones;

  // ── 9. CONTRIBUCIONES PATRONALES ──────────────────────────
  const alicuotaContrib = datos.tipoEmpleador === "pyme" ? 0.18 : 0.204;

  // La alícuota total (18% PyME / 20.4% grande) se distribuye entre los
  // componentes manteniendo su proporción relativa, de modo que la suma
  // de los componentes sea siempre igual al total.
  const sumaAlicuotasBase =
    CONTRIBUCIONES_EMPLEADOR.jubilacion +
    CONTRIBUCIONES_EMPLEADOR.pami +
    CONTRIBUCIONES_EMPLEADOR.obraSocial +
    CONTRIBUCIONES_EMPLEADOR.fondoEmpleo; // 25.5%
  const factorContrib = alicuotaContrib / sumaAlicuotasBase;

  const totalContribuciones = totalBrutoRemunerativo * alicuotaContrib;
  const contribJubilacion = totalBrutoRemunerativo * CONTRIBUCIONES_EMPLEADOR.jubilacion * factorContrib;
  const contribPami = totalBrutoRemunerativo * CONTRIBUCIONES_EMPLEADOR.pami * factorContrib;
  const contribObraSocial = totalBrutoRemunerativo * CONTRIBUCIONES_EMPLEADOR.obraSocial * factorContrib;
  const contribFondoEmpleo = totalBrutoRemunerativo * CONTRIBUCIONES_EMPLEADOR.fondoEmpleo * factorContrib;

  const costoEmpleador = totalBruto + totalContribuciones + SEGURO_VIDA_OBLIGATORIO;

  // ── 10. AGUINALDO DEVENGADO ────────────────────────────────
  const aguinaldoDevengado = totalBrutoRemunerativo / 12;
  const aguinaldoCuota = totalBrutoRemunerativo / 2;

  return {
    periodo: datos.periodo,
    convenio,
    categoria,
    conceptos,
    totalBruto,
    totalBrutoRemunerativo,
    totalNoRemunerativo,
    totalDeducciones,
    totalNeto,
    costoEmpleador,
    aportes: {
      jubilacion: aportesJubilacion,
      pami: aportesPami,
      obraSocial: aportesObraSocial,
      sindical: aportesSindical,
      total: totalAportes,
    },
    contribuciones: {
      jubilacion: contribJubilacion,
      pami: contribPami,
      obraSocial: contribObraSocial,
      fondoEmpleo: contribFondoEmpleo,
      total: totalContribuciones,
    },
    aguinaldo: {
      devengado: aguinaldoDevengado,
      cuota: aguinaldoCuota,
    },
  };
}

// ============================================================
// UTILIDADES
// ============================================================

export function formatMonto(monto: number): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto);
}

export function formatMontoCompacto(monto: number): string {
  if (monto >= 1_000_000) {
    return `$${(monto / 1_000_000).toFixed(2)}M`;
  }
  if (monto >= 1_000) {
    return `$${(monto / 1_000).toFixed(0)}K`;
  }
  return `$${formatMonto(monto)}`;
}

export function getPeriodoActual(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function formatPeriodo(periodo: string): string {
  const [year, month] = periodo.split("-");
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  return `${meses[parseInt(month) - 1]} ${year}`;
}