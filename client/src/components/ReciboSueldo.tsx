/**
 * LiquidAR — Recibo de Sueldo
 * Design: Documento oficial imprimible
 */

import { type ResultadoLiquidacion, formatMonto, formatPeriodo } from "@/lib/convenios";

interface DatosEmpleado {
  nombre: string;
  apellido: string;
  cuil: string;
  empresa: string;
  cuit: string;
  domicilio: string;
}

interface ReciboSueldoProps {
  resultado: ResultadoLiquidacion;
  datosEmpleado: DatosEmpleado;
  onCerrar: () => void;
}

export default function ReciboSueldo({ resultado, datosEmpleado, onCerrar }: ReciboSueldoProps) {
  const conceptosHaberes = resultado.conceptos.filter(
    (c) => c.tipo === "remunerativo" || c.tipo === "no_remunerativo"
  );
  const conceptosDeducciones = resultado.conceptos.filter((c) => c.tipo === "deduccion");

  const handleImprimir = () => {
    window.print();
  };

  const nombreCompleto =
    datosEmpleado.apellido && datosEmpleado.nombre
      ? `${datosEmpleado.apellido}, ${datosEmpleado.nombre}`
      : "Empleado/a";

  const empresa = datosEmpleado.empresa || resultado.convenio.nombre;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center no-print"
      style={{ background: "oklch(0 0 0 / 0.6)", backdropFilter: "blur(4px)" }}
    >
      <div className="w-full max-w-3xl max-h-[95vh] overflow-auto rounded-2xl shadow-2xl m-4">
        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-5 py-3 no-print rounded-t-2xl"
          style={{ background: "var(--navy)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white">Recibo de Sueldo</span>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "oklch(0.35 0.07 250)", color: "var(--gold)" }}
            >
              {formatPeriodo(resultado.periodo)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImprimir}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.97]"
              style={{ background: "var(--gold)", color: "oklch(0.15 0.05 85)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Imprimir
            </button>
            <button
              onClick={onCerrar}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
              style={{ background: "oklch(0.35 0.07 250)", color: "white" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Recibo */}
        <div className="recibo bg-white p-0">
          {/* Header del recibo */}
          <div className="recibo-header px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <div
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  {empresa}
                </div>
                {datosEmpleado.cuit && (
                  <div className="text-sm text-white/70 mt-0.5">CUIT: {datosEmpleado.cuit}</div>
                )}
                {datosEmpleado.domicilio && (
                  <div className="text-sm text-white/70">{datosEmpleado.domicilio}</div>
                )}
              </div>
              <div className="text-right">
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--gold)" }}
                >
                  RECIBO
                </div>
                <div className="text-sm text-white/70 mt-0.5">
                  {formatPeriodo(resultado.periodo)}
                </div>
                <div className="text-xs text-white/50 mt-1">
                  CCT {resultado.convenio.numero}
                </div>
              </div>
            </div>
          </div>

          {/* Datos del empleado */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Apellido y Nombre</div>
                <div className="text-sm font-semibold text-gray-900">{nombreCompleto}</div>
              </div>
              {datosEmpleado.cuil && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">CUIL</div>
                  <div
                    className="text-sm font-semibold text-gray-900"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {datosEmpleado.cuil}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Categoría</div>
                <div className="text-sm font-semibold text-gray-900">{resultado.categoria.nombre}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Convenio</div>
                <div className="text-sm font-semibold text-gray-900">
                  CCT {resultado.convenio.numero} — {resultado.convenio.sindicato}
                </div>
              </div>
            </div>
          </div>

          {/* Conceptos */}
          <div className="px-6 py-4">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th className="text-left py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">Concepto</th>
                  <th className="text-right py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">Haberes</th>
                  <th className="text-right py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">Deducciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Haberes */}
                {conceptosHaberes.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td className="py-1.5 text-gray-700">
                      {c.nombre}
                      {c.tipo === "no_remunerativo" && (
                        <span className="ml-1 text-xs text-amber-600">(NR)</span>
                      )}
                    </td>
                    <td
                      className="py-1.5 text-right"
                      style={{ fontFamily: "JetBrains Mono, monospace", color: "#166534" }}
                    >
                      ${formatMonto(c.monto)}
                    </td>
                    <td className="py-1.5 text-right text-gray-400">—</td>
                  </tr>
                ))}
                {/* Deducciones */}
                {conceptosDeducciones.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td className="py-1.5 text-gray-700">{c.nombre}</td>
                    <td className="py-1.5 text-right text-gray-400">—</td>
                    <td
                      className="py-1.5 text-right"
                      style={{ fontFamily: "JetBrains Mono, monospace", color: "#991b1b" }}
                    >
                      ${formatMonto(c.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div
            className="px-6 py-4 mx-6 mb-6 rounded-lg"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Haberes</div>
                <div
                  className="text-base font-bold"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: "#166534" }}
                >
                  ${formatMonto(resultado.totalBruto)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Deducciones</div>
                <div
                  className="text-base font-bold"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: "#991b1b" }}
                >
                  ${formatMonto(resultado.totalDeducciones)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--navy)" }}>
                  Neto a Cobrar
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                >
                  ${formatMonto(resultado.totalNeto)}
                </div>
              </div>
            </div>
          </div>

          {/* Firmas */}
          <div className="px-6 pb-6 grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border-t border-gray-300 pt-2 mt-8">
                <div className="text-xs text-gray-500">Firma y Aclaración del Empleador</div>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-300 pt-2 mt-8">
                <div className="text-xs text-gray-500">Firma y Aclaración del Trabajador</div>
              </div>
            </div>
          </div>

          {/* Footer del recibo */}
          <div
            className="px-6 py-3 text-center text-xs text-gray-400"
            style={{ borderTop: "1px solid #e5e7eb" }}
          >
            Recibo generado por LiquidAR · Liquidación de carácter orientativo · Verificar con normativa vigente
          </div>
        </div>
      </div>
    </div>
  );
}
