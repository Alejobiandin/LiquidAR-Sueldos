/**
 * LiquidAR — Panel de Resultados
 * Design: Financial Precision Tool — Real-time results
 */

import { type ResultadoLiquidacion, formatMonto, formatPeriodo } from "@/lib/convenios";

interface ResultadosPanelProps {
  resultado: ResultadoLiquidacion | null;
  onVerRecibo: () => void;
}

function MontoDisplay({
  valor,
  tipo,
  size = "md",
}: {
  valor: number;
  tipo: "positivo" | "negativo" | "neutro" | "total";
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const colors = {
    positivo: "var(--positive)",
    negativo: "var(--negative)",
    neutro: "var(--foreground)",
    total: "var(--navy)",
  };

  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-3xl font-bold",
  };

  return (
    <span
      className={`${sizes[size]} font-semibold monto`}
      style={{ color: colors[tipo], fontFamily: "JetBrains Mono, monospace" }}
    >
      ${formatMonto(valor)}
    </span>
  );
}

function ConceptoRow({
  nombre,
  monto,
  tipo,
  descripcion,
  porcentaje,
  base,
}: {
  nombre: string;
  monto: number;
  tipo: "remunerativo" | "no_remunerativo" | "deduccion";
  descripcion?: string;
  porcentaje?: number;
  base?: number;
}) {
  const tipoColor = {
    remunerativo: "var(--positive)",
    no_remunerativo: "var(--gold)",
    deduccion: "var(--negative)",
  }[tipo];

  const signo = tipo === "deduccion" ? "-" : "+";

  return (
    <div
      className="concepto-card"
      style={{ "--border-color": tipoColor } as React.CSSProperties}
    >
      <div
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
        style={{ background: tipoColor }}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">{nombre}</div>
          {descripcion && (
            <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{descripcion}</div>
          )}
          {porcentaje !== undefined && base !== undefined && (
            <div
              className="text-xs mt-1"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--muted-foreground)" }}
            >
              {porcentaje}% × ${formatMonto(base)}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <span
            className="text-sm font-semibold monto"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              color: tipoColor,
            }}
          >
            {signo}${formatMonto(monto)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ResultadosPanel({ resultado, onVerRecibo }: ResultadosPanelProps) {
  if (!resultado) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "oklch(0.95 0.005 250)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--navy)" }}>
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="8" y1="10" x2="16" y2="10"/>
            <line x1="8" y1="14" x2="12" y2="14"/>
          </svg>
        </div>
        <h3
          className="text-lg font-semibold text-foreground mb-2"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Completá los datos
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Seleccioná el convenio y la categoría para ver la liquidación en tiempo real.
        </p>
      </div>
    );
  }

  const conceptosRemunerativos = resultado.conceptos.filter((c) => c.tipo === "remunerativo");
  const conceptosNoRemunerativos = resultado.conceptos.filter((c) => c.tipo === "no_remunerativo");
  const deducciones = resultado.conceptos.filter((c) => c.tipo === "deduccion");

  return (
    <div className="p-6 space-y-6">
      {/* Header con totales clave */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-base font-semibold text-foreground"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Liquidación — {formatPeriodo(resultado.periodo)}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              CCT {resultado.convenio.numero} · {resultado.categoria.nombre}
            </p>
          </div>
          <button
            onClick={onVerRecibo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.97]"
            style={{ background: "oklch(0.95 0.005 250)", color: "var(--navy)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Recibo
          </button>
        </div>

        {/* Resumen principal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="stat-card">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Bruto Total</div>
            <MontoDisplay valor={resultado.totalBruto} tipo="neutro" size="lg" />
          </div>
          <div className="stat-card">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Deducciones</div>
            <MontoDisplay valor={resultado.totalDeducciones} tipo="negativo" size="lg" />
          </div>
          <div
            className="stat-card col-span-2"
            style={{ borderColor: "var(--navy)", borderWidth: "1.5px" }}
          >
            <div className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: "var(--navy)" }}>
              Neto a Cobrar
            </div>
            <MontoDisplay valor={resultado.totalNeto} tipo="total" size="xl" />
          </div>
        </div>
      </div>

      {/* Conceptos Remunerativos */}
      {conceptosRemunerativos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--positive)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--positive)" }}>
              Haberes Remunerativos
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span
              className="text-xs font-semibold monto"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--positive)" }}
            >
              +${formatMonto(resultado.totalBrutoRemunerativo)}
            </span>
          </div>
          <div className="space-y-1">
            {conceptosRemunerativos.map((c) => (
              <ConceptoRow
                key={c.id}
                nombre={c.nombre}
                monto={c.monto}
                tipo="remunerativo"
                descripcion={c.descripcion}
                porcentaje={c.porcentaje}
                base={c.base}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conceptos No Remunerativos */}
      {conceptosNoRemunerativos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold-dark)" }}>
              No Remunerativos
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span
              className="text-xs font-semibold monto"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--gold-dark)" }}
            >
              +${formatMonto(resultado.totalNoRemunerativo)}
            </span>
          </div>
          <div className="space-y-1">
            {conceptosNoRemunerativos.map((c) => (
              <ConceptoRow
                key={c.id}
                nombre={c.nombre}
                monto={c.monto}
                tipo="no_remunerativo"
                descripcion={c.descripcion}
              />
            ))}
          </div>
        </div>
      )}

      {/* Deducciones */}
      {deducciones.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--negative)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--negative)" }}>
              Deducciones
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span
              className="text-xs font-semibold monto"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}
            >
              -${formatMonto(resultado.totalDeducciones)}
            </span>
          </div>
          <div className="space-y-1">
            {deducciones.map((c) => (
              <ConceptoRow
                key={c.id}
                nombre={c.nombre}
                monto={c.monto}
                tipo="deduccion"
                descripcion={c.descripcion}
                porcentaje={c.porcentaje}
                base={c.base}
              />
            ))}
          </div>
        </div>
      )}

      {/* Línea de total neto */}
      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{ background: "var(--navy)" }}
      >
        <div>
          <div className="text-sm font-semibold text-white/80">SUELDO NETO A COBRAR</div>
          <div className="text-xs text-white/50 mt-0.5">{formatPeriodo(resultado.periodo)}</div>
        </div>
        <div
          className="text-2xl font-bold"
          style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--gold)" }}
        >
          ${formatMonto(resultado.totalNeto)}
        </div>
      </div>

      {/* Costo del Empleador */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Costo para el Empleador
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="stat-card">
            <div className="text-xs text-muted-foreground mb-1">Contribuciones Patronales</div>
            <MontoDisplay valor={resultado.contribuciones.total} tipo="negativo" size="md" />
            <div className="text-xs text-muted-foreground mt-1">
              Jubilación 16% + PAMI 2% + OS 6%
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-muted-foreground mb-1">Costo Total Empleador</div>
            <MontoDisplay valor={resultado.costoEmpleador} tipo="negativo" size="md" />
            <div className="text-xs text-muted-foreground mt-1">Bruto + contrib. + seg. vida</div>
          </div>
        </div>
      </div>

      {/* Aguinaldo devengado */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Aguinaldo (SAC)
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="stat-card">
            <div className="text-xs text-muted-foreground mb-1">Devengado este mes</div>
            <MontoDisplay valor={resultado.aguinaldo.devengado} tipo="neutro" size="md" />
            <div className="text-xs text-muted-foreground mt-1">1/12 del bruto remunerativo</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-muted-foreground mb-1">Cuota semestral</div>
            <MontoDisplay valor={resultado.aguinaldo.cuota} tipo="neutro" size="md" />
            <div className="text-xs text-muted-foreground mt-1">50% del mayor bruto del semestre</div>
          </div>
        </div>
      </div>

      {/* Detalle de aportes */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Detalle de Aportes
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "oklch(0.96 0.003 250)" }}>
                <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Concepto</th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Empleado</th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Empleador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { nombre: "Jubilación (SIPA)", empleado: resultado.aportes.jubilacion, empleador: resultado.contribuciones.jubilacion },
                { nombre: "PAMI (INSSJP)", empleado: resultado.aportes.pami, empleador: resultado.contribuciones.pami },
                { nombre: "Obra Social", empleado: resultado.aportes.obraSocial, empleador: resultado.contribuciones.obraSocial },
                { nombre: "Fondo Nac. Empleo", empleado: 0, empleador: resultado.contribuciones.fondoEmpleo },
                { nombre: "Cuota Sindical", empleado: resultado.aportes.sindical, empleador: 0 },
              ].map((row) => (
                <tr key={row.nombre} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 text-foreground">{row.nombre}</td>
                  <td className="px-4 py-2.5 text-right monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}>
                    {row.empleado > 0 ? `-$${formatMonto(row.empleado)}` : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}>
                    {row.empleador > 0 ? `-$${formatMonto(row.empleador)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "oklch(0.96 0.003 250)" }}>
                <td className="px-4 py-2.5 text-sm font-bold text-foreground">Total</td>
                <td className="px-4 py-2.5 text-right font-bold monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}>
                  -${formatMonto(resultado.aportes.total)}
                </td>
                <td className="px-4 py-2.5 text-right font-bold monto" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}>
                  -${formatMonto(resultado.contribuciones.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Nota legal */}
      <div
        className="rounded-lg p-4 text-xs text-muted-foreground"
        style={{ background: "oklch(0.97 0.003 250)" }}
      >
        <strong>Nota:</strong> Esta liquidación es de carácter orientativo. Los valores pueden variar según
        acuerdos específicos de empresa, zona geográfica y actualizaciones paritarias. Siempre verificar
        con el CCT vigente y la normativa de ARCA/AFIP.
      </div>
    </div>
  );
}
