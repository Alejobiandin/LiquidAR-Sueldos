/**
 * LiquidAR — Calculadora de Indemnización por Despido
 * Art. 245 LCT
 */

import { useState } from "react";
import { formatMonto, SMVM } from "@/lib/convenios";

export default function IndemnizacionCalc() {
  const [mejorSueldo, setMejorSueldo] = useState<number>(0);
  const [antiguedad, setAntiguedad] = useState<number>(1);
  const [mesesFraccion, setMesesFraccion] = useState<number>(0);
  const [tipoDespido, setTipoDespido] = useState<"sin_causa" | "con_causa" | "voluntario">("sin_causa");

  // Art. 245 LCT: 1 mes de sueldo por año de antigüedad (mínimo 2 meses SMVM)
  const baseCalculo = Math.max(mejorSueldo, SMVM);
  const fraccionAnio = mesesFraccion >= 3 ? 1 : 0; // fracción > 3 meses = año completo
  const anosTotal = antiguedad + fraccionAnio;

  const indemnizacionArt245 = baseCalculo * anosTotal;

  // Preaviso (Art. 231 LCT)
  let diasPriorAviso = 15;
  if (antiguedad >= 1) diasPriorAviso = 30;
  if (antiguedad >= 5) diasPriorAviso = 60;
  const preaviso = (mejorSueldo / 30) * diasPriorAviso;

  // SAC sobre preaviso
  const sacPriorAviso = preaviso / 12;

  // Integración mes de despido (si no es fin de mes)
  const integracion = mejorSueldo / 30 * 15; // estimado

  // Vacaciones proporcionales (estimado)
  const vacacionesProp = (mejorSueldo / 12) * 0.5;

  const totalSinCausa = indemnizacionArt245 + preaviso + sacPriorAviso + integracion + vacacionesProp;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Sora, sans-serif" }}>
          Calculadora de Indemnización
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Despido sin justa causa — Art. 245 LCT
        </p>
      </div>

      <div className="p-6 max-w-2xl">
        {/* Info */}
        <div
          className="p-4 rounded-xl mb-6 text-sm"
          style={{ background: "oklch(0.96 0.005 250)", borderLeft: "3px solid var(--navy)" }}
        >
          <p className="font-semibold text-foreground mb-1">Art. 245 — Indemnización por antigüedad</p>
          <p className="text-muted-foreground">
            En caso de despido sin justa causa, el trabajador tiene derecho a una indemnización equivalente
            a <strong>1 mes de sueldo por cada año de antigüedad</strong> o fracción mayor a 3 meses.
            El mínimo es de <strong>2 meses del SMVM</strong>.
          </p>
        </div>

        {/* Tipo de despido */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-1.5">
            Tipo de desvinculación
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "sin_causa" as const, label: "Sin causa", sub: "Art. 245" },
              { id: "con_causa" as const, label: "Con causa", sub: "Art. 242" },
              { id: "voluntario" as const, label: "Renuncia", sub: "Art. 240" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTipoDespido(t.id)}
                className="p-3 rounded-lg border text-left transition-all duration-150"
                style={{
                  borderColor: tipoDespido === t.id ? "var(--navy)" : "var(--border)",
                  background: tipoDespido === t.id ? "oklch(0.96 0.005 250)" : "transparent",
                }}
              >
                <div className="text-sm font-semibold text-foreground">{t.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-1.5">
              Mejor remuneración bruta mensual ($)
            </label>
            <input
              type="number"
              min={0}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ej: 1.500.000"
              value={mejorSueldo || ""}
              onChange={(e) => setMejorSueldo(parseFloat(e.target.value) || 0)}
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              SMVM de referencia: ${formatMonto(SMVM)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-1.5">
                Antigüedad (años completos)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={antiguedad}
                onChange={(e) => setAntiguedad(parseInt(e.target.value) || 0)}
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-1.5">
                Fracción de año (meses)
              </label>
              <input
                type="number"
                min={0}
                max={11}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={mesesFraccion}
                onChange={(e) => setMesesFraccion(parseInt(e.target.value) || 0)}
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {mesesFraccion >= 3 ? "≥ 3 meses = 1 año adicional" : "< 3 meses = no computa"}
              </p>
            </div>
          </div>
        </div>

        {/* Resultado */}
        {mejorSueldo > 0 && tipoDespido === "sin_causa" && (
          <div className="mt-8 space-y-4">
            {/* Total */}
            <div
              className="rounded-xl p-5"
              style={{ background: "var(--navy)" }}
            >
              <div className="text-sm text-white/70 mb-1">Total estimado a cobrar</div>
              <div
                className="text-4xl font-bold"
                style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--gold)" }}
              >
                ${formatMonto(totalSinCausa)}
              </div>
              <div className="text-xs text-white/50 mt-2">
                Indemnización + Preaviso + SAC + Integración + Vacaciones prop.
              </div>
            </div>

            {/* Desglose */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide"
                style={{ background: "oklch(0.96 0.003 250)", color: "var(--navy)" }}
              >
                Desglose
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  {[
                    {
                      nombre: `Indemnización Art. 245 (${anosTotal} año${anosTotal > 1 ? "s" : ""})`,
                      monto: indemnizacionArt245,
                      detalle: `$${formatMonto(baseCalculo)} × ${anosTotal}`,
                    },
                    {
                      nombre: `Preaviso (${diasPriorAviso} días)`,
                      monto: preaviso,
                      detalle: `${diasPriorAviso} días de sueldo`,
                    },
                    {
                      nombre: "SAC sobre preaviso",
                      monto: sacPriorAviso,
                      detalle: "1/12 del preaviso",
                    },
                    {
                      nombre: "Integración mes de despido (est.)",
                      monto: integracion,
                      detalle: "Días restantes del mes",
                    },
                    {
                      nombre: "Vacaciones proporcionales (est.)",
                      monto: vacacionesProp,
                      detalle: "Días no gozados",
                    },
                  ].map((row) => (
                    <tr key={row.nombre} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="text-foreground font-medium">{row.nombre}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{row.detalle}</div>
                      </td>
                      <td
                        className="px-4 py-3 text-right font-semibold"
                        style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--positive)" }}
                      >
                        ${formatMonto(row.monto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "oklch(0.96 0.003 250)" }}>
                    <td className="px-4 py-3 font-bold text-foreground">TOTAL ESTIMADO</td>
                    <td
                      className="px-4 py-3 text-right font-bold text-lg"
                      style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                    >
                      ${formatMonto(totalSinCausa)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div
              className="p-4 rounded-lg text-xs text-muted-foreground"
              style={{ background: "oklch(0.97 0.003 250)" }}
            >
              <strong>Importante:</strong> Este cálculo es orientativo. La indemnización real puede variar
              según el CCT aplicable, topes indemnizatorios, acuerdos de empresa y resoluciones judiciales.
              Consultar con un profesional en derecho laboral.
            </div>
          </div>
        )}

        {tipoDespido === "con_causa" && (
          <div
            className="mt-8 p-5 rounded-xl text-sm"
            style={{ background: "oklch(0.97 0.003 250)", border: "1px solid var(--border)" }}
          >
            <p className="font-semibold text-foreground mb-2">Despido con justa causa (Art. 242)</p>
            <p className="text-muted-foreground">
              En caso de despido con justa causa debidamente acreditada, el trabajador <strong>no tiene derecho
              a indemnización</strong> por antigüedad ni preaviso. Solo corresponde el pago de los días
              trabajados del mes en curso y las vacaciones proporcionales no gozadas.
            </p>
          </div>
        )}

        {tipoDespido === "voluntario" && (
          <div
            className="mt-8 p-5 rounded-xl text-sm"
            style={{ background: "oklch(0.97 0.003 250)", border: "1px solid var(--border)" }}
          >
            <p className="font-semibold text-foreground mb-2">Renuncia voluntaria (Art. 240)</p>
            <p className="text-muted-foreground">
              En caso de renuncia voluntaria, el trabajador <strong>no tiene derecho a indemnización</strong>.
              Corresponde el pago de los días trabajados del mes en curso, las vacaciones proporcionales
              no gozadas y el SAC proporcional. El preaviso debe darse con <strong>15 días de anticipación</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
