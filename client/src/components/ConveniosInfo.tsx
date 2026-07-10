/**
 * LiquidAR — Información de Convenios Colectivos
 */

import { useState } from "react";
import { CONVENIOS, formatMonto, type Convenio } from "@/lib/convenios";

export default function ConveniosInfo() {
  const [convenioSeleccionado, setConvenioSeleccionado] = useState<Convenio | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const conveniosFiltrados = CONVENIOS.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.numero.includes(busqueda) ||
      c.sindicato.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.sector.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Sora, sans-serif" }}>
          Convenios Colectivos de Trabajo
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {CONVENIOS.length} CCT disponibles — Escalas salariales y categorías
        </p>
      </div>

      <div className="p-6">
        {/* Búsqueda */}
        <div className="relative mb-6 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, número, sindicato..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Lista de convenios */}
          <div className="space-y-2">
            {conveniosFiltrados.map((convenio) => (
              <button
                key={convenio.id}
                onClick={() => setConvenioSeleccionado(convenio)}
                className="w-full text-left p-4 rounded-xl border transition-all duration-150 hover:shadow-sm"
                style={{
                  borderColor: convenioSeleccionado?.id === convenio.id ? "var(--navy)" : "var(--border)",
                  background: convenioSeleccionado?.id === convenio.id ? "oklch(0.96 0.005 250)" : "var(--card)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                    style={{
                      background: "var(--navy)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {convenio.numero.split("/")[0].slice(0, 3)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground leading-tight">{convenio.nombre}</div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--muted-foreground)" }}
                    >
                      CCT {convenio.numero}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{convenio.sindicato}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detalle del convenio */}
          {convenioSeleccionado ? (
            <div className="space-y-6">
              {/* Info general */}
              <div className="stat-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Sora, sans-serif" }}>
                      {convenioSeleccionado.nombre}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-sm font-semibold"
                        style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                      >
                        CCT {convenioSeleccionado.numero}
                      </span>
                      <span className="text-sm text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">{convenioSeleccionado.sindicato}</span>
                    </div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "oklch(0.94 0.01 250)",
                      color: "var(--navy)",
                    }}
                  >
                    {convenioSeleccionado.sector}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{convenioSeleccionado.descripcion}</p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Jornada</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5 capitalize">
                      {convenioSeleccionado.tipoJornada}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Horas/semana</div>
                    <div
                      className="text-sm font-semibold mt-0.5"
                      style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                    >
                      {convenioSeleccionado.horasSemana}hs
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Vigencia</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">
                      {convenioSeleccionado.vigencia}
                    </div>
                  </div>
                </div>
              </div>

              {/* Escala salarial */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3" style={{ fontFamily: "Sora, sans-serif" }}>
                  Escala Salarial
                </h3>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "var(--navy)" }}>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-white/80 uppercase tracking-wide">Categoría</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-white/80 uppercase tracking-wide">
                          {convenioSeleccionado.tipoJornada === "jornal" ? "Jornal/día" : "Básico/mes"}
                        </th>
                        <th className="hidden md:table-cell px-4 py-3 text-xs font-semibold text-white/80 uppercase tracking-wide">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {convenioSeleccionado.categorias.map((cat, idx) => (
                        <tr
                          key={cat.id}
                          className="hover:bg-muted/30 transition-colors"
                          style={{ background: idx % 2 === 0 ? "transparent" : "oklch(0.985 0.001 250)" }}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">{cat.nombre}</td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className="font-semibold"
                              style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--positive)" }}
                            >
                              ${formatMonto(
                                convenioSeleccionado.tipoJornada === "jornal"
                                  ? (cat.jornal ?? cat.salarioBasico)
                                  : cat.salarioBasico
                              )}
                            </span>
                          </td>
                          <td className="hidden md:table-cell px-4 py-3 text-muted-foreground text-xs">
                            {cat.descripcion ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Adicionales */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3" style={{ fontFamily: "Sora, sans-serif" }}>
                  Adicionales del Convenio
                </h3>
                <div className="space-y-2">
                  {convenioSeleccionado.adicionales.map((adicional) => (
                    <div key={adicional.id} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-foreground">{adicional.nombre}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{adicional.descripcion}</div>
                        </div>
                        <div className="shrink-0">
                          <span
                            className="text-sm font-semibold"
                            style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                          >
                            {adicional.tipo === "porcentaje"
                              ? `${adicional.valor}%`
                              : `$${formatMonto(adicional.valor)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "oklch(0.95 0.005 250)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--navy)" }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Seleccioná un convenio para ver sus detalles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
