/**
 * LiquidAR — Liquidación por Nómina (Masiva)
 * Subí un archivo CSV/XLSX con muchos empleados y liquidalos a la vez.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  descargarPlantilla,
  exportarResultadoNomina,
  liquidarNomina,
  parsearArchivoNomina,
  type ResultadoNomina,
} from "@/lib/nomina";
import { formatMonto, formatPeriodo, getPeriodoActual } from "@/lib/convenios";

function StatBox({
  label,
  valor,
  color = "var(--foreground)",
  sub,
}: {
  label: string;
  valor: string;
  color?: string;
  sub?: string;
}) {
  return (
    <div className="stat-card">
      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
      <div
        className="text-lg font-bold monto"
        style={{ fontFamily: "JetBrains Mono, monospace", color }}
      >
        ${valor}
      </div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

export default function NominaMasiva() {
  const [periodo, setPeriodo] = useState<string>(getPeriodoActual());
  const [resultado, setResultado] = useState<ResultadoNomina | null>(null);
  const [cargando, setCargando] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const [dragActivo, setDragActivo] = useState(false);
  // Guardamos las filas crudas para poder re-liquidar si cambia el período.
  const [filasCrudas, setFilasCrudas] = useState<Record<string, unknown>[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Opciones de período (últimos 12 + próximos 3)
  const periodos: string[] = [];
  const now = new Date();
  for (let i = -12; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    periodos.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const procesarArchivo = useCallback(
    async (file: File) => {
      setErrorArchivo(null);
      setCargando(true);
      setNombreArchivo(file.name);
      try {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["csv", "xlsx", "xls"].includes(ext ?? "")) {
          throw new Error("Formato no soportado. Subí un archivo .csv o .xlsx.");
        }
        const filas = await parsearArchivoNomina(file);
        if (filas.length === 0) {
          throw new Error("El archivo está vacío o no tiene filas de datos.");
        }
        setFilasCrudas(filas);
        setResultado(liquidarNomina(filas, periodo));
      } catch (e) {
        setErrorArchivo(e instanceof Error ? e.message : "Error al procesar el archivo.");
        setResultado(null);
        setFilasCrudas(null);
      } finally {
        setCargando(false);
      }
    },
    [periodo]
  );

  // Re-liquidar automáticamente cuando cambia el período (si ya hay datos).
  useEffect(() => {
    if (filasCrudas) {
      setResultado(liquidarNomina(filasCrudas, periodo));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) procesarArchivo(file);
    e.target.value = ""; // permitir re-subir el mismo archivo
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActivo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) procesarArchivo(file);
  };

  const t = resultado?.totales;

  return (
    <div className="p-5 space-y-6">
      {/* Encabezado interno */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--navy)", fontFamily: "Sora, sans-serif" }}
          >
            Liquidación por Nómina
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>
        <p className="text-sm text-muted-foreground">
          Subí un archivo con todos tus empleados y liquidá cientos a la vez.
        </p>
      </div>

      {/* Período + Plantilla */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-1.5">
            Período de liquidación
          </label>
          <div className="relative">
            <select
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            >
              {periodos.map((p) => (
                <option key={p} value={p}>
                  {formatPeriodo(p)}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-1.5">
            Plantilla de ejemplo
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => descargarPlantilla("xlsx")}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150 active:scale-[0.98]"
              style={{ borderColor: "var(--border)", color: "var(--navy)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Plantilla .xlsx
            </button>
            <button
              onClick={() => descargarPlantilla("csv")}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150 active:scale-[0.98]"
              style={{ borderColor: "var(--border)", color: "var(--navy)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Plantilla .csv
            </button>
          </div>
        </div>
      </div>

      {/* Zona de carga */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActivo(true);
        }}
        onDragLeave={() => setDragActivo(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-150"
        style={{
          borderColor: dragActivo ? "var(--navy)" : "var(--border)",
          background: dragActivo ? "oklch(0.96 0.005 250)" : "transparent",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
          style={{ background: "oklch(0.95 0.005 250)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "var(--navy)" }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground">
          {cargando ? "Procesando..." : "Arrastrá tu archivo o hacé click para seleccionar"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Formatos: CSV o Excel (.xlsx) · Máx. recomendado: 1000 empleados</p>
        {nombreArchivo && !cargando && (
          <p className="text-xs mt-2 font-medium" style={{ color: "var(--navy)" }}>
            📄 {nombreArchivo}
          </p>
        )}
      </div>

      {/* Error de archivo */}
      {errorArchivo && (
        <div
          className="rounded-lg p-4 text-sm flex items-start gap-2"
          style={{ background: "oklch(0.96 0.05 25)", color: "var(--negative)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorArchivo}</span>
        </div>
      )}

      {/* Resultados */}
      {resultado && (
        <>
          {/* Totales de la nómina */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--navy)" }}>
                  Totales de la Nómina — {formatPeriodo(resultado.periodo)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportarResultadoNomina(resultado, "xlsx")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.97]"
                  style={{ background: "var(--gold)", color: "oklch(0.15 0.05 85)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Exportar .xlsx
                </button>
                <button
                  onClick={() => exportarResultadoNomina(resultado, "csv")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 active:scale-[0.97]"
                  style={{ borderColor: "var(--border)", color: "var(--navy)" }}
                >
                  Exportar .csv
                </button>
              </div>
            </div>

            {t && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatBox label="Empleados" valor={t.cantidadEmpleados.toLocaleString("es-AR")} color="var(--navy)" />
                <StatBox label="Bruto Total" valor={formatMonto(t.totalBruto)} />
                <StatBox label="Neto a Pagar" valor={formatMonto(t.totalNeto)} color="var(--positive)" />
                <StatBox label="Costo Total Empleador" valor={formatMonto(t.totalCostoEmpleador)} color="var(--navy)" />
              </div>
            )}
          </div>

          {/* Cargas Sociales agregadas */}
          {t && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Cargas Sociales de la Nómina (a cargo del empleador)
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span
                  className="text-xs font-semibold monto"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}
                >
                  ${formatMonto(t.cargasSociales.total)}
                </span>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "oklch(0.96 0.003 250)" }}>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Concepto</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Nómina</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { nombre: "Jubilación (SIPA) — 16%", valor: t.cargasSociales.jubilacion },
                      { nombre: "PAMI (INSSJP) — 2%", valor: t.cargasSociales.pami },
                      { nombre: "Obra Social — 6%", valor: t.cargasSociales.obraSocial },
                      { nombre: "Fondo Nac. de Empleo — 1.5%", valor: t.cargasSociales.fondoEmpleo },
                    ].map((row) => (
                      <tr key={row.nombre} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 text-foreground">{row.nombre}</td>
                        <td className="px-4 py-2.5 text-right monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}>
                          ${formatMonto(row.valor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "oklch(0.96 0.003 250)" }}>
                      <td className="px-4 py-2.5 text-sm font-bold text-foreground">Total Cargas Sociales</td>
                      <td className="px-4 py-2.5 text-right font-bold monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}>
                        ${formatMonto(t.cargasSociales.total)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">Aportes retenidos a empleados</td>
                      <td className="px-4 py-2.5 text-right monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}>
                        ${formatMonto(t.totalAportes)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">SAC devengado (provisión)</td>
                      <td className="px-4 py-2.5 text-right monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--muted-foreground)" }}>
                        ${formatMonto(t.totalSacDevengado)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Errores de validación */}
          {resultado.errores.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--negative)" }}>
                  {resultado.errores.length} fila{resultado.errores.length > 1 ? "s" : ""} con errores (no liquidadas)
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>
              <div
                className="rounded-lg p-3 text-xs space-y-1 max-h-48 overflow-auto"
                style={{ background: "oklch(0.97 0.02 25)" }}
              >
                {resultado.errores.map((err, i) => (
                  <div key={i} style={{ color: "var(--negative)" }}>
                    <strong>Fila {err.fila}</strong> ({err.campo}): {err.mensaje}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detalle por empleado */}
          {resultado.items.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Detalle por Empleado ({resultado.items.length})
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>
              <div className="rounded-lg border border-border overflow-x-auto">
                <table className="w-full text-sm whitespace-nowrap">
                  <thead>
                    <tr style={{ background: "oklch(0.96 0.003 250)" }}>
                      {["Legajo", "Empleado", "Convenio", "Categoría", "Bruto", "Aportes", "Neto", "Cargas Soc."].map((h, i) => (
                        <th
                          key={h}
                          className={`px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${i < 4 ? "text-left" : "text-right"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {resultado.items.map(({ empleado, resultado: r }) => (
                      <tr key={`${empleado.fila}-${empleado.legajo}`} className="hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2.5 text-foreground monto" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {empleado.legajo || "—"}
                        </td>
                        <td className="px-3 py-2.5 text-foreground">
                          {empleado.apellido}
                          {empleado.nombre ? `, ${empleado.nombre}` : ""}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground text-xs">{r.convenio.nombre}</td>
                        <td className="px-3 py-2.5 text-muted-foreground text-xs">{r.categoria.nombre}</td>
                        <td className="px-3 py-2.5 text-right monto" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          ${formatMonto(r.totalBruto)}
                        </td>
                        <td className="px-3 py-2.5 text-right monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}>
                          ${formatMonto(r.aportes.total)}
                        </td>
                        <td className="px-3 py-2.5 text-right monto font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--positive)" }}>
                          ${formatMonto(r.totalNeto)}
                        </td>
                        <td className="px-3 py-2.5 text-right monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--muted-foreground)" }}>
                          ${formatMonto(r.contribuciones.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Ayuda de columnas */}
      {!resultado && !errorArchivo && (
        <div
          className="rounded-lg p-4 text-xs text-muted-foreground"
          style={{ background: "oklch(0.97 0.003 250)" }}
        >
          <strong className="text-foreground">Columnas esperadas:</strong> legajo, apellido, nombre, cuil,
          convenio, categoria, basico_manual, antiguedad, presentismo (si/no), dias_trabajados,
          horas_extras_50, horas_extras_100, comisiones, no_remunerativo, viaticos, otros,
          tipo_empleador (grande/pyme).
          <br />
          <span className="mt-1 inline-block">
            Para empleados <strong>fuera de convenio</strong>, poné{" "}
            <code style={{ fontFamily: "JetBrains Mono, monospace" }}>fuera_convenio</code> en la columna
            convenio y completá <code style={{ fontFamily: "JetBrains Mono, monospace" }}>basico_manual</code>.
          </span>
        </div>
      )}
    </div>
  );
}
