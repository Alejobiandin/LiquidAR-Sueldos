// ============================================================
// LiquidAR — Liquidación por Nómina (Masiva / Batch)
// Parseo de archivos CSV / XLSX, validación y cálculo a gran escala.
// ============================================================

import * as XLSX from "xlsx";
import {
  CONVENIOS,
  calcularLiquidacion,
  getPeriodoActual,
  type DatosLiquidacion,
  type ResultadoLiquidacion,
} from "@/lib/convenios";

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

/** Un empleado tal como viene en una fila del archivo importado. */
export interface EmpleadoNomina {
  fila: number; // Número de fila del archivo (para reportar errores)
  legajo: string;
  apellido: string;
  nombre: string;
  cuil: string;
  convenioId: string; // id de CCT o "fuera_convenio"
  categoriaId: string;
  basicoManual: number; // Sólo para fuera de convenio
  antiguedad: number;
  presentismo: boolean;
  diasTrabajados: number;
  horasExtras50: number;
  horasExtras100: number;
  comisiones: number;
  noRemunerativo: number;
  viaticos: number;
  otros: number;
  tipoEmpleador: "grande" | "pyme";
}

/** Resultado de la liquidación de un empleado dentro de la nómina. */
export interface LiquidacionNominaItem {
  empleado: EmpleadoNomina;
  resultado: ResultadoLiquidacion;
}

/** Error de validación de una fila. */
export interface ErrorNomina {
  fila: number;
  campo: string;
  mensaje: string;
}

/** Resultado del parseo + liquidación de todo el archivo. */
export interface ResultadoNomina {
  periodo: string;
  items: LiquidacionNominaItem[];
  errores: ErrorNomina[];
  totales: TotalesNomina;
}

/** Sumatoria de toda la nómina, incluyendo cargas sociales. */
export interface TotalesNomina {
  cantidadEmpleados: number;
  totalBruto: number;
  totalRemunerativo: number;
  totalNoRemunerativo: number;
  totalNeto: number;
  totalAportes: number; // Aportes del empleado (retenciones)
  // ── Cargas sociales (a cargo del empleador) ──
  cargasSociales: {
    jubilacion: number;
    pami: number;
    obraSocial: number;
    fondoEmpleo: number;
    total: number;
  };
  totalCostoEmpleador: number;
  totalSacDevengado: number;
}

// ─────────────────────────────────────────────────────────────
// Plantilla
// ─────────────────────────────────────────────────────────────

/** Columnas esperadas en el archivo (en orden). */
export const COLUMNAS_NOMINA = [
  "legajo",
  "apellido",
  "nombre",
  "cuil",
  "convenio",
  "categoria",
  "basico_manual",
  "antiguedad",
  "presentismo",
  "dias_trabajados",
  "horas_extras_50",
  "horas_extras_100",
  "comisiones",
  "no_remunerativo",
  "viaticos",
  "otros",
  "tipo_empleador",
] as const;

/** Fila de ejemplo para la plantilla descargable. */
const FILAS_EJEMPLO: (string | number)[][] = [
  [
    "1001",
    "García",
    "Juan",
    "20-12345678-9",
    "comercio",
    "vendedor_b",
    "",
    3,
    "si",
    30,
    0,
    0,
    0,
    0,
    0,
    0,
    "grande",
  ],
  [
    "1002",
    "Pérez",
    "María",
    "27-98765432-1",
    "construccion",
    "oficial",
    "",
    5,
    "no",
    30,
    10,
    2,
    0,
    0,
    0,
    0,
    "pyme",
  ],
  [
    "2001",
    "Gerente",
    "Ana",
    "27-11111111-1",
    "fuera_convenio",
    "",
    3500000,
    8,
    "si",
    30,
    0,
    0,
    500000,
    0,
    0,
    0,
    "grande",
  ],
];

/**
 * Genera y descarga una plantilla (CSV o XLSX) con las columnas esperadas
 * y filas de ejemplo.
 */
export function descargarPlantilla(formato: "csv" | "xlsx"): void {
  const encabezado = [...COLUMNAS_NOMINA];
  const datos = [encabezado, ...FILAS_EJEMPLO];

  const ws = XLSX.utils.aoa_to_sheet(datos);

  if (formato === "csv") {
    const csv = XLSX.utils.sheet_to_csv(ws);
    descargarBlob(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
      "plantilla_nomina_liquidar.csv"
    );
  } else {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nómina");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    descargarBlob(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "plantilla_nomina_liquidar.xlsx"
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Parseo de archivos
// ─────────────────────────────────────────────────────────────

/**
 * Lee un archivo (CSV o XLSX) y devuelve las filas como objetos crudos
 * mapeados por nombre de columna.
 */
export async function parsearArchivoNomina(
  file: File
): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const primeraHoja = wb.SheetNames[0];
  if (!primeraHoja) return [];
  const ws = wb.Sheets[primeraHoja];
  // defval "" para que las celdas vacías no se omitan
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
}

// ─────────────────────────────────────────────────────────────
// Utilidades de coerción
// ─────────────────────────────────────────────────────────────

function normalizarClave(k: string): string {
  return k
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // sacar acentos
    .replace(/[\s.-]+/g, "_");
}

/** Devuelve el valor de una fila buscando por varias claves posibles. */
function leerCampo(
  fila: Record<string, unknown>,
  claves: string[]
): unknown {
  const normalizado: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fila)) {
    normalizado[normalizarClave(k)] = v;
  }
  for (const clave of claves) {
    const val = normalizado[normalizarClave(clave)];
    if (val !== undefined && val !== "") return val;
  }
  return undefined;
}

function aNumero(valor: unknown, porDefecto = 0): number {
  if (valor === undefined || valor === null || valor === "") return porDefecto;
  if (typeof valor === "number") return isFinite(valor) ? valor : porDefecto;
  const limpio = valor
    .toString()
    .trim()
    .replace(/\$/g, "")
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "") // separador de miles
    .replace(",", ".");
  const n = parseFloat(limpio);
  return isFinite(n) ? n : porDefecto;
}

function aBooleano(valor: unknown, porDefecto = true): boolean {
  if (valor === undefined || valor === null || valor === "") return porDefecto;
  const s = valor.toString().trim().toLowerCase();
  if (["si", "sí", "s", "true", "1", "x", "yes", "y"].includes(s)) return true;
  if (["no", "n", "false", "0", ""].includes(s)) return false;
  return porDefecto;
}

function aTexto(valor: unknown): string {
  if (valor === undefined || valor === null) return "";
  return valor.toString().trim();
}

// ─────────────────────────────────────────────────────────────
// Mapeo fila → EmpleadoNomina (con validación)
// ─────────────────────────────────────────────────────────────

function mapearFila(
  fila: Record<string, unknown>,
  index: number
): { empleado: EmpleadoNomina; errores: ErrorNomina[] } {
  const numeroFila = index + 2; // +2 = encabezado + base 1
  const errores: ErrorNomina[] = [];

  const convenioIdRaw = aTexto(leerCampo(fila, ["convenio", "convenio_id", "cct"])).toLowerCase();
  const esFuera =
    convenioIdRaw === "fuera_convenio" ||
    convenioIdRaw === "fuera de convenio" ||
    convenioIdRaw === "s/c" ||
    convenioIdRaw === "";

  const convenioId = esFuera ? "fuera_convenio" : convenioIdRaw;
  const categoriaId = aTexto(leerCampo(fila, ["categoria", "categoria_id", "cat"]));
  const basicoManual = aNumero(leerCampo(fila, ["basico_manual", "basico", "sueldo_basico"]));

  // ── Validación de convenio / categoría ──
  if (esFuera) {
    if (basicoManual <= 0) {
      errores.push({
        fila: numeroFila,
        campo: "basico_manual",
        mensaje: "Fuera de convenio requiere un básico manual mayor a 0.",
      });
    }
  } else {
    const convenio = CONVENIOS.find((c) => c.id === convenioId);
    if (!convenio) {
      errores.push({
        fila: numeroFila,
        campo: "convenio",
        mensaje: `Convenio "${convenioIdRaw}" no reconocido. Usá un id válido o "fuera_convenio".`,
      });
    } else {
      const cat = convenio.categorias.find((c) => c.id === categoriaId);
      if (!cat) {
        errores.push({
          fila: numeroFila,
          campo: "categoria",
          mensaje: `Categoría "${categoriaId}" no existe en el convenio "${convenioId}".`,
        });
      }
    }
  }

  const empleado: EmpleadoNomina = {
    fila: numeroFila,
    legajo: aTexto(leerCampo(fila, ["legajo", "id"])),
    apellido: aTexto(leerCampo(fila, ["apellido"])),
    nombre: aTexto(leerCampo(fila, ["nombre"])),
    cuil: aTexto(leerCampo(fila, ["cuil", "cuit"])),
    convenioId,
    categoriaId,
    basicoManual,
    antiguedad: Math.max(0, Math.round(aNumero(leerCampo(fila, ["antiguedad", "antiguedad_anios"])))),
    presentismo: aBooleano(leerCampo(fila, ["presentismo"]), true),
    diasTrabajados: (() => {
      const d = Math.round(aNumero(leerCampo(fila, ["dias_trabajados", "dias"]), 30));
      return Math.min(31, Math.max(1, d || 30));
    })(),
    horasExtras50: Math.max(0, aNumero(leerCampo(fila, ["horas_extras_50", "he_50", "hs_50"]))),
    horasExtras100: Math.max(0, aNumero(leerCampo(fila, ["horas_extras_100", "he_100", "hs_100"]))),
    comisiones: Math.max(0, aNumero(leerCampo(fila, ["comisiones"]))),
    noRemunerativo: Math.max(0, aNumero(leerCampo(fila, ["no_remunerativo", "no_rem"]))),
    viaticos: Math.max(0, aNumero(leerCampo(fila, ["viaticos", "viáticos"]))),
    otros: Math.max(0, aNumero(leerCampo(fila, ["otros", "otros_adicionales"]))),
    tipoEmpleador:
      aTexto(leerCampo(fila, ["tipo_empleador", "empleador"])).toLowerCase() === "pyme"
        ? "pyme"
        : "grande",
  };

  return { empleado, errores };
}

// ─────────────────────────────────────────────────────────────
// Cálculo de la nómina completa
// ─────────────────────────────────────────────────────────────

function empleadoADatos(emp: EmpleadoNomina, periodo: string): DatosLiquidacion {
  const esFuera = emp.convenioId === "fuera_convenio";
  return {
    convenioId: esFuera ? "comercio" : emp.convenioId, // convenioId dummy; ignorado si fueraConvenio
    categoriaId: emp.categoriaId,
    antiguedad: emp.antiguedad,
    horasExtras50: emp.horasExtras50,
    horasExtras100: emp.horasExtras100,
    presentismo: emp.presentismo,
    adicionales: [],
    periodo,
    diasTrabajados: emp.diasTrabajados,
    tipoEmpleador: emp.tipoEmpleador,
    adicionalesPersonalizados: {
      noRemunerativo: emp.noRemunerativo,
      comisiones: emp.comisiones,
      viaticos: emp.viaticos,
      otros: emp.otros,
    },
    fueraConvenio: esFuera,
    basicoManual: esFuera ? emp.basicoManual : undefined,
  };
}

/**
 * Procesa filas crudas (de parsearArchivoNomina) y liquida a todos los
 * empleados válidos, acumulando los totales de la nómina.
 */
export function liquidarNomina(
  filas: Record<string, unknown>[],
  periodo: string = getPeriodoActual()
): ResultadoNomina {
  const items: LiquidacionNominaItem[] = [];
  const errores: ErrorNomina[] = [];

  filas.forEach((fila, index) => {
    // Saltar filas totalmente vacías
    const tieneAlgo = Object.values(fila).some(
      (v) => v !== undefined && v !== null && v.toString().trim() !== ""
    );
    if (!tieneAlgo) return;

    const { empleado, errores: erroresFila } = mapearFila(fila, index);
    if (erroresFila.length > 0) {
      errores.push(...erroresFila);
      return; // No liquidar filas con errores
    }

    try {
      const resultado = calcularLiquidacion(empleadoADatos(empleado, periodo));
      items.push({ empleado, resultado });
    } catch (e) {
      errores.push({
        fila: empleado.fila,
        campo: "general",
        mensaje: `Error al liquidar: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  });

  return {
    periodo,
    items,
    errores,
    totales: calcularTotales(items),
  };
}

function calcularTotales(items: LiquidacionNominaItem[]): TotalesNomina {
  const acc: TotalesNomina = {
    cantidadEmpleados: items.length,
    totalBruto: 0,
    totalRemunerativo: 0,
    totalNoRemunerativo: 0,
    totalNeto: 0,
    totalAportes: 0,
    cargasSociales: {
      jubilacion: 0,
      pami: 0,
      obraSocial: 0,
      fondoEmpleo: 0,
      total: 0,
    },
    totalCostoEmpleador: 0,
    totalSacDevengado: 0,
  };

  for (const { resultado: r } of items) {
    acc.totalBruto += r.totalBruto;
    acc.totalRemunerativo += r.totalBrutoRemunerativo;
    acc.totalNoRemunerativo += r.totalNoRemunerativo;
    acc.totalNeto += r.totalNeto;
    acc.totalAportes += r.aportes.total;
    acc.cargasSociales.jubilacion += r.contribuciones.jubilacion;
    acc.cargasSociales.pami += r.contribuciones.pami;
    acc.cargasSociales.obraSocial += r.contribuciones.obraSocial;
    acc.cargasSociales.fondoEmpleo += r.contribuciones.fondoEmpleo;
    acc.cargasSociales.total += r.contribuciones.total;
    acc.totalCostoEmpleador += r.costoEmpleador;
    acc.totalSacDevengado += r.aguinaldo.devengado;
  }

  return acc;
}

// ─────────────────────────────────────────────────────────────
// Exportación de resultados
// ─────────────────────────────────────────────────────────────

/**
 * Exporta el resultado de la nómina liquidada a un archivo (CSV o XLSX)
 * con una fila por empleado más una fila de totales.
 */
export function exportarResultadoNomina(
  resultado: ResultadoNomina,
  formato: "csv" | "xlsx"
): void {
  const encabezado = [
    "Legajo",
    "Apellido",
    "Nombre",
    "CUIL",
    "Convenio",
    "Categoría",
    "Bruto Remunerativo",
    "No Remunerativo",
    "Bruto Total",
    "Aportes Empleado",
    "Neto a Cobrar",
    "Cargas Sociales (Empleador)",
    "Costo Total Empleador",
    "SAC Devengado",
  ];

  const filas = resultado.items.map(({ empleado, resultado: r }) => [
    empleado.legajo,
    empleado.apellido,
    empleado.nombre,
    empleado.cuil,
    r.convenio.nombre,
    r.categoria.nombre,
    redondear(r.totalBrutoRemunerativo),
    redondear(r.totalNoRemunerativo),
    redondear(r.totalBruto),
    redondear(r.aportes.total),
    redondear(r.totalNeto),
    redondear(r.contribuciones.total),
    redondear(r.costoEmpleador),
    redondear(r.aguinaldo.devengado),
  ]);

  const t = resultado.totales;
  const filaTotales = [
    "TOTALES",
    "",
    "",
    `${t.cantidadEmpleados} empleados`,
    "",
    "",
    redondear(t.totalRemunerativo),
    redondear(t.totalNoRemunerativo),
    redondear(t.totalBruto),
    redondear(t.totalAportes),
    redondear(t.totalNeto),
    redondear(t.cargasSociales.total),
    redondear(t.totalCostoEmpleador),
    redondear(t.totalSacDevengado),
  ];

  const datos = [encabezado, ...filas, [], filaTotales];
  const ws = XLSX.utils.aoa_to_sheet(datos);
  const nombreBase = `liquidacion_nomina_${resultado.periodo}`;

  if (formato === "csv") {
    const csv = XLSX.utils.sheet_to_csv(ws);
    descargarBlob(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
      `${nombreBase}.csv`
    );
  } else {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Liquidación");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    descargarBlob(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${nombreBase}.xlsx`
    );
  }
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

// ─────────────────────────────────────────────────────────────
// Helper de descarga
// ─────────────────────────────────────────────────────────────

function descargarBlob(blob: Blob, nombre: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
