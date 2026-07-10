/**
 * LiquidAR — Calculadora de Aguinaldo (SAC)
 */

import { useState } from "react";
import { formatMonto } from "@/lib/convenios";

export default function AguinaldoCalc() {
  const [mejorSueldo, setMejorSueldo] = useState<number>(0);
  const [diasTrabajados, setDiasTrabajados] = useState<number>(180);
  const [semestre, setSemestre] = useState<"primero" | "segundo">("primero");

  const diasSemestre = semestre === "primero" ? 181 : 184; // días en cada semestre
  const aguinaldo = (mejorSueldo / 2) * (diasTrabajados / diasSemestre);
  const aguinaldoCompleto = mejorSueldo / 2;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Sora, sans-serif" }}>
          Calculadora de Aguinaldo (SAC)
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Sueldo Anual Complementario — Ley N° 23.041
        </p>
      </div>

      <div className="p-6 max-w-2xl">
        {/* Info */}
        <div
          className="p-4 rounded-xl mb-6 text-sm"
          style={{ background: "oklch(0.96 0.005 250)", borderLeft: "3px solid var(--navy)" }}
        >
          <p className="font-semibold text-foreground mb-1">¿Cómo se calcula el aguinaldo?</p>
          <p className="text-muted-foreground">
            El SAC equivale al <strong>50% de la mayor remuneración mensual bruta</strong> devengada
            durante el semestre. Se abona en dos cuotas: <strong>30 de junio</strong> (1er semestre)
            y <strong>18 de diciembre</strong> (2do semestre). Si el trabajador no completó el semestre,
            se calcula proporcionalmente.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-1.5">
              Semestre
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "primero" as const, label: "1er Semestre", sub: "Enero — Junio" },
                { id: "segundo" as const, label: "2do Semestre", sub: "Julio — Diciembre" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSemestre(s.id)}
                  className="p-3 rounded-lg border text-left transition-all duration-150"
                  style={{
                    borderColor: semestre === s.id ? "var(--navy)" : "var(--border)",
                    background: semestre === s.id ? "oklch(0.96 0.005 250)" : "transparent",
                  }}
                >
                  <div className="text-sm font-semibold text-foreground">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-1.5">
              Mayor remuneración bruta del semestre ($)
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
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-foreground/80 mb-1.5">
              Días trabajados en el semestre (máx. {diasSemestre})
            </label>
            <input
              type="number"
              min={1}
              max={diasSemestre}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={diasTrabajados}
              onChange={(e) => setDiasTrabajados(Math.min(diasSemestre, parseInt(e.target.value) || 1))}
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {diasSemestre} días = semestre completo
            </p>
          </div>
        </div>

        {/* Resultado */}
        {mejorSueldo > 0 && (
          <div className="mt-8 space-y-4">
            <div
              className="rounded-xl p-5"
              style={{ background: "var(--navy)" }}
            >
              <div className="text-sm text-white/70 mb-1">Aguinaldo a cobrar</div>
              <div
                className="text-4xl font-bold"
                style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--gold)" }}
              >
                ${formatMonto(aguinaldo)}
              </div>
              {diasTrabajados < diasSemestre && (
                <div className="text-xs text-white/50 mt-2">
                  Proporcional: {diasTrabajados}/{diasSemestre} días
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card">
                <div className="text-xs text-muted-foreground mb-1">SAC semestre completo</div>
                <div
                  className="text-lg font-bold"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                >
                  ${formatMonto(aguinaldoCompleto)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">50% de ${formatMonto(mejorSueldo)}</div>
              </div>
              <div className="stat-card">
                <div className="text-xs text-muted-foreground mb-1">Devengado por mes</div>
                <div
                  className="text-lg font-bold"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                >
                  ${formatMonto(mejorSueldo / 12)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">1/12 del bruto mensual</div>
              </div>
            </div>

            <div
              className="p-4 rounded-lg text-xs text-muted-foreground"
              style={{ background: "oklch(0.97 0.003 250)" }}
            >
              <strong>Fórmula:</strong> (Mayor remuneración bruta / 2) × (días trabajados / {diasSemestre})
              = ${formatMonto(mejorSueldo)} / 2 × ({diasTrabajados}/{diasSemestre})
              = <strong>${formatMonto(aguinaldo)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
